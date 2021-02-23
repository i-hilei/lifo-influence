import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { alert, AlertOptions } from '@nativescript/core';

import { PaypalService } from '@services/paypal.service';
import { IPaypalCustomerInfo } from '@typings/paypal.typings';
import { ProfileService } from '@services/profile.service';
import { PaypalCustomerAddress, ProfileModel } from '@models/profile.model';
import { IProfile } from '@typings/profile.typings';

export enum ConnectType {
    paypal = 'paypal',
    instagram = 'instagram',
    tiktok = 'tiktok',
}

@Injectable({
    providedIn: 'root',
})
export class BackAppHandlersService {
    constructor(private paypalService: PaypalService, private router: RouterExtensions, private profileService: ProfileService) {}

    connectPaypalHandler(code: string) {
        this.paypalService
            .getPayPalDataPromise(code)
            .then((res: IPaypalCustomerInfo) => {
                if (res !== null) {
                    const primaryEmail = res.emails.find((email) => email.primary);
                    if (primaryEmail) {
                        this.profileService.currentProfile
                            .setPayPal(primaryEmail.value)
                            .setPaypalAddress(new PaypalCustomerAddress(res.address));
                        const newProfileObject: IProfile = this.profileService.currentProfile.getEditableObject();
                        return this.profileService.updateCurrentProfile(newProfileObject);
                    }
                }
                return Promise.resolve(null);
            })
            .then((updatedProfile: IProfile) => {
                if (updatedProfile !== null) {
                    this.profileService.currentProfile = new ProfileModel(updatedProfile);
                }
            })
            .catch((err) => {
                const options: AlertOptions = {
                    message: 'Oops, something went wrong. Please try again or contact us.',
                    okButtonText: 'OK',
                };
                alert(options);
            });
    }

    connectInsagramHandler() {}

    conectTiktokHandler() {}
}
