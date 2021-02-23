import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
// import { ProductDetailComponent } from '@src/app/shop/product-detail/product-detail.component';
// import { ProductListComponent } from '@src/app/shop/product-list/product-list.component';
// import { SelectProductComponent } from '@src/app/shop/select-product/select-product.component';
// import { ShopProfileComponent } from '@src/app/shop/shop-profile/shop-profile.component';
// import { StoreReportComponent } from '@src/app/shop/store-report/store-report.component';
import { ShopComponent } from '@src/app/shop/shop.component';
import { VariantSelectorComponent } from '@src/app/shop/variant-selector/variant-selector.component';
import { ShopEntranceComponent } from '@src/app/shop/shop-entrance/shop-entrance.component';
import { ShopingCartComponent } from '@src/app/shop/shoping-cart/shoping-cart.component';

@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [ShopComponent, VariantSelectorComponent, ShopEntranceComponent, ShopingCartComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ShopModule {}
