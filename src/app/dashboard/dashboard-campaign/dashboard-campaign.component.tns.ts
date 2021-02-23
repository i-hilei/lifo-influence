import { Page } from '@nativescript/core';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { ProfileService } from '@services/profile.service';
import { CampaignsService } from '@services/campaigns.service';
import { orderCampaignList } from '../dashboard-methods';
import { ICampaignInvitation, ICampaignDetail } from '@typings/campaign';
import { CampaignModel, OFFER_STATUS_TYPES } from '@models/campaign.model';

@Component({
    selector: 'app-dashboard-campaign',
    templateUrl: './dashboard-campaign.component.html',
    styleUrls: ['./dashboard-campaign.component.scss'],
})
export class DashboardCampaignComponent implements OnInit {
    OFFER_STATUS_TYPES = OFFER_STATUS_TYPES;
    firstLoading = true;
    selectedTab: OFFER_STATUS_TYPES = OFFER_STATUS_TYPES.new;

    originCampaignListObj = {
        [OFFER_STATUS_TYPES.new]: null,
        [OFFER_STATUS_TYPES.active]: null,
        [OFFER_STATUS_TYPES.completed]: null,
    };

    get campaignList() {
        return this.originCampaignListObj[this.selectedTab];
    }

    constructor(
        private cdr: ChangeDetectorRef,
        private page: Page,
        public profileService: ProfileService,
        public campaignsService: CampaignsService
    ) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.getData().finally(() => (this.firstLoading = false));
        this.cdr.detectChanges();
    }

    getData() {
        return Promise.all([this.campaignsService.getAllCampaignInvitation(), this.campaignsService.getCampaign()])
            .then(([invitations, iCampaigns]) => this.handleData(invitations, iCampaigns))
            .catch((err) => console.log(err));
    }

    handleData(invitations: { [key: string]: ICampaignInvitation }, iCampaigns: ICampaignDetail[]) {
        const campaigns: CampaignModel[] = iCampaigns.map((campaignObj) => new CampaignModel(campaignObj, invitations));

        const orderedCampaignListNew = orderCampaignList(campaigns, 'mycampaign', invitations, OFFER_STATUS_TYPES.new);
        const orderedCampaignListActive = orderCampaignList(campaigns, 'mycampaign', invitations, OFFER_STATUS_TYPES.active);
        const orderedCampaignListCompleted = orderCampaignList(campaigns, 'mycampaign', invitations, OFFER_STATUS_TYPES.completed);
        this.originCampaignListObj[OFFER_STATUS_TYPES.new] = orderedCampaignListNew;
        this.originCampaignListObj[OFFER_STATUS_TYPES.active] = orderedCampaignListActive;
        this.originCampaignListObj[OFFER_STATUS_TYPES.completed] = orderedCampaignListCompleted;
    }

    selectTab(tab: OFFER_STATUS_TYPES) {
        this.selectedTab = tab;
    }
}
