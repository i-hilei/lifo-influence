import {Component, OnInit} from '@angular/core';
import {LotteryService} from '@src/app/lottery/lottery.service';
import {Router} from '@angular/router';
import { InstagramGuardService } from '@src/app/services/instagram-guard.service';

@Component({
    selector: 'app-lottery-redirect',
    templateUrl: './lottery-redirect.component.html',
    styleUrls: ['./lottery-redirect.component.scss'],
})
export class LotteryRedirectComponent implements OnInit {

    sourceMap = {
        '/ins': 'instagram',
        '/web': 'website',
        '/wechat': 'wechat',
        '/fb': 'facebook',
        '/email': 'email',
    };

    constructor(
        private router: Router,
    ) {
        const source = this.sourceMap[router.url] ? this.sourceMap[router.url] : 'unknown';
        this.router.navigate(['/get-started'], {
            queryParams: {
                // lotteryId: 'QlXJ1t2Y3Z24Wxrrke69',
                source,
            },
        });
    }

    ngOnInit(): void {
    }

}
