import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { Screen } from '@nativescript/core/platform';

import { Subscription } from 'rxjs';
import { SubscriptionsService } from '@services/subscriptions.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
    screenWidth = Screen.mainScreen.widthDIPs;

    subscription = new Subscription();

    constructor(public modalDialogParams: ModalDialogParams, private subService: SubscriptionsService) {}

    ngOnInit(): void {
        const sub = this.subService.subscribeCloaseLoading(() => this.modalDialogParams.closeCallback());
        this.subscription.add(sub);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
