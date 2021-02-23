import { ShippingInfo } from '@typings/campaign.typings';
import { IRequestOptions } from '@src/app/typings/system.typings';
import { HeaderConfig } from '@src/app/shared/components/page-header/page-header.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '@services/campaign.service';
import { CampaignModel, CampaignSteps } from '@src/app/models/campaign.model';
import { StepsPresets, StepStatuses } from '@src/app/models/stepper';
import { CampaignsService } from '@src/app/services/campaigns.service';
import { ProfileService } from '@src/app/services/profile.service';
import { RequestService } from '@services/request.service';
import { ToastService, ModalService } from 'ng-zorro-antd-mobile';
import { copy } from '@src/app/shared/methods/copy';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-campaign-timeline',
    templateUrl: './campaign-timeline.component.html',
    styleUrls: ['./campaign-timeline.component.scss'],
})
export class CampaignTimelineComponent implements OnInit {
    StepStatuses = StepStatuses;
    campaignId: string;
    accountId: string;
    campaign: CampaignModel = new CampaignModel();
    stepsPresets: StepsPresets;
    postLink: string;
    shippingInfo: ShippingInfo;
    productOrderNumber: string;

    pageHeaderConfig: HeaderConfig;

    loading: boolean = true;

    @ViewChild('FailToast') failToast;
    @ViewChild('SuccessToast') successToast;

    constructor(
        public activatedRoute: ActivatedRoute,
        public campaignService: CampaignService,
        public campaignsService: CampaignsService,
        public profileService: ProfileService,
        public requestService: RequestService,
        public toastService: ToastService,
        public router: Router,
        public ActivatedRoute: ActivatedRoute,
        public modalService: ModalService
    ) {
        this.campaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
        this.campaignService.getInfluencerCampaignById(this.campaignId).then(
            (campaign) => {
                this.loading = false;
                this.campaign = new CampaignModel(campaign);
                if (this.campaign.platform === 'tiktok') {
                    this.accountId = this.profileService.currentProfile.tiktok_id;
                } else {
                    this.accountId = this.profileService.currentProfile.instagram_id;
                }
                this.stepsPresets = new StepsPresets(this.campaign);
                this.getShippingInfo();
            },
            (err) => (this.loading = false)
        );
        this.pageHeaderConfig = {
            title: 'Campaign',
            backUrl: '/dashboard',
            queryParams: this.activatedRoute.snapshot.queryParams,
        };
    }

    ngOnInit(): void {}

    formatTime(time: number | string) {
        return dayjs(time).format('MMM D[th] HH:MM');
    }

    uploadFile() {
        this.router.navigate([`/file-upload/${this.campaignId}/${this.campaign.inf_campaign_dict[this.accountId]}`]);
    }

    viewDraft() {
        this.router.navigate([`/campaign-review/${this.campaignId}/${this.campaign.inf_campaign_dict[this.accountId]}`]);
    }

    addContentLink() {
        this.campaignsService
            .addContentPost(this.campaignId, this.accountId, this.postLink)
            .then((result) => {
                this.campaign.influencer_info.submit_post_time = Math.floor(new Date().getTime() / 1000);
                this.campaign.influencer_info.post_url = this.postLink;
                this.stepsPresets = new StepsPresets(this.campaign);
            })
            .catch(() => {
                this.toastService.fail('Failed, please try again later');
            });
    }

    markAsDelivered() {
        this.modalService.alert(null, 'Please double check if you have received the product.', [
            { text: 'Cancel', onPress: () => {} },
            {
                text: 'Confirm',
                onPress: () => {
                    this.campaignsService
                        .setAsDelivered(this.campaignId, this.accountId)
                        .then((result) => {
                            if (!this.campaign.influencer_info.product_ship_time) {
                                this.campaign.influencer_info.product_ship_time = new Date().getTime() / 1000;
                            }
                            this.campaign.influencer_info.product_received_time = new Date().getTime() / 1000;
                            this.stepsPresets = new StepsPresets(this.campaign);
                        })
                        .catch(() => {
                            this.toastService.fail('Failed, please try again later');
                        });
                },
            },
        ]);
    }

    addProductOrderNumber() {
        this.campaignsService
            .addProductOrderNumber(this.campaignId, this.accountId, this.productOrderNumber)
            .then(() => {
                this.campaign.influencer_info.product_received_time = Math.floor(new Date().getTime() / 1000);
                this.stepsPresets = new StepsPresets(this.campaign);
            })
            .catch(() => {
                this.toastService.fail('Failed, please try again later');
            });
    }

    getShippingInfo() {
        const { influencer_info } = this.campaign;

        if ([CampaignSteps.shipping, CampaignSteps.draft_pending].includes(this.campaign.campaignStatus)) {
            const shipping_info = influencer_info.shipping_info;
            if (shipping_info?.carrier && shipping_info?.tracking_number) {
                const requestOption: IRequestOptions = {
                    method: 'GET',
                    url: `/share/track_shipping/${shipping_info.carrier}/${shipping_info.tracking_number}`,
                };
                this.requestService
                    .sendRequest(requestOption)
                    .then((shippingInfo: ShippingInfo) => {
                        this.shippingInfo = shippingInfo;
                    })
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

    verifyInstagramPostLink() {}

    copyShippingCode(code: string) {
        if (copy(code)) {
            this.toastService.info(this.successToast, 1500, null, false, 'middle');
        } else {
            this.toastService.info(this.failToast, 1500, null, false, 'middle');
        }
    }

    trim(msg: string) {
        if (msg) {
            return msg.trim();
        }
        return '';
    }
}
