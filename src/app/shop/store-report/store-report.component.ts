import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InternalShopService } from '@services/internal-shop.service';
import { IOrder } from '@typings/campaign';
import { ShopifyService } from '@services/shopify.service';
import { ProfileService } from '@services/profile.service';

@Component({
    selector: 'app-store-report',
    templateUrl: './store-report.component.html',
    styleUrls: ['./store-report.component.scss'],
})
export class StoreReportComponent implements OnInit {
    visitors: number = 0;
    ordersCount: number = 0;
    totalSales: number = 0;
    earnings: number = 0;
    conversion: number = 0;
    orders: IOrder[] = [];
    modalShow: boolean = false;
    isLoadingData = true;
    constructor(
        private router: Router,
        private shopService: InternalShopService,
        private shopifyService: ShopifyService,
        private profileService: ProfileService
    ) {}

    ngOnInit(): void {
        this.calculateReport();
    }

    viewSelectProduct() {
        this.router.navigate(['/internal-shop/select-product']);
    }

    backToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    calculateReport() {
        Promise.all([this.shopService.getReportData(), this.shopifyService.fetchAllProduct(), this.profileService.getShopActivity()])
            .then(([orders, products, shopActivity]) => {
                this.ordersCount = orders.length;
                this.totalSales = Number(orders.reduce((acc, order) => acc + order.price, 0).toFixed(2));
                this.earnings = Number(orders.reduce((acc, order) => acc + order.commission, 0).toFixed(2));

                this.visitors = shopActivity.unique_visitors;
                this.conversion = shopActivity.total_visits === 0 ?
                    0 : Number(((this.ordersCount / shopActivity.total_visits) * 100).toFixed(2));

                this.orders = orders.map((order) => {
                    order.commission = Number(order.commission.toFixed(2));
                    const product = products.find((product) => this.shopifyService.getShopifyIdFromBase64(product.id) === order.product_id);
                    if (product) {
                        order.shopifyProduct = product;
                    }
                    return order;
                });
            })
            .finally(() => {
                this.isLoadingData = false;
            });
    }
}
