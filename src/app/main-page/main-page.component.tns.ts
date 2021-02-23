import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Color, Page } from '@nativescript/core';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.tns.html',
    styleUrls: ['./main-page.component.tns.scss'],
})
export class MainPageComponent implements OnInit {
    tabs = [
        {
            title: 'CAMPAIGNS',
            iconActiveUrl: 'res://images/discover_active',
            iconUnActiveUrl: 'res://images/discover',
            secondRouter: { discover: 'discover' },
        },
        {
            title: 'MY SHOP',
            iconActiveUrl: 'res://images/my_campaigns_active',
            iconUnActiveUrl: 'res://images/my_campaigns',
            secondRouter: { shop: 'shop' },
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
            secondRouter: { inbox: 'inbox' },
        },
        {
            title: 'Account',
            iconActiveUrl: 'res://images/account_active',
            iconUnActiveUrl: 'res://images/account',
            secondRouter: { accountInfo: 'account-info' },
        },
    ];

    selectedIndex = 4;

    get activedTab() {
        return this.tabs[this.selectedIndex];
    }

    constructor(private router: RouterExtensions, private activatedRoute: ActivatedRoute, private page: Page) {
        this.page.actionBarHidden = true;
        this.page.actionBar.backgroundColor = '#fff';
        this.page.actionBar.color = new Color('#333');
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.selectedIndex = 0;
            this.switchTab();
        }, 0);
    }

    onItemTap(index: number) {
        this.selectedIndex = index;
        this.switchTab();
    }

    switchTab() {
        this.router.navigate(['/main-page', { outlets: this.activedTab.secondRouter }]);
    }
}
