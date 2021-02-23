import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ReferralsService } from '@src/app/referral/referrals.service';
import { ReferralHistoryModel } from '@models/referral.model';
import { ReferralStatuses } from '@typings/referrals.typings';
import { LotteryService } from '@src/app/lottery/lottery.service';
import { DialogsService } from '@services/dialogs.service';
import { ReferralsListComponent } from '@src/app/referral/referrals-list/referrals-list.component';

@Component({
    selector: 'app-referrals-history',
    templateUrl: './referrals-history.component.tns.html',
    styleUrls: ['./referrals-history.component.tns.scss'],
})
export class ReferralsHistoryComponent implements OnInit {
    ReferralStatuses = ReferralStatuses;
    referrals: ReferralHistoryModel[];
    lotteryReferrals: ReferralHistoryModel[];

    status_LABELS = {
        [ReferralStatuses.invited]: 'Invitation Sent',
        [ReferralStatuses.signed_up]: 'Signed up',
        [ReferralStatuses.campaign_completed]: 'Campaign Completed',
    };

    get referralList() {
        return [...(this.referrals || []), ...(this.lotteryReferrals || [])];
    }

    constructor(
        private referralsService: ReferralsService,
        private dialogService: DialogsService,
        public lotteryService: LotteryService,
        public vcRef: ViewContainerRef
    ) {}

    ngOnInit(): void {
        // this.dialogService.showLoading(this.vcRef);
        this.referralsService.getReferralsHistory().then((res) => {
            const referrals = res.map((referralHistory) => new ReferralHistoryModel(referralHistory));
            this.lotteryReferrals = referrals.filter((referral) => !!referral.invited_to_lottery);
            this.referrals = referrals.filter((referral) => !referral.invited_to_lottery);
        });
        // .finally(() => this.dialogService.hiddenLoading());
    }

    openInviteFriendDialog() {
        this.dialogService.showModal(ReferralsListComponent, {
            viewContainerRef: this.vcRef,
            dimAmount: 0.5,
            closeCallback: null,
            context: null,
        });
    }
}
