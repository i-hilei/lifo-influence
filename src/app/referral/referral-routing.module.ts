import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {redirectUnauthorizedToLogin} from '@src/app/app-routing.module';
import {ReferralsListComponent} from '@src/app/referral/referrals-list/referrals-list.component';
import {ReferralsHistoryComponent} from '@src/app/referral/referrals-history/referrals-history.component';
import {InstagramGuardService} from '@services/instagram-guard.service';

const routes: Routes = [
    {
        path: 'referrals',
        canActivate: [AngularFireAuthGuard],
        data: {authGuardPipe: redirectUnauthorizedToLogin},
        children: [
            {
                path: '',
                redirectTo: 'invite',
                pathMatch: 'full',
            },
            {
                path: 'invite/:lottery_id',
                canActivate: [InstagramGuardService],
                component: ReferralsListComponent,
            },
            {
                path: 'invite',
                canActivate: [InstagramGuardService],
                component: ReferralsListComponent,
            },
            {
                path: 'history',
                canActivate: [InstagramGuardService],
                component: ReferralsHistoryComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReferralRoutingModule {
}
