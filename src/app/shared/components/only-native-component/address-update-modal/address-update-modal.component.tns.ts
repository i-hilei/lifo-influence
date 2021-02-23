import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { ProfileService } from '@services/profile.service';

@Component({
    selector: 'app-address-update-modal',
    templateUrl: './address-update-modal.component.tns.html',
    styleUrls: ['./address-update-modal.component.tns.scss'],
})
export class AddressUpdateModalComponent implements OnInit {
    influencer = {
        inf_name: '',
        inf_phone: '',
        inf_last_name: '',
        influencer_address1: '',
        influencer_address2: '',
        city: '',
        province: '',
        country: '',
        zip: '',
    };

    subscriptions = new Subscription();

    get context() {
        return this.modalDialogParams.context;
    }

    constructor(private modalDialogParams: ModalDialogParams, private profileService: ProfileService) {}

    ngOnInit(): void {
        this.subscribeCurrentProfileUpdate();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    subscribeCurrentProfileUpdate() {
        return new Promise((resolve) => {
            const profileSub = this.profileService.currentProfileSubject.subscribe((val) => {
                if (!val) return;

                const { name, last_name, address1, address2, phone_number, city, province, zip } = val;
                this.influencer = {
                    ...this.influencer,
                    inf_phone: phone_number,
                    inf_name: name,
                    inf_last_name: last_name,
                    influencer_address1: address1,
                    influencer_address2: address2,
                    city,
                    province,
                    country: 'United States',
                    zip,
                };
                resolve();
            });
            this.subscriptions.add(profileSub);
        });
    }

    closeModal() {
        this.modalDialogParams.closeCallback();
    }

    saveInformation() {
        this.modalDialogParams.closeCallback(this.influencer);
    }
}
