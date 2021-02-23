import { ICampaignInvitation } from '@typings/campaign';
import { OfferDetail } from '@models/campaign.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICampaignDetail } from '../typings/campaign';
import { InfluencerInfo } from '../typings/influencer';
import { RequestService } from '@services/request.service';
import { environment } from '@src/environments/environment';
import { NativeWebHelperService } from './native-web-helper.service';
export interface Variant {
    title: string;
    id: number;
}

export interface InfluencerPublicProfile {
    compensation_message: string;
    inf_email: string;
    inf_phone: string;
    inf_name: string;
    influencer_address1: string;
    influencer_address2: string;
    offer_detail: any;
    product_image_list: any[];
    product_message: string;
    product_variants: Variant[];
    status: string;
    initial_payment_percentage: number;
    product_list: any[];
    platform: string;
    post_time: number;
    start_post_time: number;
    campaign_coupon_code: string;
}

@Injectable({
    providedIn: 'root',
})
export class CampaignService {
    CAMPAIGN_SERVICE_URL = environment.apiUrl;

    constructor(private http: HttpClient, private requestService: RequestService, private helpService: NativeWebHelperService) {}

    getInfluencerCampaignDetail(brandCampaignId: string, accountId: string) {
        // const token = await (await this.auth.currentUser).getIdToken();
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl = `${this.CAMPAIGN_SERVICE_URL}/share/influencer/brand_campaign_id/${brandCampaignId}/account_id/${accountId}`;
        return this.http
            .get<{ influencer_public_profile: InfluencerPublicProfile }>(reqeustUrl, httpOptions)
            .pipe(catchError(this.handleError));
    }

    getDiscoveryCampaignDetail(
        brandCampaignId: string
    ): Promise<InfluencerPublicProfile> {
        return this.requestService.sendRequest({
            method: 'GET',
            url: `/influencer/discovery_campaign_detail/${brandCampaignId}`,
        });
    }

    getDiscoveryCampaignInvitation(brandCampaignId: string): Promise<ICampaignInvitation> {
        return this.requestService.sendRequest<any>({
            method: 'GET',
            url: `/influencer/discovery_campaign_invitation/${brandCampaignId}`,
        });
    }

    applyDiscoveryCampaign(brandCampaignId: string, data: any): Promise<any> {
        return this.requestService.sendRequest({
            method: 'POST',
            url: `/influencer/discovery_campaign_invitation/${brandCampaignId}`,
            data,
        });
    }

    async getFaqAll() {
        const token = await this.helpService.getIdToken();
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl = `${this.CAMPAIGN_SERVICE_URL}/common/faq`;
        return this.http.get<any>(reqeustUrl, httpOptions).pipe(catchError(this.handleError));
    }

    inputInfluencerInfo(brandCampaignId: string, accountId: string, influencerInfo: InfluencerInfo) {
        return this.requestService.sendRequest<any>({
            method: 'PUT',
            url: '/influencer/influencer',
            data: {
                brand_campaign_id: brandCampaignId,
                account_id: accountId,
                ...influencerInfo,
            },
        });
    }

    declineInfluencerOffer(brandCampaignId: string, accountId: string, decline_type: string, decline_text_reason: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl = `${this.CAMPAIGN_SERVICE_URL}/share/influencer_offer`;
        return this.http
            .put<any>(
                reqeustUrl,
                {
                    brand_campaign_id: brandCampaignId,
                    account_id: accountId,
                    accept: false,
                    decline_type,
                    decline_text_reason,
                },
                httpOptions
            )
            .pipe(catchError(this.handleError));
    }

    getSignUrl(brandCampaignId, email) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl = `${this.CAMPAIGN_SERVICE_URL}/share/embedded/sign_url/brand_campaign_id/${brandCampaignId}/email/${email}`;
        return this.http.get<ICampaignDetail[]>(reqeustUrl, httpOptions).pipe(catchError(this.handleError));
    }

    completeSign(brandCampaignId: string, signatureId: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl =
            `${this.CAMPAIGN_SERVICE_URL}/share/signature_complete/` + `brand_campaign_id/${brandCampaignId}/signature_id/${signatureId}`;
        return this.http.put<any>(reqeustUrl, {}, httpOptions).pipe(catchError(this.handleError));
    }

    getCampaignById(campaignId) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl = `${this.CAMPAIGN_SERVICE_URL}/common/campaign/campaign_id/${campaignId}`;
        return this.http.get<any>(reqeustUrl, httpOptions).pipe(catchError(this.handleError));
    }

    getInfluencerCampaignById(campaignId): Promise<ICampaignDetail> {
        return this.requestService.sendRequest({
            method: 'GET',
            url: `/influencer/campaign/${campaignId}`,
        });
    }

    get handleError() {
        return this.helpService.handleError;
    }
}
