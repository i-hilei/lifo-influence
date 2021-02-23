import { Component, OnInit, Input, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProfileService } from '@services/profile.service';

@Component({
    selector: 'app-shipping-address-form',
    templateUrl: './shipping-address-form.component.html',
    styleUrls: ['./shipping-address-form.component.scss'],
})
export class ShippingAddressFormComponent implements OnInit, OnDestroy {
    public influencer = {
        inf_phone: '',
        inf_name: '',
        inf_last_name: '',
        influencer_address1: '',
        influencer_address2: '',
        influencer_city: '',
        influencer_province: '',
        influencer_country: 'United States',
        influencer_zip: '',
    };

    private subscriptions = new Subscription();

    // Is address form should be auto filled
    @Input() isAutoFillInfo = true;

    @ViewChild('addressText') addresstext;

    constructor(private profileService: ProfileService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        if (this.isAutoFillInfo) {
            this.initInfluencer();
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    initInfluencer() {
        const subscribe = this.profileService.currentProfileSubject.subscribe((profile) => {
            if (!profile) return;

            const { phone_number, name, last_name, address1, address2, city, province, zip } = this.profileService.currentProfile;
            this.influencer = {
                inf_phone: phone_number,
                inf_name: name,
                inf_last_name: last_name,
                influencer_address1: address1,
                influencer_address2: address2,
                influencer_city: city,
                influencer_province: province,
                influencer_zip: zip,
                influencer_country: 'United States',
            };
        });
        this.subscriptions.add(subscribe);
    }

    getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
            componentRestrictions: { country: 'US' },
            types: ['address'],
        });

        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();

            place.address_components.forEach((item) => {
                const addressType = item.types[0];
                if (addressType === 'postal_code') {
                    this.influencer.influencer_zip = item.long_name;
                } else if (addressType === 'administrative_area_level_1') {
                    this.influencer.influencer_province = item.long_name;
                } else if (addressType === 'locality') {
                    this.influencer.influencer_city = item.long_name;
                }
                this.influencer.influencer_address1 = place.name;
            });

            this.cdr.detectChanges();
        });
    }
}
