import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { ShippingAddressFormComponent } from '@shared/components/shipping-address-form/shipping-address-form.component';

@Component({
    selector: 'app-address-form-modal',
    templateUrl: './address-form-modal.component.html',
    styleUrls: ['./address-form-modal.component.scss'],
})
export class AddressFormModalComponent implements OnInit {
    public isPurchasing = false;

    @ViewChild('AddressForm') AddressForm: ShippingAddressFormComponent;
    @Output() onPurchase = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    purchase() {
        this.onPurchase.emit(this.AddressForm.influencer);
    }
}
