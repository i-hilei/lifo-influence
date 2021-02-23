import { Injectable } from '@angular/core';
import { RequestService } from '@services/request.service';
import { FirebaseEventsService } from '@services/firebase-events.service';

export enum SampleStatusEnum {
    available = 'available',
    notAvailable = 'not_available',
    ordered = 'ordered',
}

@Injectable({
    providedIn: 'root',
})
export class ProductDetailService {
    constructor(private requestService: RequestService, private firebaseEventsService: FirebaseEventsService) {}

    // Fetch Data

    getSampleStatus(headerBody: { shopId: string; productId: number }) {
        return this.requestService.sendRequest<{ status: SampleStatusEnum }>({
            method: 'GET',
            url: `/influencer/sample_available?product_id=${headerBody.productId}&shop_id=${headerBody.shopId}`,
            api: 'discover',
        });
    }

    orderSample(headerBody: { shop_id: string; product_id: number; price: number; shipping_address: any }) {
        return this.requestService.sendRequest({
            method: 'POST',
            url: '/influencer/order_sample',
            data: headerBody,
            api: 'discover',
        });
    }

    checkProductLink(shop_id, product_id, phone_number) {
        return this.requestService.sendRequest({
            method: 'POST',
            url: '/shared/shop/check-product-link',
            data: {
                shop_id,
                product_id,
                phone_number,
            },
        });
    }

    getProductShareLink(shop_id, product_id, phone_number) {
        return this.requestService.sendRequest({
            method: 'POST',
            url: '/shared/shop/phone-number',
            data: {
                shop_id,
                product_id,
                phone_number,
            },
        });
    }

    getLikeProduct(code, phone_number) {
        return this.requestService.sendRequest({
            method: 'POST',
            url: '/shared/shop/like-product',
            data: {
                code,
                phone_number,
            },
        });
    }

    getProductById(product_id) {
        return this.requestService.sendRequest({
            method: 'GET',
            url: `/shared/shop/product/${product_id}`,
        });
    }

    // Handle data
}
