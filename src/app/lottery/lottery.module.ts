import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LotteryCardComponent} from '@src/app/lottery/lottery-card/lottery-card.component';
import {LotteryInformationComponent} from '@src/app/lottery/lottery-information/lottery-information.component';
import {LotteryRoutingModule} from '@src/app/lottery/lottery-routing.module';
import { SharedModule } from '@src/app/shared/shared.module';
import {FormsModule} from '@angular/forms';
import { DrawPopupComponent } from '@src/app/lottery/lottery-information/draw-popup/draw-popup.component';


@NgModule({
    declarations: [
        LotteryCardComponent,
        LotteryInformationComponent,
        DrawPopupComponent,
    ],
    imports: [
        CommonModule,
        LotteryRoutingModule,
        FormsModule,
        SharedModule,
    ],
    exports: [
        LotteryCardComponent,
    ],
})
export class LotteryModule {
}
