import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { ShopifyService } from '@services/shopify.service';
import { ShopService } from '@src/app/shop/shop.service';
import { ShopStatusEnum } from '../shop/shop.type';

@Injectable({
    providedIn: 'root',
})
export class InternalShopGuardGuard implements CanActivate {
    globalLoadingSubject = new BehaviorSubject(false);

    constructor(private shopifyService: ShopifyService, private shopService: ShopService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.shopService.cachedShopDetail) {
            this.globalLoadingSubject.next(true);
            return this.shopifyService
                .getShopDetailInternal()
                .then((detail) => {
                    this.shopService.cachedShopDetail = detail;
                    this.globalLoadingSubject.next(false);
                    this.globalLoadingSubject.complete();
                    return Promise.resolve(this.judgeShopStatus());
                })
                .catch((err) => {
                    this.router.navigate(['/dashboard']);
                    this.globalLoadingSubject.next(false);
                    this.globalLoadingSubject.complete();
                    return false;
                });
        }

        return this.judgeShopStatus();
    }

    judgeShopStatus() {
        switch (this.shopService.cachedShopDetail.status) {
            case ShopStatusEnum.NOT_ELIGIBLE:
            case ShopStatusEnum.APPLIED:
                this.router.navigate(['shop-entrance']);
                return false;
            case ShopStatusEnum.DEV:
            case ShopStatusEnum.LIVE:
                return true;
            default:
                return true;
        }
    }
}
