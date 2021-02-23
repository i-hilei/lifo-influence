import { Component, OnInit } from '@angular/core';
import { htmlView } from '@src/app/shared/components/terms-of-use/terms-of-use.text';

@Component({
    selector: 'app-terms-of-use',
    templateUrl: './terms-of-use.component.tns.html',
    styleUrls: ['./terms-of-use.component.tns.scss'],
})
export class TermsOfUseComponent implements OnInit {
    htmlView = htmlView;
    constructor() {}

    ngOnInit(): void {}
}
