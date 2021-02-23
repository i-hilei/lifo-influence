import { Component, OnInit } from '@angular/core';

// Service
import { AccountBalance, MyEarningsService, TransactionItem } from './my-earnings.service';
import { ProfileService } from '@services/profile.service';
import { ToastService } from 'ng-zorro-antd-mobile';
import { CampaignsService } from '@services/campaigns.service';

// type
import { ProfileModel } from '@models/profile.model';
import { HeaderConfig } from '@shared/components/page-header/page-header.component';
import { ICampaignDetail } from '@typings/campaign';

// lib
import * as dayjs from 'dayjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-my-earning',
    templateUrl: './my-earnings.component.html',
    styleUrls: ['./my-earnings.component.scss'],
})
export class MyEarningsComponent implements OnInit {
    accountBalance: AccountBalance;
    transactionList: TransactionItem[];
    campaigns: ICampaignDetail[];

    campaignMap: { [key: string]: ICampaignDetail } = {};

    selectedTransaction: TransactionItem;

    paypal: string = '';

    currentUserProfile: ProfileModel;

    dialogState = {
        pendingDialog: {
            status: false,
            footer: [
                {
                    text: 'Ok',
                    onPress: () => {
                        this.closeDialog('pendingDialog');
                    },
                },
            ],
        },
        paypalEmailDialog: {
            status: false,
            footer: [
                {
                    text: 'Confirm',
                    onPress: async () => {
                        this.currentUserProfile.paypal = this.paypal;
                        const newProfileObj = this.currentUserProfile.getEditableObject();
                        this.myEarningService
                            .updateAccountInfo(newProfileObj)
                            .then((updatedProfile) => {
                                this.profileService.currentProfile = new ProfileModel(updatedProfile);
                                this.toastService.success('Update account information success', 2000, null, false);
                                this.closeDialog('paypalEmailDialog');
                                this.openDialog('cashOutConfirmDialog');
                            })
                            .catch(() => {
                                this.toastService.fail('Error, please try again later', 2000, null, false);
                            });
                    },
                },
            ],
        },
        cashOutConfirmDialog: {
            status: false,
            footer: [
                {
                    text: 'Cancel',
                    onPress: () => {
                        this.closeDialog('cashOutConfirmDialog');
                    },
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        this.cashOut();
                        this.closeDialog('cashOutConfirmDialog');
                    },
                },
            ],
        },
    };

    pageHeaderConfig: HeaderConfig = {
        title: 'My Earnings',
        backUrl: '/dashboard',
    };

    constructor(
        private myEarningService: MyEarningsService,
        private profileService: ProfileService,
        private toastService: ToastService,
        private cmapaignsService: CampaignsService,
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) {}

    get paidCount() {
        const total_earning = this.accountBalance?.total_earning;
        const pending_balance = this.accountBalance?.pending_balance;
        const account_balance = this.accountBalance?.account_balance;

        return total_earning - pending_balance - account_balance || 0;
    }

    async ngOnInit() {
        this.getAccountBalance();

        Promise.all([this.cmapaignsService.getCampaign(), this.myEarningService.getTransactionHistory()]).then((results) => {
            const [campaigns, transactionHistories] = results;

            this.campaigns = campaigns;

            this.transactionList = transactionHistories
                .filter((item) => item.transaction_type !== 'CREDIT_CONVERT')
                .sort((item1, item2) => {
                    return item2.transaction_time.localeCompare(item1.transaction_time);
                })
                .map((transItem) => {
                    const matchedCampaign = this.campaigns.find((item) => item.brand_campaign_id === transItem.meta_data?.campaign_id);
                    this.campaignMap[transItem.meta_data?.campaign_id] = matchedCampaign;
                    return transItem;
                });
        });
        this.currentUserProfile = this.profileService.currentProfile;
        this.pageHeaderConfig.queryParams = this.activatedRoute.snapshot.queryParams;
    }

    getAccountBalance() {
        this.myEarningService
            .getAccountBalance()
            .then((res) => {
                this.accountBalance = res;
            })
            .catch((err) => {
                // TODO: Add fail dialog
            });
    }

    getTransactionHistory() {
        this.myEarningService
            .getTransactionHistory()
            .then((res) => {
                this.transactionList = res
                    .filter((item) => item.transaction_type !== 'CREDIT_CONVERT')
                    .sort((item1, item2) => {
                        return item2.transaction_time.localeCompare(item1.transaction_time);
                    });
                // Warning: Here we assume that if there are no transactionList, api will return []
            })
            .catch((err) => {
                // TODO: Add fail dialog
            });
    }

    cashOut() {
        this.myEarningService
            .cashOut(this.accountBalance?.account_balance)
            .then(() => {
                this.getTransactionHistory();
                this.accountBalance.account_balance = 0;
                this.toastService.success('Success', 2000, null, false);
            })
            .catch(() => {
                this.toastService.fail('Error, please try again later', 2000, null, false);
            });
    }

    closeDialog(key) {
        this.dialogState[key].status = false;
    }

    openDialog(key: string, transaction?: TransactionItem) {
        if (transaction) {
            this.selectedTransaction = transaction;
        }
        this.dialogState[key].status = true;
    }

    requetCashOutBtnClick() {
        if (this.currentUserProfile?.paypal) {
            this.openDialog('cashOutConfirmDialog');
        } else {
            this.openDialog('paypalEmailDialog');
        }
    }

    getFormattedDate(date: string, format: string = 'D MMM HH:mm', offset: number = 0) {
        return dayjs(date).add(offset, 'day').format(format);
    }

    back() {
        this.router.navigate(['/dashboard']);
    }

    getTransactionName(transaction) {
        return  transaction.transaction_type === 'CASH_OUT'
        ? 'Payment' : transaction.transaction_type === 'SHOP_PAYMENT'
        ? 'Lifo Shop Sample' : transaction.transaction_type === 'SHOP_COMMISSION'
        ? 'Lifo Shop Commission' : transaction.transaction_type === 'CREDIT'
        ? 'Award Credit'
        : this.campaignMap[transaction.meta_data?.campaign_id]?.product_name;
    }

    getTransactionType(transaction) {

    }
}
