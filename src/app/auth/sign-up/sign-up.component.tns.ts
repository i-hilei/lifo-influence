import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { firebase } from '@nativescript/firebase';
import { ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import { Toasty, ToastDuration, ToastPosition } from '@triniwiz/nativescript-toasty';

import { isString } from 'lodash';

import { DialogsService } from '@services/dialogs.service';
import { ProfileService } from '@src/app/services/profile.service';
import { ProfileModel } from '@src/app/models/profile.model';
import { environment } from '@src/environments/environment';
import { GENERAL_ERROR_MESSAGE } from '@shared/const/message';

@Component({
    selector: 'app-sign-up',
    providers: [ModalDialogService],
    templateUrl: './sign-up.component.tns.html',
    styleUrls: ['./sign-up.component.tns.scss'],
})
export class SignUpComponent implements OnInit {
    email: string;
    password: string;
    confirmPassword: string;
    instagramId: string;
    tiktokId: string;

    showBetaFeature = false;

    selectedSignUpType: 'Instagram' | 'TikTok' = 'Instagram';

    get isSocialAccountIdFilled() {
        return this.tiktokId || this.instagramId;
    }

    get toggledSelectedSignUpType() {
        return this.selectedSignUpType === 'Instagram' ? 'TikTok' : 'Instagram';
    }

    get enableSignUpBtn() {
        return Boolean(this.email && this.isPasswordValid && this.isConfirmPwdValid && this.isSocialAccountIdFilled);
    }

    get isPasswordValid() {
        return this.password?.length >= 8;
    }

    get isConfirmPwdValid() {
        return this.password === this.confirmPassword && !!this.confirmPassword;
    }

    constructor(
        private router: RouterExtensions,
        private profileService: ProfileService,
        private dialogService: DialogsService,
        private page: Page,
        public vcRef: ViewContainerRef
    ) {
        if (environment.showBetaFeature) {
            this.showBetaFeature = true;
        }

        this.page.actionBarHidden = true;
        this.page.actionBar.backgroundColor = '#fff';
    }

    async ngOnInit() {}

    toggleSignUpType() {
        this.tiktokId = '';
        this.instagramId = '';
        this.selectedSignUpType === 'Instagram' ? (this.selectedSignUpType = 'TikTok') : (this.selectedSignUpType = 'Instagram');
    }

    showTermsOfUseModal() {
        this.router.navigate(['terms-of-use']);
    }

    submitForm(): void {
        this.dialogService.showLoading(this.vcRef);

        if (this.selectedSignUpType === 'Instagram') {
            // An Instagram username is limited to 30 characters and must contain only letters, numbers, periods, and underscores.
            let cleanInsId = (this.instagramId || '').trim();
            // If @xxxxx, remove the '@'
            if (cleanInsId.indexOf('@') >= 0) {
                cleanInsId = cleanInsId.substring(cleanInsId.indexOf('@') + 1);
            }
            // If user put in full url, only keep the username
            if (cleanInsId.lastIndexOf('/') >= 0) {
                cleanInsId = cleanInsId.substring(cleanInsId.lastIndexOf('/') + 1);
            }
            cleanInsId = cleanInsId.toLowerCase().trim();
            this.profileService.currentProfile = new ProfileModel().setEmail(this.email).setInstagramId(cleanInsId);
        }

        if (this.selectedSignUpType === 'TikTok') {
            // An Instagram username is limited to 30 characters and must contain only letters, numbers, periods, and underscores.
            let cleanTiktokId = this.tiktokId.toLowerCase().trim();
            // If @xxxxx, remove the '@'
            if (cleanTiktokId.indexOf('@') >= 0) {
                cleanTiktokId = cleanTiktokId.substring(cleanTiktokId.indexOf('@') + 1);
            }
            this.profileService.currentProfile = new ProfileModel().setEmail(this.email).setTiktokId(cleanTiktokId);
        }

        // Create
        firebase
            .createUser({
                email: this.email.toLocaleLowerCase(),
                password: this.password,
            })
            .then((res) => {
                this.profileService.currentProfile.setUserId(res.uid);
                return this.profileService.createUser(ProfileModel.hydrate(this.profileService.currentProfile));
            })
            .then((user) => {
                this.profileService.currentProfile = new ProfileModel(user);
                this.dialogService.hiddenLoading();
                setTimeout(() => {
                    this.router.navigate(['auth/sign-up-industry']);
                }, 0);
            })
            .catch((err) => {
                console.log(err);
                const toast = new Toasty({
                    text: isString(err) ? err : GENERAL_ERROR_MESSAGE,
                    duration: ToastDuration.LONG,
                    position: ToastPosition.TOP,
                });
                toast.show();
                this.dialogService.hiddenLoading();
            });
    }

    goSignInPage() {
        this.router.navigate(['auth/sign-in'], { clearHistory: true });
    }
}
