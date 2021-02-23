import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaingListItemComponent } from '@src/app/shared/components/campaing-list-item/campaing-list-item.component';
import { OfferDetailDisplayComponent } from '@src/app/shared/components/offer-detail-display/offer-detail-display.component';
import { SafeHtmlPipe } from '@src/app/pipe/safe-html.pipe';
import { PageHeaderComponent } from '@src/app/shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MessagesModule } from '@shared/messages/messages.module';
import { BadgeModule, ButtonModule, NgZorroAntdMobileModule, TabsModule } from 'ng-zorro-antd-mobile';
import {
    NzCheckboxModule,
    NzCollapseModule,
    NzDividerModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzSelectModule,
    NzModalModule,
} from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TermsOfUseComponent } from '@shared/components/terms-of-use/terms-of-use.component';
import { ShortNumberPipe } from '@shared/pipes/short-number/short-number.pipe';
import { LoadingComponent } from '@src/app/shared/components/loading/loading.component';
import { CampaignListItemNewComponent } from '@src/app/shared/components/campaign-list-item-new/campaign-list-item-new.component';
import { MainPageHeaderComponent } from '@src/app/shared/components/main-page-header/main-page-header.component';
import { ShopNotificationComponent } from '@src/app/shared/components/shop-notification/shop-notification.component';
import { FilePickerComponent } from '@shared/components/file-picker/file-picker.component';
import { ImgVideoPreview } from '@shared/components/file-picker/file-preview.directive';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ShippingAddressFormComponent } from '@src/app/shared/components/shipping-address-form/shipping-address-form.component';
import { AppDownloadSectionComponent } from '@src/app/shared/components/app-download-section/app-download-section.component';

@NgModule({
    declarations: [
        CampaingListItemComponent,
        OfferDetailDisplayComponent,
        SafeHtmlPipe,
        PageHeaderComponent,
        TermsOfUseComponent,
        ShortNumberPipe,
        LoadingComponent,
        CampaignListItemNewComponent,
        MainPageHeaderComponent,
        ShopNotificationComponent,
        FilePickerComponent,
        ImgVideoPreview,
        ShippingAddressFormComponent,
        AppDownloadSectionComponent,
    ],
    imports: [
        CommonModule,
        NzButtonModule,
        MessagesModule,
        ButtonModule,
        NzFormModule,
        NzInputModule,
        NzCollapseModule,
        ReactiveFormsModule,
        NzCheckboxModule,
        NzSelectModule,
        NzButtonModule,
        TabsModule,
        NzDividerModule,
        NgZorroAntdMobileModule,
        BadgeModule,
        NzMessageModule,
        NzIconModule,
        NzModalModule,
        NzProgressModule,
        FormsModule,
    ],
    exports: [
        CampaingListItemComponent,
        OfferDetailDisplayComponent,
        PageHeaderComponent,
        TermsOfUseComponent,
        MessagesModule,
        ButtonModule,
        NzFormModule,
        NzInputModule,
        NzCollapseModule,
        ReactiveFormsModule,
        NzCheckboxModule,
        NzSelectModule,
        NzButtonModule,
        TabsModule,
        NzDividerModule,
        NgZorroAntdMobileModule,
        BadgeModule,
        NzMessageModule,
        ShortNumberPipe,
        LoadingComponent,
        CampaignListItemNewComponent,
        MainPageHeaderComponent,
        NzModalModule,
        FilePickerComponent,
        ShippingAddressFormComponent,
        AppDownloadSectionComponent,
    ],
})
export class SharedModule {}
