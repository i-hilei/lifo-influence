import { ICampaignInvitation } from '@typings/campaign';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@src/app/native-helper/router-helper/router';

import { ProfileService } from '@services/profile.service';
import { CampaignsService } from '@services/campaigns.service';
import { orderCampaignList } from './dashboard-methods';

import { CampaignModel, OFFER_STATUS_TYPES, DISCOVER_STATUS_TYPES } from '@models/campaign.model';
import { NzModalService } from 'ng-zorro-antd';
import { ShopNotificationComponent } from '@shared/components/shop-notification/shop-notification.component';

interface DashboardBigTab {
    title: string;
    type: BigTab;
    children?: DashboardSmallTab[];
}

interface DashboardSmallTab {
    title: string;
    type: OFFER_STATUS_TYPES | DISCOVER_STATUS_TYPES;
}

interface CampaignList {
    [BigTab.mycampaign]: {
        [key in OFFER_STATUS_TYPES]: CampaignModel[];
    };
    [BigTab.discover]: CampaignModel[];
}

enum BigTab {
    discover = 'discover',
    mycampaign = 'myCampaign',
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    OFFER_STATUS_TYPES = OFFER_STATUS_TYPES;
    DISCOVER_STATUS_TYPES = DISCOVER_STATUS_TYPES;
    BigTab = BigTab;

    campaignList: CampaignList = {
        // discover: {
        //     [DISCOVER_STATUS_TYPES.hot]: null,
        //     [DISCOVER_STATUS_TYPES.applied]: null,
        // },
        discover: null,
        myCampaign: {
            [OFFER_STATUS_TYPES.new]: null,
            [OFFER_STATUS_TYPES.active]: null,
            [OFFER_STATUS_TYPES.completed]: null,
        },
    };

    tabs: DashboardBigTab[] = [
        {
            type: BigTab.discover,
            title: 'Discover',
            // children: [
            //     {
            //         type: DISCOVER_STATUS_TYPES.hot,
            //         title: 'Hot',
            //     },
            //     {
            //         type: DISCOVER_STATUS_TYPES.applied,
            //         title: 'Applied',
            //     },
            // ],
        },
        {
            type: BigTab.mycampaign,
            title: 'My Campaigns',
            children: [
                {
                    type: OFFER_STATUS_TYPES.new,
                    title: 'Invited',
                },
                {
                    type: OFFER_STATUS_TYPES.active,
                    title: 'Active',
                },
                {
                    type: OFFER_STATUS_TYPES.completed,
                    title: 'Completed',
                },
            ],
        },
    ];

    currentTab = {
        big: this.tabs[1],
        small: this.tabs[1].children[0],
    };

    constructor(
        public profileService: ProfileService,
        public campaignsService: CampaignsService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private modalService: NzModalService
    ) {}

    changeHistory(tabType: { big: BigTab; small: DISCOVER_STATUS_TYPES | OFFER_STATUS_TYPES }) {
        const queryParams: any = { tab1: tabType.big };
        if (tabType.small) {
            queryParams.tab2 = tabType.small;
        }
        this.router.navigate(['/dashboard'], {
            replaceUrl: true,
            queryParams,
        });
    }

    ngOnInit(): void {
        Promise.all([this.campaignsService.getAllCampaignInvitation(), this.campaignsService.getCampaign()])
            .then(([invitations, iCampaigns]) => {
                // console.log(invitations, iCampaigns);
                const campaigns: CampaignModel[] = iCampaigns.map((campaignObj) => new CampaignModel(campaignObj, invitations));

                this.campaignList[BigTab.mycampaign][OFFER_STATUS_TYPES.new] = orderCampaignList(
                    campaigns,
                    'mycampaign',
                    invitations,
                    OFFER_STATUS_TYPES.new
                );
                this.campaignList[BigTab.mycampaign][OFFER_STATUS_TYPES.active] = orderCampaignList(
                    campaigns,
                    'mycampaign',
                    invitations,
                    OFFER_STATUS_TYPES.active
                );
                this.campaignList[BigTab.mycampaign][OFFER_STATUS_TYPES.completed] = orderCampaignList(
                    campaigns,
                    'mycampaign',
                    invitations,
                    OFFER_STATUS_TYPES.completed
                );
            })
            .catch((err) => {
                console.log(err);
            });

        this.campaignsService
            .getDiscoveryCampaign()
            .then((discoveryCampaigns) => {
                const invitationObj: { [key: string]: ICampaignInvitation } = {};
                discoveryCampaigns.forEach((item) => (invitationObj[item.brand_campaign_id] = item.invitation));
                const campaigns: CampaignModel[] = discoveryCampaigns.map(
                    (campaignObj) => new CampaignModel(campaignObj, invitationObj, true)
                );
                this.campaignList[BigTab.discover] = orderCampaignList(campaigns, 'discovery', invitationObj);
            })
            .catch((err) => {
                console.log(err);
            });

        this.handleTabParamFromUrl({
            tab1: this.activatedRoute.snapshot.queryParamMap.get('tab1'),
            tab2: this.activatedRoute.snapshot.queryParamMap.get('tab2'),
        });
    }

    handleTabParamFromUrl(params: { tab1: string; tab2: string }) {
        const tab1Obj = this.tabs.find((tab) => tab.type === params.tab1);
        if (tab1Obj) {
            this.currentTab.big = tab1Obj;
            const tab2Ojb = (tab1Obj.children || []).find((tab) => tab.type === params.tab2);
            if (tab2Ojb) {
                this.currentTab.small = tab2Ojb;
            }
        }
    }

    currentTabToggle(item: { type: 'big'; tab: DashboardBigTab } | { type: 'small'; tab: DashboardSmallTab }) {
        if (item.type === 'big') {
            if (item.tab.type === BigTab.discover) {
                this.currentTab.big = item.tab;
                this.currentTab.small = null;
            } else {
                this.currentTab.big = item.tab;
                this.currentTab.small = item.tab.children[0];
            }
        }
        if (item.type === 'small') {
            this.currentTab.small = item.tab;
        }

        this.changeHistory({
            big: this.currentTab.big.type,
            small: this.currentTab.small?.type,
        });
    }

    viewLifoShop() {
        this.router.navigate(['/internal-shop/select-product']);
    }
}
