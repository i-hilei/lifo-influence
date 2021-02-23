import { alert, AlertOptions, confirm, ConfirmOptions, Page } from '@nativescript/core';
import { Component, OnInit } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { ProfileService } from '@services/profile.service';
import { ToastService } from '@services/toast.service';
import { AccountBalance, MyEarningsService, TransactionItem } from '@src/app/my-earnings/my-earnings.service';
import { ICampaignDetail } from '@typings/campaign';
import { CampaignsService } from '@services/campaigns.service';
import * as dayjs from 'dayjs';
import { environment } from '@src/environments/environment.prod';
import { openUrl } from '@nativescript/core/utils';

registerElement('PullToRefresh', () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh);

@Component({
    selector: 'app-my-earning',
    templateUrl: './my-earnings.component.tns.html',
    styleUrls: ['./my-earnings.component.tns.scss'],
})
export class MyEarningsComponent implements OnInit {
    firstLoading = true;
    campaigns: ICampaignDetail[];
    campaignMap: { [key: string]: ICampaignDetail } = {};
    accountBalance: AccountBalance;
    transactionList: TransactionItem[];
    appSchema = 'lifotest';

    get currentUserProfile() {
        return this.profileService.currentProfile;
    }

    get paypalLink() {
        const url = `${environment.paypal.websiteUrl}/connect`;
        const flowEntry = 'flowEntry=static';
        const client_id = `client_id=${environment.paypal.clientId}`;
        const scope = 'scope=email%20address';
        const redirect_uri = `redirect_uri=${this.appSchema}://influencer.lifo.com?type=paypal`;
        return `${url}?${flowEntry}&${client_id}&${scope}&${redirect_uri}`;
    }

    constructor(
        private myEarningService: MyEarningsService,
        private profileService: ProfileService,
        private cmapaignsService: CampaignsService,
        private toastService: ToastService,
        private page: Page
    ) {}

    async ngOnInit() {
        this.page.actionBarHidden = true;
        this.getAccountBalance();
        this.getTransactionData().finally(() => (this.firstLoading = false));
    }

    getTransactionData() {
        return Promise.all([this.cmapaignsService.getCampaign(), this.myEarningService.getTransactionHistory()])
            .then((results) => {
                const [campaigns, transactionHistories] = results;
                const { campaignMap, transactionList } = this.handleTransactionData(transactionHistories, campaigns);

                this.campaigns = campaigns;
                this.campaignMap = campaignMap;
                this.transactionList = transactionList;
            })
            .catch(() => this.toastService.show({ text: 'Get trasaction history failed. Please pull to refresh again' }));
    }

    getAccountBalance() {
        this.myEarningService
            .getAccountBalance()
            .then((res) => (this.accountBalance = res))
            .catch(() => this.toastService.show({ text: 'Get accout balance failed. Please pull to refresh again' }));
    }

    refreshList(args) {
        const pullRefresh = args.object;
        this.getAccountBalance();
        this.getTransactionData().then(() => (pullRefresh.refreshing = false));
    }

    cashOut() {
        this.myEarningService
            .cashOut(this.accountBalance?.account_balance)
            .then(() => {
                this.accountBalance.account_balance = 0;
                this.getTransactionData();
                this.toastService.show({ text: 'Cash out success!' });
            })
            .catch((err) => this.toastService.show({ text: 'Cash out Failed! Please try again' }));
    }

    requestCashOut() {
        if (this.currentUserProfile?.paypal_address) {
            if (this.accountBalance?.account_balance) {
                this.showCashoutConfirmDialog();
            } else {
                this.showNoAmountDialog();
            }
        } else {
            openUrl(this.paypalLink);
        }
    }

    getFormattedDate(date: string, format: string = 'D MMM HH:mm', offset: number = 0) {
        return dayjs(date).add(offset, 'day').format(format);
    }

    showPendingDialog(transaction: TransactionItem) {
        const options: AlertOptions = {
            title: 'Commssion',
            message: `This commission will be ready for payment after ${this.getFormattedDate(
                transaction?.transaction_time,
                'MMM D, YYYY',
                30
            )}`,
            okButtonText: 'OK',
        };
        alert(options);
    }

    showCashoutConfirmDialog() {
        const amount = this.accountBalance?.account_balance;
        const paypal = this.currentUserProfile?.paypal;
        const options: ConfirmOptions = {
            title: 'Request Payment',
            message: `You are requesting a payment of ${amount} to your PayPal account: ${paypal}`,
            okButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        };
        confirm(options).then((isOk) => {
            if (isOk) {
                this.cashOut();
            }
        });
    }

    showNoAmountDialog() {
        const options: AlertOptions = {
            title: null,
            message: 'No balance in account',
            okButtonText: 'Ok',
        };
        alert(options).then((isOk) => {
            console.log(isOk);
        });
    }

    private handleTransactionData(transactionHistories, campaigns: ICampaignDetail[]) {
        const campaignMap: { [key: string]: ICampaignDetail } = {};
        const transactionList = transactionHistories
            .filter((item) => item.transaction_type !== 'CREDIT_CONVERT')
            .sort((item1, item2) => item2.transaction_time.localeCompare(item1.transaction_time))
            .map((transItem) => {
                const matchedCampaign = campaigns.find((item) => item.brand_campaign_id === transItem.meta_data?.campaign_id);
                campaignMap[transItem.meta_data?.campaign_id] = matchedCampaign;
                return transItem;
            });
        return { campaignMap, transactionList };
    }
}
