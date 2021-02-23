import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptFormsModule } from '@nativescript/angular';

import { CampaingListItemComponent } from '@shared/components/campaing-list-item/campaing-list-item.component';
import { OfferDetailDisplayComponent } from '@shared/components/offer-detail-display/offer-detail-display.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TermsOfUseComponent } from '@shared/components/terms-of-use/terms-of-use.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { MainPageHeaderComponent } from '@shared/components/main-page-header/main-page-header.component';
import { InfoUpdateComponent } from '@shared/components/only-native-component/info-update/info-update.component.tns';
import { NativeNoDataComponent } from '@src/app/shared/components/only-native-component/native-no-data/native-no-data.component.tns';
import { NativePageHeaderComponent } from '@shared/components/only-native-component/native-page-header/native-page-header.component.tns';
import { MediaPreviewComponent } from '@src/app/shared/components/only-native-component/media-preview/media-preview.component.tns';
/* eslint-disable max-len */
import { AddressUpdateModalComponent } from '@shared/components/only-native-component/address-update-modal/address-update-modal.component.tns';
import { ConnectAccountModalComponent } from '@shared/components/only-native-component/connect-account-modal/connect-account-modal.component.tns';
/* eslint-enable max-len */

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptFormsModule],
    declarations: [
        CampaingListItemComponent,
        OfferDetailDisplayComponent,
        PageHeaderComponent,
        TermsOfUseComponent,
        LoadingComponent,
        MainPageHeaderComponent,
        InfoUpdateComponent,
        NativeNoDataComponent,
        NativePageHeaderComponent,
        MediaPreviewComponent,
        AddressUpdateModalComponent,
        ConnectAccountModalComponent,
    ],
    exports: [
        MainPageHeaderComponent,
        CampaingListItemComponent,
        OfferDetailDisplayComponent,
        NativeNoDataComponent,
        TermsOfUseComponent,
        MediaPreviewComponent,
        AddressUpdateModalComponent,
        LoadingComponent,
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
