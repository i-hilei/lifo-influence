import { Component, OnInit } from '@angular/core';
import { Router } from '@src/app/native-helper/router-helper/router';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    tabs = [
        {
            title: 'Discover',
            iconActiveUrl: 'res://images/discover_active',
            iconUnActiveUrl: 'res://images/discover',
            secondRouter: { discover: 'discover' },
        },
        {
            title: 'Campaigns',
            iconActiveUrl: 'res://images/my_campaigns_active',
            iconUnActiveUrl: 'res://images/my_campaigns',
            secondRouter: { campaign: 'campaign' },
        },
        {
            title: 'Wallet',
            iconActiveUrl: 'res://images/dollar_active',
            iconUnActiveUrl: 'res://images/dollar',
            secondRouter: { myEarnings: 'my-earnings' },
        },
        {
            title: 'Inbox',
            iconActiveUrl: 'res://images/inbox_active',
            iconUnActiveUrl: 'res://images/inbox',
            secondRouter: { inbox: 'auto-generated' },
        },
        {
            title: 'Account',
            iconActiveUrl: 'res://images/account_active',
            iconUnActiveUrl: 'res://images/account',
            secondRouter: { accountInfo: 'account-info' },
        },
    ];

    activedTab = this.tabs[0];

    constructor(private router: Router) {}

    ngOnInit(): void {}

    toggleActivedTab(tab) {
        this.activedTab = tab;
        this.goPage();
    }

    onSelectedIndexChanged(e) {}

    goPage() {
        this.router.navigate(['/main-page']);
    }
}
