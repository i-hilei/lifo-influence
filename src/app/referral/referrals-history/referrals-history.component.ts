import {Component, OnInit} from '@angular/core';
import {ReferralsService} from '@src/app/referral/referrals.service';
import {ReferralHistoryModel} from '@models/referral.model';
import {ReferralStatuses} from '@typings/referrals.typings';
import {LotteryService} from '@src/app/lottery/lottery.service';

@Component({
    selector: 'app-referrals-history',
    templateUrl: './referrals-history.component.html',
    styleUrls: ['./referrals-history.component.scss'],
})
export class ReferralsHistoryComponent implements OnInit {
    ReferralStatuses = ReferralStatuses;
    referrals: ReferralHistoryModel[] = [];
    lotteryReferrals: ReferralHistoryModel[] = [];

    status_LABELS = {
        [ReferralStatuses.invited]: 'Invitation Sent',
        [ReferralStatuses.signed_up]: 'Signed up',
        [ReferralStatuses.campaign_completed]: 'Campaign Completed',
    };

    constructor(
        private referralsService: ReferralsService,
        public lotteryService: LotteryService,
    ) {
    }

    ngOnInit(): void {
        this.referralsService.getReferralsHistory().then((res) => {
            const referrals = res.map((referralHistory) => new ReferralHistoryModel(referralHistory));
            this.lotteryReferrals = referrals.filter(referral => !!referral.invited_to_lottery);
            this.referrals = referrals.filter(referral => !referral.invited_to_lottery);
        });
    }
}
