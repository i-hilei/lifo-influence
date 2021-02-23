import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LotteryInformationComponent} from '@src/app/lottery/lottery-information/lottery-information.component';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {redirectUnauthorizedToLogin} from '@src/app/app-routing.module';
import {InstagramGuardService} from '@services/instagram-guard.service';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        canActivate: [AngularFireAuthGuard, InstagramGuardService],
        data: {authGuardPipe: redirectUnauthorizedToLogin},
        children: [
            {
                path: '',
                redirectTo: 'lottery-information',
                pathMatch: 'full',
            },
            {
                path: 'lottery-information',
                component: LotteryInformationComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class LotteryRoutingModule {
}
