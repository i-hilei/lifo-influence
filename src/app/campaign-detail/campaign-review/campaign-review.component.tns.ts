import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservableArray } from '@nativescript/core';

// Service
import { CampaignDetailService } from '@src/app/campaign-detail/campaign-detail.service';

// Type
import { ICampaignDetail } from '@src/app/typings/campaign';

@Component({
    selector: 'app-campaign-review',
    templateUrl: './campaign-review.component.tns.html',
    styleUrls: ['./campaign-review.component.tns.scss'],
})
export class CampaignReviewComponent {
    campaignDetail: ICampaignDetail;
    influencerCampaignId: string;
    brandCampaignId: string;

    uploadedImgs = [];
    uploadedVideos = [];
    mediaFiles = [];
    caption: string;
    items = new ObservableArray();

    selectedPage: number = 0;

    @ViewChild('carousel') carousel;

    constructor(private campaignDetailService: CampaignDetailService, public activatedRoute: ActivatedRoute, public router: Router) {
        this.brandCampaignId = this.activatedRoute.snapshot.paramMap.get('brandCampaignId');
        // Noted that this is inf campaign id.
        this.influencerCampaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
    }

    async ngOnInit() {
        await this.getCampaignDetail();
        this.setDefaultValue();
    }

    editContent() {
        this.router.navigate([`campaign-detail/file-upload/${this.brandCampaignId}/${this.influencerCampaignId}`]);
    }

    async getCampaignDetail() {
        const historyList = await (await this.campaignDetailService.getCampaignById(this.influencerCampaignId)).toPromise();
        this.campaignDetail = historyList?.history_list[0];
    }

    setDefaultValue() {
        if (this.campaignDetail?.content) {
            this.uploadedImgs = this.campaignDetail?.content?.images.map((img) => {
                return { file: img.url, type: 'image', path: img.path };
            });
            this.uploadedVideos = this.campaignDetail?.content?.videos.map((video) => {
                return { file: video.url, type: 'video', path: video.path };
            });
            this.mediaFiles = this.uploadedImgs.concat(this.uploadedVideos);
            this.items = new ObservableArray(this.mediaFiles);
        }
        this.caption = this.campaignDetail?.description;
    }

    changePage(index: number) {
        this.selectedPage = index;
        console.log(this.selectedPage);
    }
}
