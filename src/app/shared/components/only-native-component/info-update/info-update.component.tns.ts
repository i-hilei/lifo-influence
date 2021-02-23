import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { InfluencerInfo } from '@typings/influencer';
import { Variant } from '@services/campaign.service';

@Component({
    selector: 'app-info-update',
    templateUrl: './info-update.component.tns.html',
    styleUrls: ['./info-update.component.tns.scss'],
})
export class InfoUpdateComponent implements OnInit {
    influencer: InfluencerInfo = {
        inf_email: '',
        inf_phone: '',
        inf_name: '',
        inf_last_name: '',
        influencer_address1: '',
        influencer_address2: '',
        city: '',
        province: '',
        country: '',
        zip: '',
        variant_id: null,
    };
    productTypeList: Variant[];

    requiredField = ['inf_name', 'inf_last_name', 'influencer_address1', 'city', 'province', 'zip'];

    get btnEnabled() {
        return this.requiredField.every((key) => {
            return !!this.influencer[key];
        });
    }

    get context(): { confirmText: string; backText: string; influencer: InfluencerInfo; productTypeList: Variant[] } {
        return this.modalDialogParams.context;
    }

    constructor(private modalDialogParams: ModalDialogParams) {}

    ngOnInit(): void {
        this.influencer = this.context.influencer;
        this.productTypeList = this.context.productTypeList;
    }

    selectProductType(id: number) {
        this.influencer.variant_id = id;
    }

    back() {
        this.modalDialogParams.closeCallback(null);
    }

    accept() {
        this.modalDialogParams.closeCallback(this.influencer);
    }
}
