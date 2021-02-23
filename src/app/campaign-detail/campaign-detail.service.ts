import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeWebHelperService } from '@services/native-web-helper.service';

import { catchError } from 'rxjs/operators';

import { HandleErrorService } from '@services/handle-error.service';

import { ICampaignDetail } from '@src/app/typings/campaign';
import { environment } from '@src/environments/environment';

export interface CampaignContent {
    images: { url: string; path: string }[];
    videos: { url: string; path: string }[];
}

@Injectable({
    providedIn: 'root',
})
export class CampaignDetailService {
    BASEURL = environment.apiUrl;

    constructor(private http: HttpClient, private handleErrorService: HandleErrorService, private helpService: NativeWebHelperService) {}

    async getCampaignById(campaignId) {
        const token = await this.helpService.getIdToken();

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: token,
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl = `${this.BASEURL}/common/campaign/campaign_id/${campaignId}`;
        return this.http
            .get<{ history_list: ICampaignDetail[] }>(reqeustUrl, httpOptions)
            .pipe(catchError(this.handleErrorService.handleError));
    }

    async updateCampaign(campaignId: string, detail: ICampaignDetail, content: CampaignContent, description: string) {
        const token = await this.helpService.getIdToken();

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: token,
                'Content-Type': 'application/json',
            }),
        };
        const reqeustUrl = `${this.BASEURL}/update_campaign/campaign_id/${campaignId}`;
        const body: ICampaignDetail = {
            ...((detail || {}) as ICampaignDetail),
            content,
            description,
        };

        return this.http.put(reqeustUrl, body, httpOptions).pipe(catchError(this.handleErrorService.handleError));
    }
}
