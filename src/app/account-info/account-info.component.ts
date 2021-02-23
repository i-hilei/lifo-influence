import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ProfileService } from '@services/profile.service';
import { ProfileModel } from '@src/app/models/profile.model';
import { Subject } from 'rxjs';
import { IProfile } from '@src/app/typings/profile.typings';
import { FormBuilder } from '@angular/forms';
import { environment } from '@src/environments/environment';
import { Router } from '@angular/router';
import {PaypalService} from '@services/paypal.service';

@Component({
    selector: 'app-account-info',
    templateUrl: './account-info.component.html',
    styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
    @ViewChild('addresstext') addresstext: any;

    currentUserProfile: ProfileModel = new ProfileModel();
    modalShow: boolean = false;
    editModeBlocks = {
        name: false,
        last_name: false,
        address: false,
        phone: false,
        paypal: false,
    };
    additionalInformationForm = this.formBuilder.group({
        street: [''],
        unit_suite_apt: [''],
        city: [''],
        state: [''],
        zip: [''],
    });

    showBetaFeature = false;

    get isInEditMode() {
        return Object.keys(this.editModeBlocks).some((key) => this.editModeBlocks[key]);
    }
    private unsubscribe: Subject<void> = new Subject();

    constructor(
        public paypalService: PaypalService,
        private profileService: ProfileService,
        private formBuilder: FormBuilder,
        private router: Router,
        @Inject(Window) private window: Window
    ) {
        this.currentUserProfile = profileService.currentProfile;
        if (environment.showBetaFeature) {
            this.showBetaFeature = true;
        }
    }

    ngOnInit(): void {}

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    signOut(): void {
        this.profileService.signOut();
    }

    async updateCurrentProfile() {
        if (this.editModeBlocks.address) {
            const signInInformation = this.additionalInformationForm.getRawValue();
            this.currentUserProfile
                .setAddress1(signInInformation.street)
                .setAddress2(signInInformation.unit_suite_apt)
                .setCity(signInInformation.city)
                .setState(signInInformation.state)
                .setZip(signInInformation.zip);
        }

        const newProfileObject: IProfile = this.currentUserProfile.getEditableObject();
        const updatedProfile = await this.profileService.updateCurrentProfile(newProfileObject);
        this.profileService.currentProfile = new ProfileModel(updatedProfile);

        Object.keys(this.editModeBlocks).forEach((key) => {
            this.editModeBlocks[key] = false;
        });
    }

    editAddress() {
        this.editModeBlocks.address = true;

        this.additionalInformationForm.get('street').setValue(this.currentUserProfile.address1);
        this.additionalInformationForm.get('unit_suite_apt').setValue(this.currentUserProfile.address2);
        this.additionalInformationForm.get('city').setValue(this.currentUserProfile.city);
        this.additionalInformationForm.get('state').setValue(this.currentUserProfile.province);
        this.additionalInformationForm.get('zip').setValue(this.currentUserProfile.zip);

        setTimeout(() => this.getPlaceAutocomplete(), 300);
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
            componentRestrictions: { country: 'US' },
            types: ['address'], // 'establishment' / 'address' / 'geocode'
        });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0];
                if (addressType === 'postal_code') {
                    this.additionalInformationForm.get('zip').setValue(place.address_components[i].long_name);
                } else if (addressType === 'administrative_area_level_1') {
                    this.additionalInformationForm.get('state').setValue(place.address_components[i].long_name);
                } else if (addressType === 'locality') {
                    this.additionalInformationForm.get('city').setValue(place.address_components[i].long_name);
                }
            }
            this.additionalInformationForm.get('street').setValue(place.name);
        });
    }
}
