import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from '@nativescript/angular';

import { CampaignModel, OFFER_STATUS_ICONS } from '@models/campaign.model';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-campaing-list-item',
    templateUrl: './campaing-list-item.component.tns.html',
    styleUrls: ['./campaing-list-item.component.tns.scss'],
})
export class CampaingListItemComponent implements OnInit {
    OFFER_STATUS_ICONS = OFFER_STATUS_ICONS;

    @Input() showStatuses: boolean = false;
    @Input() showInvitation: boolean = false;
    @Input() showCampaignDetailsButton: boolean = false;
    @Input() campaign: CampaignModel;
    @Input() redirectPath: string;

    constructor(private router: RouterExtensions, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {}

    redirectToTimeline() {
        if (this.redirectPath) {
            this.router.navigate([this.redirectPath]);
            return;
        }

        if (this.showInvitation) {
            this.router.navigate([`/campaign-detail/${this.campaign.brand_campaign_id}`], {
                queryParams: this.activatedRoute.snapshot.queryParams,
            });
        } else {
            this.router.navigate([`/campaign/${this.campaign.brand_campaign_id}`], {
                queryParams: this.activatedRoute.snapshot.queryParams,
            });
        }
    }

    redirectToDetails() {
        this.router.navigate([`/campaign-detail/${this.campaign.brand_campaign_id}`], {
            queryParams: this.activatedRoute.snapshot.queryParams,
        });
    }

    get getImage() {
        return this.campaign.product_image || this.campaign.offer_detail?.product_image_list[0];
    }

    get productPrice() {
        return this.campaign.product_price || 0;
    }

    get commissionAmount() {
        return this.campaign.influencer_info.accept_commission || 0;
    }

    get bonusAmount() {
        return this.campaign.influencer_info.accept_bonus || 0;
    }

    get isBonusGetted() {
        return (
            this.campaign.influencer_info.isContentSubmitted &&
            dayjs(this.campaign.influencer_info.content_submit_time * 1000).isBefore(
                dayjs(this.campaign.influencer_info.product_received_time * 1000).add(
                    Number(this.campaign.configuration.fast_deliver_window),
                    'hour'
                )
            )
        );
    }
}
