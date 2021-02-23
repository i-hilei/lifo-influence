import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ProfileModel} from '@models/profile.model';

import {AccountBalance, MyEarningsService} from '@src/app/my-earnings/my-earnings.service';
import {ProfileService} from '@services/profile.service';
import {ToastService} from 'ng-zorro-antd-mobile';
import {PaypalService} from '@services/paypal.service';
import {MessagesService} from '@shared/messages/messages.service';
import {MessageLevel, MessageType} from '@typings/system.typings';

@Component({
    selector: 'app-dashboard-wallet',
    templateUrl: './dashboard-wallet.component.html',
    styleUrls: ['./dashboard-wallet.component.scss'],
})
export class DashboardWalletComponent implements OnInit {
    dialogState = {
        noBalanceDialog: {
            status: false,
            footer: [
                {
                    text: 'Ok',
                    onPress: () => this.closeDialog('noBalanceDialog'),
                },
            ],
        },
        paypalEmailDialog: {
            status: false,
            footer: [
                {
                    text: 'Cancel',
                    onPress: () => this.closeDialog('paypalEmailDialog'),
                },
                {
                    text: 'Connect',
                    onPress: () => {
                        this.window.location.href = this.paypalService.getPaypalLink('?page=dashboard');
                    },
                },
            ],
        },
        cashOutConfirmDialog: {
            status: false,
            footer: [
                {
                    text: 'Cancel',
                    onPress: () => this.closeDialog('cashOutConfirmDialog'),
                },
                {
                    text: 'Confirm',
                    onPress: () => this.cashOut(),
                },
            ],
        },
    };

    paypal: string;

    accountBalance: AccountBalance;

    currentUserProfile: ProfileModel;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private myEarningService: MyEarningsService,
        private toastService: ToastService,
        private profileService: ProfileService,
        private paypalService: PaypalService,
        private messagesService: MessagesService,
        @Inject(Window) private window: Window,
    ) {
        if (this.router.getCurrentNavigation().extras.state &&
            typeof this.router.getCurrentNavigation().extras.state === 'object') {
            const message = this.router.getCurrentNavigation().extras.state.message;
            const messageType = this.router.getCurrentNavigation().extras.state.messageType;
            if (message && messageType) {
                this.messagesService.showMessage({
                    messageLevel: MessageLevel[messageType],
                    text: message,
                    showOverlay: true,
                    type: MessageType.message,
                })
            }
        }
    }

    ngOnInit(): void {
        this.myEarningService.getAccountBalance().then((res) => {
            this.accountBalance = res;
        });
        this.currentUserProfile = this.profileService.currentProfile;
    }

    requetCashOutBtnClick() {
        if (this.currentUserProfile?.paypal) {
            if (this.accountBalance?.account_balance) {
                this.openDialog('cashOutConfirmDialog');
            } else {
                this.openDialog('noBalanceDialog');
            }
        } else {
            this.openDialog('paypalEmailDialog');
        }
    }

    cashOut() {
        this.myEarningService
            .cashOut(this.accountBalance?.account_balance)
            .then(() => {
                this.accountBalance.account_balance = 0;
                this.toastService.success('Success', 2000, null, false);
            })
            .catch(() => {
                this.toastService.fail('Error, please try again later', 2000, null, false);
            })
            .finally(() => {
                this.closeDialog('cashOutConfirmDialog');
            });
    }

    async afterConfirmEmail() {
        this.currentUserProfile.paypal = this.paypal;
        const newProfileObj = this.currentUserProfile.getEditableObject();

        this.myEarningService
            .updateAccountInfo(newProfileObj)
            .then((updatedProfile) => {
                this.profileService.currentProfile = new ProfileModel(updatedProfile);
                this.toastService.success('Update account information success', 2000, null, false);
                this.closeDialog('paypalEmailDialog');
                if (this.accountBalance?.account_balance) {
                    this.openDialog('cashOutConfirmDialog');
                }
            })
            .catch((err) => {
                console.error(err);
                this.toastService.fail('Error, please try again later', 2000, null, false);
            });
    }

    openDialog(key: string) {
        this.dialogState[key].status = true;
    }

    closeDialog(key) {
        this.dialogState[key].status = false;
    }

    goPage(path: string) {
        this.router.navigate([path], {
            queryParams: this.activatedRoute.snapshot.queryParams,
        });
    }
}
