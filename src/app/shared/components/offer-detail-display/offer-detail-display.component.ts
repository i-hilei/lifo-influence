import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OfferDetail } from '@src/app/typings/campaign';

@Component({
    selector: 'app-offer-detail-display',
    templateUrl: './offer-detail-display.component.html',
    styleUrls: ['./offer-detail-display.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class OfferDetailDisplayComponent implements OnInit {
    @Input() offerDetail: OfferDetail;

    constructor() {}

    async ngOnInit() {}

    open(link) {
        if (link.indexOf('http') !== 0) {
            link = `http://${link}`;
        }
        window.open(link, '_blank');
    }

    isArray(element) {
        return typeof element === 'object';
    }
}
