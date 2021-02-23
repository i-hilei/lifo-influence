import { Injectable } from '@angular/core';
import { RequestService } from '@services/request.service';
import { ProfileService } from '@services/profile.service';
import { IInstagramNotableUser } from '@typings/profile.typings';
import { IReferralHistory } from '@typings/referrals.typings';

@Injectable({
    providedIn: 'root',
})
export class ReferralsService {
    constructor(private requestService: RequestService, private profileService: ProfileService) {}

    getPossibleReferrals(): Promise<IInstagramNotableUser[]> {
        return this.requestService.sendRequest<IInstagramNotableUser[]>({
            method: 'GET',
            url: '/influencer/possible-referrals',
        });
    }

    inviteReferrals(data, lottery_id: string = null) {
        return this.requestService.sendRequest({
            method: 'POST',
            url: `/influencer/invite-referrals/${lottery_id ? lottery_id : ''}`,
            data,
        });
    }

    getReferralsHistory(): Promise<IReferralHistory[]> {
        return this.requestService.sendRequest<any>({
            method: 'GET',
            url: '/influencer/referrals',
        });
    }

    getInvitationLink(lotteryId: string = null) {
        return this.requestService.sendRequest<any>({
            method: 'GET',
            url: `/influencer/invitation-code/${lotteryId ? lotteryId : ''}`,
        });
    }
}
