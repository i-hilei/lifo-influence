import { InfluencerInfo } from '@typings/influencer';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions, ModalDialogService, ModalDialogOptions } from '@nativescript/angular';
import { ProfileService } from '@services/profile.service';
import { ToastService } from '@services/toast.service';
import { Page, View } from '@nativescript/core';
import { openUrl } from '@nativescript/core/utils';
import { environment } from '@src/environments/environment.prod';

/* eslint-disable max-len */
import { AddressUpdateModalComponent } from '@shared/components/only-native-component/address-update-modal/address-update-modal.component.tns';
/* eslint-enable max-len */

@Component({
    selector: 'app-account-info',
    templateUrl: './account-info.component.tns.html',
    styleUrls: ['./account-info.component.tns.scss'],
})
export class AccountInfoComponent implements OnInit {
    appSchema = 'lifotest';

    get fullName() {
        return `${this.currentUser?.name || ''} ${this.currentUser?.last_name || ''}`;
    }

    get paypal() {
        const paypal = this.currentUser?.paypal || '';
        const startStr = paypal.slice(0, 3);
        const indexOfAt = paypal.lastIndexOf('@');
        const endStr = paypal.slice(indexOfAt);
        return paypal ? `${startStr}******${endStr}` : '';
    }

    get shippingInfo() {
        const addressArr = [
            this.currentUser?.address1,
            this.currentUser?.address2,
            this.currentUser?.city,
            this.currentUser?.province,
            this.currentUser?.zip,
        ];

        return addressArr.filter((item) => item).join(', ');
    }

    get currentUser() {
        return this.profileService.currentProfile;
    }

    get paypalLink() {
        const url = `${environment.paypal.websiteUrl}/connect`;
        const flowEntry = 'flowEntry=static';
        const client_id = `client_id=${environment.paypal.clientId}`;
        const scope = 'scope=email%20address';
        const redirect_uri = `redirect_uri=${this.appSchema}://influencer.lifo.com?type=paypal`;
        return `${url}?${flowEntry}&${client_id}&${scope}&${redirect_uri}`;
    }

    constructor(
        private router: RouterExtensions,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef,
        private profileService: ProfileService,
        private page: Page,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    showAddressUpdateModal() {
        const options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            fullscreen: true,
        };
        this.modalService.showModal(AddressUpdateModalComponent, options).then((inf: InfluencerInfo) => {
            if (inf) {
                this.profileService
                    .updateCurrentProfileWithInluencerInfo(inf)
                    .then(() => this.toastService.show({ text: 'Update success' }))
                    .catch(() => this.toastService.show({ text: 'Update failed' }));
            }
        });
    }

    showConnectPaypalModal() {
        openUrl(this.paypalLink);
    }

    goSettingPage() {
        this.router.navigate(['setting']);
    }

    goHelpCenterPage() {
        this.router.navigate(['help-center']);
    }

    goReferral() {
        this.router.navigate(['referral/history']);
    }
}
