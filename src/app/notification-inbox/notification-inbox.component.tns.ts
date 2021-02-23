import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { fakeData, NotificationItem, NotificationDetailType } from './data';

@Component({
    selector: 'app-notification-inbox',
    templateUrl: './notification-inbox.component.tns.html',
    styleUrls: ['./notification-inbox.component.tns.scss'],
})
export class NotificationInboxComponent implements OnInit {
    notificationList: NotificationItem[];

    constructor(private router: RouterExtensions) {}

    ngOnInit(): void {
        this.getNotificationList();
    }

    getNotificationList() {
        setTimeout(() => {
            this.notificationList = fakeData;
        }, 1500);
    }

    refreshList(args) {
        const pullRefresh = args.object;
        setTimeout(() => {
            pullRefresh.refreshing = false;
        }, 1000);
    }

    goDetailPage(item: NotificationItem) {
        console.log(item);
        switch (item.type) {
            case NotificationDetailType.DRAFT_CONTENT_ISSUE:
            case NotificationDetailType.DUE_DATE_WARNING_ISSUE:
            case NotificationDetailType.PRODUCT_SHIPPING_ISSUE:
                this.router.navigate([`campaign-detail/timeline/${item.campaign_id}`]);
                break;
            case NotificationDetailType.INVITE_ISSUE:
                this.router.navigate([`campaign-detail/detail/${item.campaign_id}/myCampaign`]);
                break;
            case NotificationDetailType.MONEY_ISSUE:
                this.router.navigate(['/main-page', { outlets: { myEarnings: 'my-earnings' } }]);
                break;
        }
    }
}
