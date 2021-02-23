import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

// Service
import {CampaignDetailService} from '@src/app/campaign-detail/campaign-detail.service';

// Type
import {ICampaignDetail} from '@src/app/typings/campaign';
import {FromToInterface} from 'ng-zorro-antd';
import {NzCarouselComponent} from 'ng-zorro-antd/carousel/carousel.component';
import {HeaderConfig} from '@src/app/shared/components/page-header/page-header.component';

// Util
import {drawImageByVideo} from '../utils/draw';

export interface PreviewFile {
    url: string;
    videoUrl?: string;
    type: 'image' | 'video';
}

@Component({
    selector: 'app-campaign-review',
    templateUrl: './campaign-review.component.html',
    styleUrls: ['./campaign-review.component.scss'],
})
export class CampaignReviewComponent implements OnInit {
    campaignDetail: ICampaignDetail;
    influencerCampaignId: string;
    brandCampaignId: string;

    selectedIndex = 0;

    files: PreviewFile[] = [];

    selectImgDisabled = false;

    pageHeaderConfig: HeaderConfig;

    @ViewChild('carousel') carousel: NzCarouselComponent;

    constructor(private campaignDetailService: CampaignDetailService, public activatedRoute: ActivatedRoute, public router: Router) {
        this.brandCampaignId = this.activatedRoute.snapshot.paramMap.get('brandCampaignId');
        // Noted that this is inf campaign id.
        this.influencerCampaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');

        this.pageHeaderConfig = {
            title: 'Content Draft',
            backUrl: `/campaign/${this.brandCampaignId}`,
            replaceUrl: true,
            rightLinkText: 'Edit',
        };
    }

    async ngOnInit() {
        const historyList = await (await this.campaignDetailService.getCampaignById(this.influencerCampaignId)).toPromise();
        this.campaignDetail = historyList?.history_list[0];
        this.setFiles();
    }

    setFiles() {
        const images = this.campaignDetail?.content.images;
        const videos = this.campaignDetail?.content.videos;
        const files = [];

        images.forEach((img) => {
            const file: PreviewFile = {url: img.url, type: 'image'};
            files.push(file);
        });

        videos.forEach(async (video, index) => {
            const file: PreviewFile = {
                url: null,
                videoUrl: video.url,
                type: 'video',
            };
            files.push(file);
            const {url} = await drawImageByVideo(video);
            file.url = url;
        });

        this.files = files;
    }

    selectPreviewImg(index: number) {
        if (this.selectImgDisabled) {
            return;
        }
        this.selectedIndex = index;
        this.carousel.goTo(this.selectedIndex);
    }

    beforeChange(fromTo: FromToInterface) {
        this.selectImgDisabled = true;
        this.selectedIndex = fromTo.to;
    }

    afterChange() {
        this.selectImgDisabled = false;
    }

    backToTimeline() {
        this.router.navigate(['/dashboard']);
    }

    editContent() {
        this.router.navigate([`/file-upload/${this.brandCampaignId}/${this.influencerCampaignId}`]);
    }
}
