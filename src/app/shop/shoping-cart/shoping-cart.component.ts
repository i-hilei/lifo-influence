import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopifyService } from '@src/app/services/shopify.service';
import { environment } from '@src/environments/environment';

@Component({
    selector: 'app-shoping-cart',
    templateUrl: './shoping-cart.component.html',
    styleUrls: ['./shoping-cart.component.scss'],
})
export class ShopingCartComponent implements OnInit {
    shopId;

    shopingCart = [];
    shopingCartFull = [];

    shopItems = [];
    disableCheckout = true;

    constructor(private router: Router, private shopifyService: ShopifyService, private activatedRoute: ActivatedRoute) {
        this.shopId = this.activatedRoute.snapshot.paramMap.get('shopId');
    }

    ngOnInit(): void {
        this.shopingCart = this.shopifyService.shopingCart;
        for (let i = 0; i < this.shopingCart.length; i++) {
            const product = this.shopingCart[i];
            console.log(product);
            this.getMatchVariant(product);
        }
        this.shopifyService.listShopItem().then((shopItems) => {
            this.shopItems = shopItems.items;
            this.disableCheckout = false;
        });
    }

    async getMatchVariant(product) {
        const productDetail = await this.shopifyService.fetchProductById(product.product_id);
        if (!productDetail) {
            this.shopifyService.removeItemFromShopingCart(product.product_id, product.variant_id);
            return;
        }

        const matchedVariant = productDetail.variants.find((variant) => variant.id === product.variant_id);
        if (!matchedVariant) {
            this.shopifyService.removeItemFromShopingCart(product.product_id, product.variant_id);
            return;
        }

        productDetail.count = product.count;
        productDetail.selectedVariant = matchedVariant;
        this.shopingCartFull.push(productDetail);
    }

    addCount(product, count) {
        if (product.count + count <= 0 || product.count + count >= 10) {
            return;
        }
        this.shopifyService.updateShopingCartCount(product.id, product.selectedVariant.id, count);
        product.count += count;
    }

    removeProductFromCart(product, index) {
        this.shopifyService.removeItemFromShopingCart(product.id, product.selectedVariant.id);
        this.shopingCartFull.splice(index, 1);
    }

    backToDashboard() {
        if (environment.shopHost.endsWith('shop')) {
            this.router.navigate([`/shop/${this.shopId}`]);
        } else {
            this.router.navigate([`/${this.shopId}`]);
        }
    }

    checkout() {
        let total_commission = 0;
        this.shopingCart.forEach((product) => {
            this.shopItems.forEach((item) => {
                if (product.id === this.shopifyService.encodingShopifyId(item.product_id)) {
                    total_commission = total_commission + product.commission * product.count;
                }
            });
        });
        console.log(total_commission);
        this.shopifyService.createCheckoutShopingCart(this.shopingCart, this.shopId, total_commission).then((result) => {
            window.location.assign(result);
        });
    }
}
