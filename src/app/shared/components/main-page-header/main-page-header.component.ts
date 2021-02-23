import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-main-page-header',
    templateUrl: './main-page-header.component.html',
    styleUrls: ['./main-page-header.component.scss'],
})
export class MainPageHeaderComponent implements OnInit {
    @Input() title: string;

    constructor() {}

    ngOnInit(): void {}
}
