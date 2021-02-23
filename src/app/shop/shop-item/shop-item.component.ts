import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-shop-item',
    templateUrl: './shop-item.component.html',
    styleUrls: ['./shop-item.component.scss'],
})
export class ShopItemComponent implements OnInit {
    @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
        sessionStorage.scrollPos = window.scrollY;
    }
    @Input() product;
    @Input() showCommission;
    math = Math;
    date: number;

    constructor() {}
    ngOnInit(): void {
        setInterval(() => {
            this.date = Math.round(new Date().getTime() / 1000);
        }, 100);
    }

    ngAfterViewInit() {
        window.scrollTo(0, sessionStorage.scrollPos);
    }

    displayTitle(title, max_length = 70) {
        if (title.length > max_length) {
            return `${title.substring(0, max_length - 3)}...`;
        }
        return title;
    }

    remainingTime(time) {
        const diff_sec = time - dayjs().unix();
        const hr = Math.floor(diff_sec / 3600) < 10 ? `0${Math.floor(diff_sec / 3600)}` : `${Math.floor(diff_sec / 3600)}`;
        const min =
            Math.floor((diff_sec % 3600) / 60) < 10 ? `0${Math.floor((diff_sec % 3600) / 60)}` : `${Math.floor((diff_sec % 3600) / 60)}`;
        const sec = Math.floor(diff_sec % 60) < 10 ? `0${Math.floor(diff_sec % 60)}` : `${Math.floor(diff_sec % 60)}`;
        return `${hr}:${min}:${sec}`;
    }
}
