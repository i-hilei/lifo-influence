import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { Routes } from '@angular/router';

// Components
import { SignInComponent } from '@src/app/auth/sign-in/sign-in.component';
import { SignUpComponent } from '@src/app/auth/sign-up/sign-up.component';
import { SignUpIndustryComponent } from '@src/app/auth/sign-up-industry/sign-up-industry.component';
import { MainPageComponent } from '@src/app/main-page/main-page.component';
import { MyEarningsComponent } from '@src/app/my-earnings/my-earnings.component';
import { AccountInfoComponent } from '@src/app/account-info/account-info.component';
import { ForgotPasswordComponent } from '@src/app/auth/forgot-password/forgot-password.component';
import { DashboardDiscoveryComponent } from '@src/app/dashboard/dashboard-discovery/dashboard-discovery.component';
import { CampaignInfluencerComponent } from '@src/app/campaign-detail/campaign-influencer/campaign-influencer.component';
import { CampaignTimelineComponent } from '@src/app/campaign-detail/campaign-timeline/campaign-timeline.component';
import { FileUploadComponent } from '@src/app/campaign-detail/file-upload/file-upload.component';
import { CampaignReviewComponent } from '@src/app/campaign-detail/campaign-review/campaign-review.component';
import { AppSettingComponent } from '@src/app/app-setting/app-setting.component';
import { TermsOfUseComponent } from '@shared/components/terms-of-use/terms-of-use.component.tns';
import { HelpCenterComponent } from '@src/app/help-center/help-center.component.tns';
import { SignUpPlatformComponent } from '@auth/sign-up-platform/sign-up-platform.component';
import { ShopComponent } from '@src/app/shop/shop.component';
import { NotificationInboxComponent } from '@src/app/notification-inbox/notification-inbox.component.tns';
import { ReferralsHistoryComponent } from '@src/app/referral/referrals-history/referrals-history.component';

// Serivces
import { AuthGuardGuard } from '@services/auth-guard.guard.tns';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/sign-in',
        pathMatch: 'full',
    },

    // Auth
    {
        path: 'auth',
        children: [
            {
                path: 'sign-in',
                canActivate: [AuthGuardGuard],
                component: SignInComponent,
            },
            {
                path: 'restore-password',
                component: ForgotPasswordComponent,
            },
            {
                path: 'sign-up',
                canActivate: [AuthGuardGuard],
                component: SignUpComponent,
            },
            {
                path: 'sign-up-industry',
                component: SignUpIndustryComponent,
            },
            {
                path: 'sign-up-platform',
                component: SignUpPlatformComponent,
            },
        ],
    },
    {
        path: 'dashboard',
        redirectTo: 'auth/sign-in',
        pathMatch: 'full',
    },

    // Main page
    {
        path: 'main-page',
        component: MainPageComponent,
        children: [
            {
                path: 'inbox',
                component: NotificationInboxComponent,
                outlet: 'inbox',
            },
            {
                path: 'discover',
                component: DashboardDiscoveryComponent,
                outlet: 'discover',
            },
            {
                path: 'my-earnings',
                component: MyEarningsComponent,
                outlet: 'myEarnings',
            },
            {
                path: 'account-info',
                component: AccountInfoComponent,
                outlet: 'accountInfo',
            },
            {
                path: 'shop',
                component: ShopComponent,
                outlet: 'shop',
            },
        ],
    },

    // Campaign Detail
    {
        path: 'campaign-detail',
        children: [
            {
                // type: discover | myCampaign
                path: 'detail/:campaignId/:type',
                component: CampaignInfluencerComponent,
            },
            {
                path: 'timeline/:campaignId',
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
        ],
    },

    // Referral
    {
        path: 'referral',
        children: [{ path: 'history', component: ReferralsHistoryComponent }],
    },
    {
        path: 'setting',
        component: AppSettingComponent,
    },
    {
        path: 'help-center',
        component: HelpCenterComponent,
    },
    {
        path: 'terms-of-use',
        component: TermsOfUseComponent,
    },

    {
        path: '**',
        redirectTo: '/auth/sign-in',
    },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
