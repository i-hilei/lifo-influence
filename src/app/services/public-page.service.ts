import { Injectable } from '@angular/core';
import { RequestService } from '@services/request.service';
import { ICampaignInvitation } from '@typings/campaign';

@Injectable({
    providedIn: 'root',
})
export class PublicPageService {
    constructor(private requestService: RequestService) {}

    getCampaignInvitation(brandCampaignId: string, accountId: string) {
        return this.requestService.sendRequest<ICampaignInvitation>({
            method: 'GET',
            url: `/share/invitation_by_cmapaign/${brandCampaignId}/${accountId}`,
        });
    }
}
