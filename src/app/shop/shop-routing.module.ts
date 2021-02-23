import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { SelectProductComponent } from './select-product/select-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { StoreReportComponent } from './store-report/store-report.component';
import { ShopEntranceComponent } from './shop-entrance/shop-entrance.component';
import { ShopingCartComponent } from './shoping-cart/shoping-cart.component';
import { InternalShopGuardGuard } from '@services/internal-shop-guard.guard';
// Other
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [
    {
        path: 'internal-shop',
        canActivate: [AngularFireAuthGuard, InternalShopGuardGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
        children: [
            {
                path: 'select-product',
                component: SelectProductComponent,
            },
            {
                path: 'product-detail/:internalShopId/:productId',
                component: ProductDetailComponent,
            },
            {
                path: 'store-report',
                component: StoreReportComponent,
            },
        ],
    },
    {
        path: 'shop-entrance',
        component: ShopEntranceComponent,
    },
    {
        path: 'shop',
        children: [
            {
                path: 'product-detail/:shopId/:productId/:sharedCode',
                component: ProductDetailComponent,
            },
            {
                path: 'product-detail/:shopId/:productId',
                component: ProductDetailComponent,
            },
            {
                path: 'product-list/:shopId',
                redirectTo: ':shopId',
            },
            {
                path: ':shopId',
                component: ProductListComponent,
            },
        ],
    },
    {
        path: 'shoping-cart/:shopId',
        component: ShopingCartComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShopRoutingModule {}
