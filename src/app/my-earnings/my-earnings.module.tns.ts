import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SharedModule } from '@shared/shared.module';

import { MyEarningsComponent } from '@src/app/my-earnings/my-earnings.component';

@NgModule({
    imports: [NativeScriptCommonModule, SharedModule],
    declarations: [MyEarningsComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA],
})
export class MyEarningsModule {}
