import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { confirm, ConfirmOptions, Page } from '@nativescript/core';
import { openUrl } from '@nativescript/core/utils';
import { RouterExtensions } from '@nativescript/angular';
import { setText } from 'nativescript-clipboard';

import { CampaignService } from '@services/campaign.service';
import { CampaignModel, CampaignSteps } from '@src/app/models/campaign.model';
import { StepsPresets, StepStatuses } from '@src/app/models/stepper';
import { CampaignsService } from '@src/app/services/campaigns.service';
import { ProfileService } from '@src/app/services/profile.service';
import { ToastService } from '@services/toast.service';
import { ShippingInfo } from '@typings/campaign.typings';
import * as dayjs from 'dayjs';
import { SocialMediaPlatform } from '@models/campaign.model';
import { DialogsService } from '@services/dialogs.service';

@Component({
    selector: 'app-campaign-timeline',
    templateUrl: './campaign-timeline.component.tns.html',
    styleUrls: ['./campaign-timeline.component.tns.scss'],
})
export class CampaignTimelineComponent implements OnInit {
    StepStatuses = StepStatuses;
    campaignId: string;
    campaign: CampaignModel = new CampaignModel();
    stepsPresets: StepsPresets;
    postLink: string;
    shippingInfo: ShippingInfo;
    productOrderNumber: string;
    isPostLinkValid = false;
    openUrl = openUrl;
    loading: boolean = true;

    get accountId() {
        switch (this.campaign?.platform) {
            case SocialMediaPlatform.instagram:
                return this.profileService.currentProfile?.instagram_id;
            case SocialMediaPlatform.tiktok:
                return this.profileService.currentProfile?.tiktok_id;
            default:
                return null;
        }
    }

    constructor(
        private page: Page,
        private toastService: ToastService,
        private dialogService: DialogsService,
        public activatedRoute: ActivatedRoute,
        public campaignService: CampaignService,
        public campaignsService: CampaignsService,
        public profileService: ProfileService,
        public router: RouterExtensions
    ) {
        this.campaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
        this.page.actionBarHidden = false;
        this.campaignService
            .getInfluencerCampaignById(this.campaignId)
            .then((campaign) => {
                if (campaign) {
                    this.loading = false;
                    this.campaign = new CampaignModel(campaign);
                    this.stepsPresets = new StepsPresets(this.campaign);
                    this.getShippingInfo();
                }
            })
            .catch(() => this.toastService.show({ text: 'Get data failed, pleas try again' }));
    }

    ngOnInit(): void {}

    formatTime(time: number | string) {
        return dayjs(time).format('MMM D[th] HH:MM');
    }

    viewDetail() {
        this.router.navigate([`/campaign-detail/detail/${this.campaignId}/myCampaign`]);
    }

    uploadFile() {
        const id = this.campaign.inf_campaign_dict[this.accountId];
        this.router.navigate([`campaign-detail/file-upload/${this.campaignId}/${id}`]);
    }

    viewDraft() {
        const id = this.campaign.inf_campaign_dict[this.accountId];
        this.router.navigate([`campaign-detail/campaign-review/${this.campaignId}/${id}`]);
    }

    addContentLink() {
        this.campaignsService
            .addContentPost(this.campaignId, this.accountId, this.postLink)
            .then(() => {
                this.campaign.influencer_info.submit_post_time = Math.floor(new Date().getTime() / 1000);
                this.campaign.influencer_info.post_url = this.postLink;
                this.stepsPresets = new StepsPresets(this.campaign);
            })
            .catch(() => this.toastService.show({ text: 'Failed, please try again later' }));
    }

    markAsDelivered() {
        const options: ConfirmOptions = {
            message: 'Please double check if you have received the product.',
            okButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        };
        confirm(options).then((confirm: boolean) => {
            if (!confirm) return;

            this.campaignsService
                .setAsDelivered(this.campaignId, this.accountId)
                .then(() => {
                    if (!this.campaign.influencer_info.product_ship_time) {
                        this.campaign.influencer_info.product_ship_time = new Date().getTime() / 1000;
                    }
                    this.campaign.influencer_info.product_received_time = new Date().getTime() / 1000;
                    this.stepsPresets = new StepsPresets(this.campaign);
                })
                .catch(() => this.toastService.show({ text: 'Failed, please try again later' }));
        });
    }

    addProductOrderNumber() {
        this.campaignsService
            .addProductOrderNumber(this.campaignId, this.accountId, this.productOrderNumber)
            .then(() => {
                this.campaign.influencer_info.product_received_time = Math.floor(new Date().getTime() / 1000);
                this.stepsPresets = new StepsPresets(this.campaign);
            })
            .catch(() => this.toastService.show({ text: 'Failed, please try again later' }));
    }

    getShippingInfo() {
        const { influencer_info } = this.campaign;

        if ([CampaignSteps.shipping, CampaignSteps.draft_pending].includes(this.campaign.campaignStatus)) {
            const shipping_info = influencer_info.shipping_info;
            if (shipping_info?.carrier && shipping_info?.tracking_number) {
                this.campaignsService
                    .getShippingInfo(shipping_info.carrier, shipping_info.tracking_number)
                    .then((shippingInfo: ShippingInfo) => (this.shippingInfo = shippingInfo))
                    .catch(() => {
                        this.shippingInfo = {
                            est_delivery_date: null,
                            tracking_details: [],
                            tracking_code: shipping_info.tracking_number,
                            carrier: shipping_info.carrier,
                        };
                    });
            }
        }
    }

    validPostLink() {
        this.isPostLinkValid = this.postLink.trim().length !== 0;
    }

    copyShippingCode() {
        setText(this.shippingInfo?.tracking_code)
            .then(() => this.toastService.show({ text: 'Copy successed!' }))
            .catch(() => this.toastService.show({ text: 'Copy Failed!' }));
    }
}
