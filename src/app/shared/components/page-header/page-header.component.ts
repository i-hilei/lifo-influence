import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router, Params } from '@angular/router';

export interface HeaderConfig {
    title?: string;
    backUrl?: string;
    leftImgUrl?: string;
    rightLinkText?: string;
    replaceUrl?: boolean;
    queryParams?: Params;
}

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
    @Input('headerConfig') headerConfig: HeaderConfig;
    @Input('disableRightLink') disableRightLink: boolean;
    @Input('disableLefttLink') disableLeftLink: boolean;
    @Input() isLoading: boolean = false;

    @Output() onBackClick = new EventEmitter<void>();
    @Output() onRightLinkClick = new EventEmitter<void>();

    constructor(private router: Router, private location: Location) {}

    ngOnInit(): void {}

    back() {
        if (this.disableLeftLink) return;

        if (this.headerConfig?.backUrl) {
            this.router.navigate([this.headerConfig?.backUrl], {
                queryParams: this.headerConfig.queryParams,
            });
        } else {
            this.location.back();
        }
    }

    rightLinkClick() {
        this.onRightLinkClick.emit();
    }
}
