import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firebase } from '@nativescript/firebase';
import { RouterExtensions } from '@nativescript/angular';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
    constructor(private router: RouterExtensions) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        try {
            const user = await firebase.getCurrentUser();
            if (user) {
                this.router.navigate([
                    '/main-page',
                    {
                        outlets: {
                            discover: 'discover',
                            inbox: 'inbox',
                            myEarnings: 'my-earnings',
                            accountInfo: 'account-info',
                            shop: 'shop',
                        },
                    },
                ]);
                return false;
            }
        } catch (err) {
            console.log(err);
        }

        return true;
    }
}
