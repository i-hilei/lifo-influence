import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MyEarningsComponent } from './my-earnings.component';

import { ButtonModule, InputItemModule, ModalModule, ToastModule } from 'ng-zorro-antd-mobile';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from '@src/app/shared/shared.module';

import { MyEarningsService } from './my-earnings.service';

@NgModule({
    declarations: [MyEarningsComponent],
    imports: [
        CommonModule,
        ButtonModule,
        NzIconModule,
        ModalModule,
        FormsModule,
        InputItemModule,
        NzInputModule,
        NzButtonModule,
        ToastModule,
        SharedModule,
    ],
    providers: [MyEarningsService],
})
export class MyEarningsModule {}
