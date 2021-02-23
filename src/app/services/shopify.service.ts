import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import Client from 'shopify-buy';
import { RequestService } from './request.service';

@Injectable({
    providedIn: 'root',
})
export class ShopifyService {
    DISCOVER_SERVICE_URL = environment.discoverApiUrl;
    client;

    shopingCart = [];

    constructor(private requestService: RequestService) {
        this.initClient();
        const shopingCartString = localStorage.getItem('shoping_cart');
        if (shopingCartString) {
            this.shopingCart = JSON.parse(shopingCartString);
        }
    }

    initClient() {
        // Initializing a client to return content in the store's primary language
        this.client = Client.buildClient({
            domain: 'lifo-store.myshopify.com',
            storefrontAccessToken: '8a63d49054d11e5139aaed4778817ddb',
        });
    }

    addItemToShopingCart(product_id, variant_id, count) {
        let find = false;
        this.shopingCart.forEach((item) => {
            if (item.product_id === product_id && item.variant_id === variant_id) {
                item.count += count;
                find = true;
            }
        });
        if (!find) {
            this.shopingCart.push({
                product_id,
                variant_id,
                count,
            });
        }

        localStorage.setItem('shoping_cart', JSON.stringify(this.shopingCart));
        return this.shopingCart;
    }

    updateShopingCartCount(product_id, variant_id, count) {
        for (let i = 0; i < this.shopingCart.length; i++) {
            const item = this.shopingCart[i];
            if (item.product_id === product_id && item.variant_id === variant_id) {
                item.count += count;
            }
        }
        localStorage.setItem('shoping_cart', JSON.stringify(this.shopingCart));
        return this.shopingCart;
    }

    removeItemFromShopingCart(product_id, variant_id) {
        let index = -1;
        for (let i = 0; i < this.shopingCart.length; i++) {
            const item = this.shopingCart[i];
            if (item.product_id === product_id && item.variant_id === variant_id) {
                index = i;
            }
        }
        if (index >= 0) {
            this.shopingCart.splice(index, 1);
        }
        localStorage.setItem('shoping_cart', JSON.stringify(this.shopingCart));
        return this.shopingCart;
    }

    get shopingCartItems() {
        return this.shopingCart;
    }

    fetchAllProduct() {
        return this.client.product.fetchAll(200);
    }

    fetchProductById(productId) {
        return this.client.product.fetch(productId);
    }

    updateProductList(product_list) {
        return this.requestService.sendRequest({
            method: 'PUT',
            url: '/influencer/shop-proudct-list',
            data: {
                product_list,
            },
            api: 'api-shop',
        });
    }

    getShopDetailInternal() {
        return this.requestService.sendRequest({
            method: 'GET',
            url: '/influencer/shop-detail',
            api: 'api-shop',
        });
    }

    getShopVisitsHistory() {
        return this.requestService.sendRequest({
            method: 'GET',
            url: '/influencer/shop-visits-history',
        });
    }

    getShopDetailExternal(shop_id) {
        return this.requestService.sendRequest({
            method: 'GET',
            url: `/shared/shop/${shop_id}`,
            api: 'api-shop',
        });
    }

    listShopItem() {
        return this.requestService.sendRequest<any>({
            method: 'GET',
            url: '/shared/list_product',
            api: 'data-shop',
        });
    }

    applyShop() {
        return this.requestService.sendRequest<any>({
            method: 'PUT',
            url: '/influencer/apply_shop',
            api: 'api-shop',
        });
    }

    async createCheckoutShopingCart(shoping_cart, shop_id, commission) {
        const line_items = shoping_cart.map((product) => {
            return {
                variantId: product.variant_id,
                quantity: product.count,
            };
        });
        const checkout = await this.client.checkout.create({
            customAttributes: [
                {
                    key: 'lifo_shop_id',
                    value: shop_id,
                },
                {
                    key: 'commission',
                    value: String(commission),
                },
            ],
            lineItems: line_items,
        });
        const checkoutId = checkout.id;
        console.log(checkout.webUrl);
        return checkout.webUrl;
    }

    async createCheckout(params: { product_variant: any; shop_id: any; commission: any; coupon_code?: any; quantity?: number }) {
        const { product_variant, shop_id, commission, coupon_code, quantity } = params;

        const checkout = await this.client.checkout.create({
            customAttributes: [
                {
                    key: 'lifo_shop_id',
                    value: shop_id,
                },
                {
                    key: 'commission',
                    value: String(commission),
                },
            ],
            lineItems: [
                {
                    variantId: product_variant.id,
                    quantity: quantity ?? 1,
                },
            ],
        });
        const checkoutId = checkout.id;

        // // Update shop info to orders
        // const input = {
        //     customAttributes: [
        //         {
        //             key: 'lifo_shop_id',
        //             value: shop_id,
        //         },
        //         {
        //             key: 'commission',
        //             value: String(commission),
        //         },
        //     ],
        // };
        // console.log(input);
        // console.log(new Date());
        // checkout = await this.client.checkout.updateAttributes(checkoutId, input);

        // // Add item
        // const lineItemsToAdd = [
        //     {
        //       variantId: product_variant.id,
        //       quantity: 1,
        //       // customAttributes: [{key: 'MyKey', value: 'MyValue'}],
        //     },
        // ];
        // console.log(new Date());
        // // Add an item to the checkout
        // checkout = await this.client.checkout.addLineItems(checkoutId, lineItemsToAdd);

        // // discount
        // const discountCode = 'best-discount-ever';

        if (coupon_code) {
            // Add a discount code to the checkout
            await this.client.checkout.addDiscount(checkoutId, coupon_code);
        }

        // Shipping
        // const shippingAddress = {
        //     address1: 'Chestnut Street 92',
        //     address2: 'Apartment 2',
        //     city: 'Louisville',
        //     company: null,
        //     country: 'United States',
        //     firstName: 'Bob',
        //     lastName: 'Norman',
        //     phone: '555-625-1199',
        //     province: 'Kentucky',
        //     zip: '40202',
        // };

        // Update the shipping address for an existing checkout.
        // checkout = await this.client.checkout.updateShippingAddress(checkoutId, shippingAddress);
        console.log(checkout.webUrl);
        return checkout.webUrl;
    }

    getShopifyIdFromBase64(base64Id: string): number {
        const decoded = atob(base64Id);
        const shopifyId = decoded.split('/').pop();
        return parseInt(shopifyId, 10);
    }

    encodingShopifyId(id: number): string {
        return btoa(`gid://shopify/Product/${id}`);
    }

    generateCouponCode(product_link_id: string, phone_number: string) {
        return this.requestService.sendRequest({
            method: 'POST',
            url: `/shared/virus_loop/create_coupon_code`,
            api: 'data-shop',
            data: {
                product_link_id,
                phone_number,
            },
        });
    }
}
