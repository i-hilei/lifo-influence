import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

// Component
import {CampaignTimelineComponent} from '@src/app/campaign-detail/campaign-timeline/campaign-timeline.component';
import {FileUploadComponent} from '@src/app/campaign-detail/file-upload/file-upload.component';
import {CampaignReviewComponent} from '@src/app/campaign-detail/campaign-review/campaign-review.component';
import { CampaignInvitationComponent } from '@src/app/public-page/campaign-invitation/campaign-invitation.component';

// Service
import {CampaignInfluencerComponent} from './campaign-influencer/campaign-influencer.component';
import {InstagramGuardService} from '@services/instagram-guard.service';

// Other
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [
    {
        path: '',
        canActivate: [AngularFireAuthGuard, InstagramGuardService],
        data: {authGuardPipe: redirectUnauthorizedToLogin},
        children: [
            {
                path: 'campaign/:campaignId',
                component: CampaignTimelineComponent,
            },
            {
                path: 'file-upload/:brandCampaignId/:campaignId',
                component: FileUploadComponent,
            },
            {
                path: 'campaign-review/:brandCampaignId/:campaignId',
                component: CampaignReviewComponent,
            },
            {
                path: 'campaign-detail/:campaignId',
                component: CampaignInfluencerComponent,
            },
            {
                path: 'campaign/:campaignId/:discovery',
                component: CampaignInvitationComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CampaignDetailRoutingModule {
}
