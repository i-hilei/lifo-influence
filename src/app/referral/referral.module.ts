import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReferralsListComponent} from './referrals-list/referrals-list.component';
import {ReferralRoutingModule} from '@src/app/referral/referral-routing.module';
import {NzCheckboxModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '@shared/shared.module';
import { ReferralsHistoryComponent } from './referrals-history/referrals-history.component';


@NgModule({
    declarations: [
        ReferralsListComponent,
        ReferralsHistoryComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReferralRoutingModule,
        NzCheckboxModule,
        SharedModule,
    ],
})
export class ReferralModule {
}
