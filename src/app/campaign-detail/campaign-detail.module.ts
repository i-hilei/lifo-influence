import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { CampaignReviewComponent } from '@src/app/campaign-detail/campaign-review/campaign-review.component';
import { CampaignTimelineComponent } from './campaign-timeline/campaign-timeline.component';
import { CampaignDetailRoutingModule } from '@src/app/campaign-detail/campaign-detail-routing.module';
import { NzIconModule, NzInputModule, NzRadioModule } from 'ng-zorro-antd';
import { SharedModule } from '@src/app/shared/shared.module';
import { StepsModule, ButtonModule, TextareaItemModule, CarouselModule } from 'ng-zorro-antd-mobile';
import { CampaignInfluencerComponent } from './campaign-influencer/campaign-influencer.component';
import { CopyMessageComponent } from './campaign-timeline/copy-message/copy-message.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
    declarations: [
        CampaignTimelineComponent,
        CampaignInfluencerComponent,
        CopyMessageComponent,
        FileUploadComponent,
        CampaignReviewComponent,
    ],
    imports: [
        CampaignDetailRoutingModule,
        CommonModule,
        NzButtonModule,
        ButtonModule,
        TextareaItemModule,
        NzProgressModule,
        NzIconModule,
        SharedModule,
        StepsModule,
        FormsModule,
        NzInputModule,
        NzRadioModule,
        NzCarouselModule,
        CarouselModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [],
    exports: [],
})
export class CampaignDetailModule {}
