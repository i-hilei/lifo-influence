import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { ObservableArray, Page } from '@nativescript/core';
import { registerElement } from '@nativescript/angular';

import { CampaignsService } from '@services/campaigns.service';
import { ICampaignInvitation, ICampaignDetail } from '@typings/campaign';
import { CampaignModel } from '@models/campaign.model';
import { orderCampaignList } from '../dashboard-methods';
import { DashboardCampaignComponent } from '@src/app/dashboard/dashboard-campaign/dashboard-campaign.component.tns';

registerElement('PullToRefresh', () => require('@nstudio/nativescript-pulltorefresh').PullToRefresh);

@Component({
    selector: 'app-dashboard-discovery',
    templateUrl: './dashboard-discovery.component.tns.html',
    styleUrls: ['./dashboard-discovery.component.tns.scss'],
})
export class DashboardDiscoveryComponent implements OnInit {
    firstLoading = true;
    campaignList: CampaignModel[];
    selectedTab: 'discover' | 'myCampaigns' = 'myCampaigns';

    get isDiscover() {
        return this.selectedTab === 'discover';
    }

    get isMyCampaigns() {
        return this.selectedTab === 'myCampaigns';
    }

    @ViewChild('myCampaignComponent') myCampaignComponent: DashboardCampaignComponent;

    constructor(private cdr: ChangeDetectorRef, private page: Page, public campaignsService: CampaignsService) {
        this.page.actionBarHidden = true;
        this.page.backgroundColor = 'transparent';
    }

    ngOnInit(): void {
        this.getData().finally(() => (this.firstLoading = false));
        this.cdr.detectChanges();
    }

    getData() {
        return this.campaignsService
            .getDiscoveryCampaign()
            .then((discoveryCampaigns) => (this.campaignList = this.handleCampaignData(discoveryCampaigns)))
            .catch((err) => console.log(err));
    }

    refreshList(args) {
        const pullRefresh = args.object;
        Promise.all([this.getData(), this.myCampaignComponent.getData()])
            .then(() => (pullRefresh.refreshing = false))
            .catch(() => (pullRefresh.refreshing = false));
    }

    selectTab(tab: 'discover' | 'myCampaigns') {
        this.selectedTab = tab;
    }

    private handleCampaignData(originCampaigns: ICampaignDetail[]) {
        const invitationObj: { [key: string]: ICampaignInvitation } = {};
        originCampaigns.forEach((item) => (invitationObj[item.brand_campaign_id] = item.invitation));
        const campaigns: CampaignModel[] = originCampaigns.map((campaignObj) => new CampaignModel(campaignObj, invitationObj, true));
        const campaignList = orderCampaignList(campaigns, 'discovery', invitationObj);
        return campaignList;
    }
}
