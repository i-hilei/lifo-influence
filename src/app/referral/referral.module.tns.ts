import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { ReferralsListComponent } from '@src/app/referral/referrals-list/referrals-list.component';
import { ReferralsHistoryComponent } from '@src/app/referral/referrals-history/referrals-history.component';

@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [ReferralsListComponent, ReferralsHistoryComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class ReferralModule {}
