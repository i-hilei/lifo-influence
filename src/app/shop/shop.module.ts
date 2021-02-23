import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from '@src/app/shop/shop-routing.module';
import { ProductDetailComponent } from '@src/app/shop/product-detail/product-detail.component';
import { ProductListComponent } from '@src/app/shop/product-list/product-list.component';
import { SelectProductComponent } from '@src/app/shop/select-product/select-product.component';
import { ShopProfileComponent } from '@src/app/shop/shop-profile/shop-profile.component';
import { CarouselModule, ModalModule } from 'ng-zorro-antd-mobile';
import { NzCarouselModule } from 'ng-zorro-antd';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { StoreReportComponent } from '@src/app/shop/store-report/store-report.component';
import { SharedModule } from '@src/app/shared/shared.module';
import { ShopItemComponent } from '@src/app/shop/shop-item/shop-item.component';
import { StoreTutorialComponent } from '@src/app/shop/store-tutorial/store-tutorial.component';
import { PurchaseSampleModalComponent } from '@src/app/shop/product-detail/purchase-sample-modal/purchase-sample-modal.component';
import { AddressFormModalComponent } from '@src/app/shop/product-detail/address-form-modal/address-form-modal.component';
import { VariantSelectorComponent } from '@src/app/shop/variant-selector/variant-selector.component';
import { ShopSettingComponent } from '@src/app/shop/shop-setting/shop-setting.component';
import { ShopEntranceComponent } from '@src/app/shop/shop-entrance/shop-entrance.component';
import { ShopingCartComponent } from '@src/app/shop/shoping-cart/shoping-cart.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {NgxMaskModule} from 'ngx-mask';
import { ProductVariantSelectComponent } from '@src/app/shop/product-detail/product-variant-select/product-variant-select.component';

@NgModule({
    declarations: [
        ProductDetailComponent,
        ProductListComponent,
        SelectProductComponent,
        ShopProfileComponent,
        StoreReportComponent,
        ShopItemComponent,
        StoreTutorialComponent,
        PurchaseSampleModalComponent,
        AddressFormModalComponent,
        VariantSelectorComponent,
        ShopSettingComponent,
        ShopEntranceComponent,
        ShopingCartComponent,
        ProductVariantSelectComponent,
    ],
    imports: [
        CommonModule,
        ShopRoutingModule,
        FormsModule,
        CarouselModule,
        NzInputNumberModule,
        NzCarouselModule,
        ModalModule,
        SharedModule,
        UiSwitchModule,
        NzPopconfirmModule,
        NgxMaskModule.forRoot(),
    ],
    providers: [],
    bootstrap: [],
    exports: [],
})
export class ShopModule {}
