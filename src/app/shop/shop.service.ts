import { Injectable } from '@angular/core';
import { ShopDetail } from './shop.type';

@Injectable({
    providedIn: 'root',
})
export class ShopService {
    private pProductDetailMap: Map<string, any> = new Map();

    private pShopDetail: ShopDetail;

    private pProdcutList: any;

    constructor() {}

    // Shop detail cache
    get cachedShopDetail() {
        return this.pShopDetail;
    }

    set cachedShopDetail(shopDetail: ShopDetail) {
        this.pShopDetail = shopDetail;
    }

    // Product list cache
    get cachedProductList() {
        return this.pProdcutList;
    }

    set cachedProductList(items: any) {
        if (items) {
            this.pProdcutList = items.items.filter((item) => item.status === 'active');
        }
    }

    // Product detail cache
    getCachedProdcutDetailById(id: string) {
        return this.pProductDetailMap.get(id);
    }

    setProductDetailToCache(id: string, productDetail: any) {
        this.pProductDetailMap.set(id, productDetail);
    }

    // Clear all cached data.
    // Sould be call when user log out
    clearAllCachedShopData() {
        this.cachedShopDetail = null;
        this.cachedProductList = null;
        this.pProductDetailMap.clear();
    }
}
