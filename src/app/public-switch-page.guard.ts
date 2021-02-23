import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, UrlTree } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})
export class PublicSwitchPageGuard implements CanActivate {
    constructor(private auth: AngularFireAuth, private router: Router, private activatedRoute: ActivatedRoute) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (await this.isUserLogged()) {
            const { path } = route.routeConfig;

            switch (path) {
                case 'public-invitation/:campaignId/:accountId':
                    return this.router.createUrlTree([`/campaign-detail/${route.params.campaignId}`]);
                case 'public-other':
                    return this.router.createUrlTree(['']);
            }
        } else {
            return true;
        }
    }

    async isUserLogged() {
        return new Promise((resolve) => {
            this.auth.user.subscribe((user) => {
                user ? resolve(true) : resolve(false);
            });
        });
    }
}
