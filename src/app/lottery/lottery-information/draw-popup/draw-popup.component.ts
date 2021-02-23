import {Component, OnInit} from '@angular/core';
import {LotteryService} from '@src/app/lottery/lottery.service';

enum DrawState {
    firstDraw = 'first-draw' ,
    loading = 'loading' ,
    drawResults = 'draw-results' ,
    notEnoughTickets = 'not-enough-tickets',
}

@Component({
    selector: 'app-draw-popup',
    templateUrl: './draw-popup.component.html',
    styleUrls: ['./draw-popup.component.scss'],
})
export class DrawPopupComponent implements OnInit {
    DrawState = DrawState;
    drawState: DrawState = DrawState.firstDraw;
    amountReceived: number = 0;

    constructor(
        public lotteryService: LotteryService
    ) {
    }

    async ngOnInit() {
        if (this.lotteryService.userAvailableTickets <= 0) {
            this.drawState = DrawState.notEnoughTickets;
        }
    }

    async getAvailableTickets(): Promise<void> {
        this.lotteryService.userAvailableTickets = await this.lotteryService.getAvailableTicketsNumber();
        if (this.lotteryService.userAvailableTickets <= 0) {
            this.drawState = DrawState.notEnoughTickets;
        }
    }

    async drawRaffle() {
        this.drawState = DrawState.loading;
        try {
            const response = await this.lotteryService.drawRaffle();
            if (response.amount) {
                await this.getAvailableTickets();
                this.amountReceived = response.amount;
                this.drawState = DrawState.drawResults;
            }
        } catch (e) {
            await this.getAvailableTickets();
        }
    }

}
