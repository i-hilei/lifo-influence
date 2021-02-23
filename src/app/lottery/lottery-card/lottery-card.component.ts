import {Component, Input, OnInit} from '@angular/core';
import {LotteryService} from '@src/app/lottery/lottery.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-lottery-card',
    templateUrl: './lottery-card.component.html',
    styleUrls: ['./lottery-card.component.scss'],
})
export class LotteryCardComponent implements OnInit {
    @Input() hasRedirect: boolean = true;

    constructor(
        public lotteryService: LotteryService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
    }

    redirectToInformation() {
        if (this.hasRedirect) {
            this.router.navigate(['/lottery-information']);
        }
    }

    getStatus() {
        if (this.lotteryService.activeLottery) {
            return String(this.lotteryService.activeLottery.status).replace(/_/g, ' ');
        }
        return undefined;
    }
}
