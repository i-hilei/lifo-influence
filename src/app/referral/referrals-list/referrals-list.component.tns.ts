import { Component, OnInit } from '@angular/core';
import { ReferralsService } from '@src/app/referral/referrals.service';
import { IInstagramNotableUser } from '@typings/profile.typings';
import { ProfileService } from '@services/profile.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogParams } from '@nativescript/angular';
import { alert, AlertOptions } from '@nativescript/core';

import { setText } from 'nativescript-clipboard';
import { ToastService } from '@services/toast.service';

@Component({
    selector: 'app-referrals-list',
    templateUrl: './referrals-list.component.tns.html',
    styleUrls: ['./referrals-list.component.tns.scss'],
})
export class ReferralsListComponent implements OnInit {
    availableReferrals: IInstagramNotableUser[] = [];
    inviteList: string[] = [];
    lotteryId: string = null;
    isLoading: boolean = false;
    referralLink: string = 'Test referral';

    get referralToInviteCount() {
        return this.availableReferrals.filter((referral) => referral.invite && !referral.invited && !referral.is_registered).length;
    }

    get inviteBtnText() {
        return this.referralToInviteCount > 0 ? `Email Invite ${this.referralToInviteCount} Influencers` : 'Select Influencers To Invite';
    }

    constructor(
        private referralsService: ReferralsService,
        public profileService: ProfileService,
        private activatedRoute: ActivatedRoute,
        private modalParams: ModalDialogParams,
        private toastService: ToastService
    ) {
        this.lotteryId = this.activatedRoute.snapshot.paramMap.get('lottery_id');
        this.referralsService.getInvitationLink(this.lotteryId ? this.lotteryId : null).then((code) => {});
    }

    ngOnInit(): void {
        this.getAvailableReferrals();
    }

    getAvailableReferrals() {
        this.isLoading = true;
        this.referralsService.getPossibleReferrals().then((res) => {
            if (!res.length) {
                this.isLoading = false;
                return;
            }
            res.forEach((referral) => {
                referral.invite = true;
            });
            this.availableReferrals = res;
            this.inviteList = [];
            this.isLoading = false;
        });
    }

    changeInviteReferralsList(availableReferralItem: IInstagramNotableUser) {
        if (!availableReferralItem.is_registered && !availableReferralItem.invited) {
            availableReferralItem.invite = !availableReferralItem.invite;
        }
    }

    inviteReferrals() {
        const referralsToInvite = this.availableReferrals
            .filter((referral) => referral.invite && !referral.invited && !referral.is_registered)
            .map((referral) => {
                return {
                    instagram_id: referral.username,
                    email: referral.email,
                };
            });

        // Don't need to wait until message sent
        const options: AlertOptions = { title: 'Success', message: 'Referrals invited successfully!', okButtonText: 'Ok' };
        alert(options);

        this.referralsService
            .inviteReferrals(
                {
                    invitation_link: this.referralLink,
                    referee_list: referralsToInvite,
                },
                this.lotteryId
            )
            .then(() => {
                // this.getAvailableReferrals();
                this.availableReferrals
                    .filter((referral) => referral.invite && !referral.is_registered && !referral.invited)
                    .forEach((referral) => {
                        referral.invited = true;
                    });
            })
            .catch((error) => {
                const options: AlertOptions = { title: 'Error', message: error?.message || 'Error', okButtonText: 'Ok' };
                alert(options);
            });
    }

    copyToClipboard() {
        const alertOptions: AlertOptions = {
            message: 'Copy successed!',
            okButtonText: 'Ok',
        };
        setText(this.referralLink)
            .then(() => {
                alert(alertOptions);
            })
            .catch(() => {
                alertOptions.message = 'Copy failed!';
                alert(alertOptions);
            });
    }

    close() {
        this.modalParams.closeCallback();
    }
}
