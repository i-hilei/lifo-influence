import {Injectable} from '@angular/core';
import {RequestService} from '@services/request.service';
import {ILottery, IRaffleHistory} from '@typings/lottery.typings';
import {IReferralHistory} from '@typings/referrals.typings';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LotteryService {
    activeLottery: ILottery = null;
    activeLottery$: BehaviorSubject<ILottery> = new BehaviorSubject<ILottery>(undefined);
    lotteryReferrals: IReferralHistory[] = [];
    userTotalTickets: number = 0;
    userAvailableTickets: number = 0;

    constructor(
        private requestService:RequestService
    ) {
    }

    getActiveLottery() {
        return this.requestService.sendRequest<ILottery>({
            method: 'GET',
            url: '/lottery/active',
        })
            .then(lottery => {
                this.activeLottery = lottery;
                this.activeLottery$.next(lottery);
            });
    }

    getTicketsNumber() {
        return this.requestService.sendRequest<ILottery>({
            method: 'GET',
            url: '/lottery/tickets',
        });
    }

    getAvailableTicketsNumber() {
        return this.requestService.sendRequest<ILottery>({
            method: 'GET',
            url: '/lottery/available-tickets',
        });
    }

    getRaffleResultHistory(): Promise<IRaffleHistory[]> {
        return this.requestService.sendRequest<IRaffleHistory[]>({
            method: 'GET',
            url: '/lottery/raffle_result',
        });
    }

    drawRaffle(): Promise<{amount: number}> {
        return this.requestService.sendRequest<{amount: number}>({
            method: 'POST',
            url: '/lottery/draw_with_ticket',
            data: {
                raffle_id: this.activeLottery.id,
            },
        });
    }
}
