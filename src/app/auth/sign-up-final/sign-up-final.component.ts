import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ProfileService} from 'src/app/services/profile.service';
import {ProfileModel} from 'src/app/models/profile.model';
import {MessageLevel, MessageType} from '@typings/system.typings';
import {MessagesService} from '@shared/messages/messages.service';

@Component({
    selector: 'app-sign-up-final',
    templateUrl: './sign-up-final.component.html',
    styleUrls: ['./sign-up-final.component.scss'],
})
export class SignUpFinalComponent implements OnInit, AfterViewInit {
    @ViewChild('addresstext') addresstext: any;

    industries = [
        'Beauty and skin',
        'Fashion',
        'Health and wellness',
        'Art',
        'Product/services (i.e. appliance)',
        'Musician/Band',
        'Retail/Shopping',
        'Food',
        'Gaming',
        'Sports/Gym',
        'Baby products',
        'Pets and animals',
        'Other',
    ];
    additionalInformationForm = this.formBuilder.group({
        street: ['', Validators.required],
        unit_suite_apt: [''],
        city: ['', Validators.required],
        name: ['', Validators.required],
        phone_number: [''],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        industries: [[]],
        // payPal: ['', Validators.required],
    });
    options = [];

    constructor(
        public deviceDetectorService: DeviceDetectorService,
        private formBuilder: FormBuilder,
        private auth: AngularFireAuth,
        private router: Router,
        public profileService: ProfileService,
        public messagesService: MessagesService,
    ) {
    }

    ngOnInit(): void {
        if (this.profileService.currentProfile.isSignUpCompleted) {
            this.router.navigate(['/dashboard']);
        }
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    submitForm() {
        if (!this.additionalInformationForm.valid) {
            throw new Error('Form is not valid');
        }
        const signInInformation = this.additionalInformationForm.getRawValue();
        const newProfile = ProfileModel.hydrate(this.profileService.currentProfile);

        if (!newProfile.instagram_id) {
            newProfile.setInstagramId(signInInformation.instagramId);
        }

        if (!newProfile.paypal) {
            newProfile.setPayPal(signInInformation.payPal);
        }

        const profileToUpdate = ProfileModel.hydrate(
            newProfile
                .setName(signInInformation.name)
                .setAddress1(signInInformation.street)
                .setAddress2(signInInformation.unit_suite_apt)
                .setCity(signInInformation.city)
                .setState(signInInformation.state)
                .setZip(signInInformation.zip)
                .setPhoneNumber(signInInformation.phone_number)
                .setIndustries(signInInformation.industries)
        ).getEditableObject();

        this.profileService.completeSignUp(profileToUpdate)
            .then(user => {
                this.profileService.currentProfile = new ProfileModel(user);
                localStorage.setItem('signUpInfo', JSON.stringify(signInInformation));
                this.router.navigate(['/sign-up-industry']);
            })
            .catch(error => {
                this.messagesService.showMessage({
                    type: MessageType.message,
                    showOverlay: true,
                    messageLevel: MessageLevel.error,
                    text: error.message,
                });
            });
    }

    signOut() {
        this.profileService.signOut();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(
            this.addresstext.nativeElement,
            {
                componentRestrictions: {country: 'US'},
                types: ['address'],  // 'establishment' / 'address' / 'geocode'
            }
        );
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
