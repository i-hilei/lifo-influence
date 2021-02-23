import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule, NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { AuthModule } from '@src/app/auth/auth.module';
import { MyEarningsModule } from '@src/app/my-earnings/my-earnings.module';
import { SharedModule } from '@src/app/shared/shared.module';
import { CampaignDetailModule } from '@src/app/campaign-detail/campaign-detail.module';
import { ShopModule } from '@src/app/shop/shop.module';
import { ReferralModule } from '@src/app/referral/referral.module';

import { AppComponent } from '@src/app/app.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { DashboardWalletComponent } from '@src/app/dashboard/dashboard-wallet/dashboard-wallet.component';
import { MainPageComponent } from '@src/app/main-page/main-page.component';
import { AccountInfoComponent } from '@src/app/account-info/account-info.component';
import { DashboardDiscoveryComponent } from '@src/app/dashboard/dashboard-discovery/dashboard-discovery.component';
import { DashboardCampaignComponent } from '@src/app/dashboard/dashboard-campaign/dashboard-campaign.component';
import { DrawPopupComponent } from '@src/app/lottery/lottery-information/draw-popup/draw-popup.component';
import { StoreReportComponent } from '@src/app/shop/store-report/store-report.component';
import { ShopItemComponent } from '@src/app/shop/shop-item/shop-item.component';
import { AppSettingComponent } from '@src/app/app-setting/app-setting.component';
import { HelpCenterComponent } from '@src/app/help-center/help-center.component';
import { NotificationInboxComponent } from '@src/app/notification-inbox/notification-inbox.component.tns';

// Uncomment and add to NgModule imports if you need to use two-way binding and/or HTTP wrapper
// import { NativeScriptFormsModule, NativeScriptHttpClientModule } from '@nativescript/angular';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        DashboardWalletComponent,
        MainPageComponent,
        AccountInfoComponent,
        DashboardDiscoveryComponent,
        DashboardCampaignComponent,
        DrawPopupComponent,
        StoreReportComponent,
        ShopItemComponent,
        AppSettingComponent,
        HelpCenterComponent,
        NotificationInboxComponent,
    ],
    imports: [
        NativeScriptModule,
        NativeScriptCommonModule,
        AppRoutingModule,
        AuthModule,
        NativeScriptHttpClientModule,
        MyEarningsModule,
        NativeScriptUIListViewModule,
        SharedModule,
        CampaignDetailModule,
        ShopModule,
        ReferralModule,
    ],
    exports: [],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
