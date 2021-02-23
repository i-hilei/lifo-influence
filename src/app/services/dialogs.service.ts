import { Injectable, ViewContainerRef, Type } from '@angular/core';
import { ModalDialogOptions, ModalDialogService, registerElement } from '@nativescript/angular';
import { alert, AlertOptions } from '@nativescript/core';

import { LoadingComponent } from '@shared/components/loading/loading.component';
import { SubscriptionsService } from '@services/subscriptions.service';
import { GENERAL_ERROR_MESSAGE } from '@shared/const/message';
import { ExtendedShowModalOptions } from 'nativescript-windowed-modal';

declare const UIModalPresentationStyle;

@Injectable({
    providedIn: 'root',
})
export class DialogsService {
    constructor(private modaldialogService: ModalDialogService, private subscriptionService: SubscriptionsService) {}

    /**
     * @description ViewContainerRef can not be injected service
     * so we nee inject the ViewContainerRef in compoent
     * then we pass it to showLoading function
     */
    showLoading(vcr: ViewContainerRef) {
        const options: ModalDialogOptions = {
            viewContainerRef: vcr,
            ios: {
                presentationStyle: UIModalPresentationStyle.OverFullScreen,
            },
        };
        return this.modaldialogService.showModal(LoadingComponent, options);
    }

    /**
     * TODO: Currently we need call hiddenLoading function before navigate
     * Otherwise it will be redirect to original page
     * Need find a better way to solve this problem
     *
     * Temp Solution:
     * this.xxx.hiddenLoading();
     * setTimout(()=>this.router.navigate(),100)
     */
    hiddenLoading() {
        this.subscriptionService.closeLoadingSubjectUpdate();
    }

    showErrorMessage(err?: string) {
        const options: AlertOptions = {
            message: err ?? GENERAL_ERROR_MESSAGE,
            okButtonText: 'OK',
        };
        alert(options);
    }

    showModal(type: Type<any>, options: ModalDialogOptions & ExtendedShowModalOptions) {
        return this.modaldialogService.showModal(type, options);
    }
}
