import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptFormsModule } from '@nativescript/angular';
import { SharedModule } from '@shared/shared.module';
import { CampaignTimelineComponent } from '@src/app/campaign-detail/campaign-timeline/campaign-timeline.component';
import { CampaignInfluencerComponent } from '@src/app/campaign-detail/campaign-influencer/campaign-influencer.component';
import { FileUploadComponent } from '@src/app/campaign-detail/file-upload/file-upload.component';
import { CampaignReviewComponent } from '@src/app/campaign-detail/campaign-review/campaign-review.component';
// import { CopyMessageComponent } from '@src/app/campaign-detail/campaign-timeline/copy-message/copy-message.component';
import { PagerModule } from '@nativescript-community/ui-pager/angular';
import { FromCachePipe } from '@src/app/campaign-detail/campaign-review/from-cache.pipe';

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptHttpClientModule, SharedModule, NativeScriptFormsModule, PagerModule],
    declarations: [CampaignInfluencerComponent, CampaignTimelineComponent, FileUploadComponent, CampaignReviewComponent, FromCachePipe],
    providers: [],
    exports: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class CampaignDetailModule {}
