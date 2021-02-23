import { Injectable } from '@angular/core';
import { RequestService } from '@services/request.service';
import { ICampaignDetail, ICampaignInvitation } from '@src/app/typings/campaign';

@Injectable({
    providedIn: 'root',
})
export class CampaignsService {
    constructor(private requestService: RequestService) {}

    getCampaign(): Promise<ICampaignDetail[]> {
        return this.requestService.sendRequest<ICampaignDetail[]>({
            method: 'GET',
            url: '/influencer/campaign',
        });
    }

    getDiscoveryCampaign(): Promise<ICampaignDetail[]> {
        return this.requestService.sendRequest({
            method: 'GET',
            url: '/influencer/discovery_campaigns',
        });
    }

    addContentPost(campaingId, accountId, link): Promise<ICampaignDetail[]> {
        return this.requestService.sendRequest<ICampaignDetail[]>({
            method: 'POST',
            url: '/influencer/post_content',
            data: {
                brand_campaign_id: campaingId,
                account_id: accountId,
                link,
            },
        });
    }

    addProductOrderNumber(campaignId: string, accountId: string, orderNumber: string) {
        return this.requestService.sendRequest({
            method: 'PUT',
            url: `/influencer/submit_order/brand_campaign_id/${campaignId}/account_id/${accountId}`,
            data: {
                order_number: orderNumber,
            },
        });
    }

    submitContent(campaingId): Promise<any> {
        return this.requestService.sendRequest<any>({
            method: 'PUT',
            url: '/influencer/submit_content',
            data: {
                brand_campaign_id: campaingId,
                account_id: null,
            },
        });
    }

    getCampaignInvitation(brandCampaignId): Promise<ICampaignInvitation> {
        return this.requestService.sendRequest<ICampaignInvitation>({
            method: 'GET',
            url: `/influencer/invitation_by_cmapaign/${brandCampaignId}`,
        });
    }

    getAllCampaignInvitation(): Promise<{ string: ICampaignInvitation }> {
        return this.requestService.sendRequest<{ string: ICampaignInvitation }>({
            method: 'GET',
            url: '/influencer/invitations',
        });
    }

    getCampaignInvitationStatus(brandCampaignId): Promise<any> {
        return this.requestService.sendRequest({
            method: 'GET',
            url: `/share/recruit-status/brand_campaign_id/${brandCampaignId}`,
        });
    }

    acceptCampaignInvitation(brandCampaignId, accept, isApply = false) {
        return this.requestService.sendRequest<any>({
            method: 'PUT',
            url: `/share/accept-invitation/brand_campaign_id/${brandCampaignId}/accept/${accept}`,
            data: { is_apply: isApply },
        });
    }

    setAsDelivered(brandCampaignId, accountId) {
        return this.requestService.sendRequest<any>({
            method: 'PUT',
            url: `/influencer/receive_shipping/brand_campaign_id/${brandCampaignId}/account_id/${accountId}`,
            data: {
                brand_campaign_id: brandCampaignId,
                account_id: accountId,
            },
        });
    }

    getShippingInfo(carrier: string, tracking_number: string) {
        return this.requestService.sendRequest({
            method: 'GET',
            url: `/share/track_shipping/${carrier}/${tracking_number}`,
        });
    }
}
