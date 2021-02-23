import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireAnalyticsModule, APP_NAME, APP_VERSION, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { AngularFireModule } from '@angular/fire';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Module
import { AppRoutingModule } from '@src/app/app-routing.module';
import { CampaignDetailModule } from '@src/app/campaign-detail/campaign-detail.module';
import { PublicPageModule } from '@src/app/public-page/public-page.module';

// Component
import { AppComponent } from '@src/app/app.component';
import { AccountInfoComponent } from '@src/app/account-info/account-info.component';
import { GetStartedComponent } from '@src/app/auth/get-started/get-started.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { HelpCenterComponent } from '@src/app/help-center/help-center.component';

// Service
// Lib
import { IntercomModule } from 'ng-intercom';

// Other
import {
    ArrowLeftOutline,
    CheckCircleFill,
    ClockCircleOutline,
    CloseCircleFill,
    CloseOutline,
    CopyFill,
    CopyOutline,
    CreditCardOutline,
    DownOutline,
    EnvironmentFill,
    LoadingOutline,
    PlayCircleOutline,
    PlusOutline,
} from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';


// Other
import { environment } from '@src/environments/environment';
import { SharedModule } from '@src/app/shared/shared.module';
import { MyEarningsModule } from '@src/app/my-earnings/my-earnings.module';
import { NgxMaskModule } from 'ngx-mask';
import { DashboardWalletComponent } from '@src/app/dashboard/dashboard-wallet/dashboard-wallet.component';
import { AuthModule } from '@auth/auth.module';
import { NzIconModule } from 'ng-zorro-antd';
import { ReferralModule } from '@src/app/referral/referral.module';
import { ConnectPaypalComponent } from '@src/app/account-info/connect-paypal/connect-paypal.component';
import { ConnectInstagramComponent } from '@src/app/connect-instagram/connect-instagram.component';
import { LotteryModule } from '@src/app/lottery/lottery.module';
import { DashboardDiscoveryComponent } from '@src/app/dashboard/dashboard-discovery/dashboard-discovery.component';
import { DashboardCampaignComponent } from '@src/app/dashboard/dashboard-campaign/dashboard-campaign.component';
import { ShopModule } from '@src/app/shop/shop.module';
import { UiSwitchModule } from 'ngx-ui-switch';

const icons: IconDefinition[] = [
    ArrowLeftOutline,
    DownOutline,
    PlusOutline,
    CloseOutline,
    PlayCircleOutline,
    ClockCircleOutline,
    CreditCardOutline,
    CheckCircleFill,
    EnvironmentFill,
    CopyOutline,
    CopyFill,
    CloseCircleFill,
    LoadingOutline,
];

@NgModule({
    declarations: [
        AppComponent,
        GetStartedComponent,
        DashboardComponent,
        HelpCenterComponent,
        AccountInfoComponent,
        DashboardWalletComponent,
        ConnectPaypalComponent,
        ConnectInstagramComponent,
        DashboardDiscoveryComponent,
        DashboardCampaignComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CampaignDetailModule,
        ShopModule,
        MyEarningsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAnalyticsModule,
        IntercomModule.forRoot({
            appId: 'etq9z8nj',
            updateOnRouterChange: true,
        }),
        AuthModule,
        NzIconModule.forRoot(icons),
        NgxMaskModule.forRoot(),
        SharedModule,
        PublicPageModule,
        ReferralModule,
        LotteryModule,
        UiSwitchModule,
    ],
    providers: [
        {
            provide: APP_NAME,
            useValue: 'Lifo Influencer',
        },
        {
            provide: APP_VERSION,
            useValue: 'r1.0',
        },
        ScreenTrackingService,
        UserTrackingService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
