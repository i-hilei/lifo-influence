import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ShopifyService } from '@src/app/services/shopify.service';
import { ShopService } from '../shop.service';
import { ShopStatusEnum } from '../shop.type';

@Component({
    selector: 'app-shop-entrance',
    templateUrl: './shop-entrance.component.html',
    styleUrls: ['./shop-entrance.component.scss'],
})
export class ShopEntranceComponent implements OnInit {
    get shopDetail() {
        return this.shopService.cachedShopDetail;
    }
    set shopDetail(detail) {
        this.shopService.cachedShopDetail = detail;
    }

    constructor(
        private shopifyService: ShopifyService,
        private shopService: ShopService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.shopifyService.getShopDetailInternal().then(shopDetail => {
            this.shopDetail = shopDetail;
        });
    }

    backToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    applyShop() {
        this.shopifyService.applyShop().then(result => {
            this.shopDetail.status = ShopStatusEnum.APPLIED;
        });
    }

    get applied() {
        return this.shopDetail && this.shopDetail.status === ShopStatusEnum.APPLIED;
    }
}
