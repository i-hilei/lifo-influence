import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

// Component
import { SignUpSucceedComponent } from './auth/sign-up-succeed/sign-up-succeed.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { SignUpFinalComponent } from './auth/sign-up-final/sign-up-final.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { SignUpIndustryComponent } from './auth/sign-up-industry/sign-up-industry.component';
import { MyEarningsComponent } from './my-earnings/my-earnings.component';
import { CampaignInvitationComponent } from './public-page/campaign-invitation/campaign-invitation.component';

// Service
import { PublicSwitchPageGuard } from './public-switch-page.guard';
import { ConnectPaypalComponent } from '@src/app/account-info/connect-paypal/connect-paypal.component';
import { ConnectInstagramComponent } from '@src/app/connect-instagram/connect-instagram.component';
import { InstagramGuardService } from '@services/instagram-guard.service';
import { SignUpPlatformComponent } from '@auth/sign-up-platform/sign-up-platform.component';
import { ProductListComponent } from './shop/product-list/product-list.component';
import { ProductDetailComponent } from './shop/product-detail/product-detail.component';
import { GetStartedComponent } from './auth/get-started/get-started.component';
import { ShopingCartComponent } from './shop/shoping-cart/shoping-cart.component';

// Other
export const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: '',
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        children: [
            {
                path: 'complete-sign-up',
                canActivate: [InstagramGuardService],
                component: SignUpFinalComponent,
            },
            {
                path: 'sign-up-industry',
                canActivate: [InstagramGuardService],
                component: SignUpIndustryComponent,
            },
            {
                path: 'sign-up-platform',
                canActivate: [InstagramGuardService],
                component: SignUpPlatformComponent,
            },
            {
                path: 'sign-up-succeed',
                canActivate: [InstagramGuardService],
                component: SignUpSucceedComponent,
            },
            {
                path: 'dashboard',
                canActivate: [InstagramGuardService],
                component: DashboardComponent,
            },
            {
                path: 'help-center',
                canActivate: [InstagramGuardService],
                component: HelpCenterComponent,
            },
            {
                path: 'account-info',
                canActivate: [InstagramGuardService],
                component: AccountInfoComponent,
            },
            {
                path: 'connect-instagram',
                component: ConnectInstagramComponent,
            },
            {
                path: 'connect-paypal',
                canActivate: [InstagramGuardService],
                component: ConnectPaypalComponent,
            },
            {
                path: 'my-earnings',
                canActivate: [InstagramGuardService],
                component: MyEarningsComponent,
            },
        ],
    },
    {
        path: '',
        loadChildren: () => import('./campaign-detail/campaign-detail.module').then((m) => m.CampaignDetailModule),
    },
    {
        path: '',
        loadChildren: () => import('./lottery/lottery.module').then((m) => m.LotteryModule),
    },
    {
        path: '',
        loadChildren: () => import('./referral/referral.module').then((m) => m.ReferralModule),
    },
    {
        path: '',
        loadChildren: () => import('./shop/shop.module').then((m) => m.ShopModule),
    },
    {
        path: '',
        canActivate: [],
        children: [
            {
                path: 'public-invitation/:campaignId/:accountId',
                canActivate: [PublicSwitchPageGuard],
                component: CampaignInvitationComponent,
            },
            {
                path: 'public-other',
                canActivate: [PublicSwitchPageGuard],
                children: [],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/get-started',
    },
];

const shopRoutes: Routes = [
    {
        path: 'get-started',
        component: GetStartedComponent,
    },
    {
        path: '',
        children: [
            {
                path: ':shopId',
                component: ProductListComponent,
            },
            {
                path: 'product-detail/:shopId/:productId',
                component: ProductDetailComponent,
            },
            {
                path: 'shoping-cart/:shopId',
                component: ShopingCartComponent,
            },
            {
                path: 'product-detail/:shopId/:productId/:sharedCode',
                component: ProductDetailComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/get-started',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
