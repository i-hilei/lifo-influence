import {Component, OnDestroy, OnInit} from '@angular/core';
import {LotteryService} from '@src/app/lottery/lottery.service';
import {IRaffleHistory, LotteryStatus, LotteryType} from '@typings/lottery.typings';
import {Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
    selector: 'app-lottery-information',
    templateUrl: './lottery-information.component.html',
    styleUrls: ['./lottery-information.component.scss'],
})
export class LotteryInformationComponent implements OnInit, OnDestroy {
    LotteryType = LotteryType;
    private unsubscribe: Subject<void> = new Subject();
    showLotteryButtons: boolean = false;
    modalShow: boolean = false;
    raffleHistory: IRaffleHistory[] = [];

    pageHeaderConfig = {
        title: 'Raffle',
    };

    constructor(
        public lotteryService: LotteryService,
        private router: Router,
    ) {
        this.lotteryService.activeLottery$
            .pipe(
                takeUntil(this.unsubscribe),
                filter(activeLottery => activeLottery !== undefined),
                map(async activeLottery => {
                    if (activeLottery === null) {
                        this.router.navigate(['/dashboard']);
                    }
                    this.showLotteryButtons = this.lotteryService.activeLottery &&
                        this.lotteryService.activeLottery.status === LotteryStatus.raffle;


                    await this.getRaffleHistory();
                })
            )
            .subscribe();

        Promise.all([
            this.lotteryService.getTicketsNumber(),
            this.lotteryService.getAvailableTicketsNumber(),
        ])
            .then(([ticketsNumber, availableTickets]) => {
                this.lotteryService.userTotalTickets = ticketsNumber;
                this.lotteryService.userAvailableTickets = availableTickets;
            });
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    async getRaffleHistory() {
        if (this.lotteryService.activeLottery.type === LotteryType.drawing) {
            this.raffleHistory = await this.lotteryService.getRaffleResultHistory();
        }
    };

    async onModalClose() {
        await this.getRaffleHistory();
    }

    getEarnedMoney(): number {
        return this.raffleHistory.reduce((acc, raffleHistory) => acc + Number(raffleHistory.amount), 0);
    }

}
