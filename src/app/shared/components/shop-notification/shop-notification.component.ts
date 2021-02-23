import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Router} from '@src/app/native-helper/router-helper/router';
import {NzModalService} from 'ng-zorro-antd';
import {ShopifyService} from '@services/shopify.service';

@Component({
    selector: 'app-shop-notification',
    templateUrl: './shop-notification.component.html',
    styleUrls: ['./shop-notification.component.scss'],
})
export class ShopNotificationComponent implements OnInit {
    days: {
        id: number;
        title: string;
        isEarned: boolean;
        func: any;
    }[] = [
        {
            id: 1,
            title: 'commission +1%',
            isEarned: false,
            func: () => {},
        },
        {
            id: 2,
            title: 'commission +2%',
            isEarned: false,
            func: () => {},
        },
        {
            id: 3,
            title: 'commission +5%',
            isEarned: false,
            func: () => {},
        },
        {
            id: 4,
            title: '+$5 in wallet',
            isEarned: false,
            func: () => {},
        },
        {
            id: 5,
            title: 'commission +10%',
            isEarned: false,
            func: () => {},
        },
        {
            id: 6,
            title: '+1 raffle ticket',
            isEarned: false,
            func: () => {},
        },
        {
            id: 7,
            title: 'commission +20%',
            isEarned: false,
            func: () => {},
        },
    ];

    currentTab: 'notification' | 'bonuses' = 'notification';
    constructor(
        private router: Router,
        private modalService: NzModalService,
        private shopifyService: ShopifyService,
    ) {
    }

    ngOnInit(): void {
        // this.shopifyService.getShopVisitsHistory()
        //     .then(visitsHistory => {
        //         for (let i = 0; i < visitsHistory.length; i++) {
        //             if (visitsHistory[i].visits_count >= 5) {
        //                 this.days[i].isEarned = true;
        //                 continue;
        //             }
        //             break;
        //         }
        //     });
    }

    navigateToShop() {
        // Workaround. It is necessary to create a better way to close exactly the needed modal
        this.modalService.closeAll();
        this.router.navigate(['/internal-shop/select-product']);
    }

    clickNext() {
        this.currentTab = 'bonuses';
    }
}
