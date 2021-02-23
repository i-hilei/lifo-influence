import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { firebase } from '@nativescript/firebase';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@src/app/native-helper/router-helper/router';
import { ProfileService } from '@src/app/services/profile.service';
import { ProfileModel } from '@src/app/models/profile.model';
import { environment } from '@src/environments/environment';
import { ModalDialogService } from '@nativescript/angular';
import { alert } from '@nativescript/core';

@Component({
    selector: 'app-sign-up',
    providers: [ModalDialogService],
    templateUrl: './sign-up-tiktok.component.html',
    styleUrls: ['./sign-up-tiktok.component.scss'],
})
export class SignUpComponent implements OnInit {
    email: string;
    password: string;
    confirmPassword: string;
    instagramId: string;

    termsOfUseStatus = false;
    showTermsOfUse = false;
    submitting = false;
    showBetaFeature = false;

    queryParams: { campaignId: string; accountId: string };
    invitedByUid: string;
    invitedByName: string;

    get enableSignUpBtn() {
        return Boolean(this.email && this.isPasswordValid && this.isConfirmPwdValid && this.termsOfUseStatus);
    }

    get isPasswordValid() {
        return this.password?.length >= 8;
    }

    get isConfirmPwdValid() {
        return this.password === this.confirmPassword && !!this.confirmPassword;
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private vcRef: ViewContainerRef,
        private profileService: ProfileService,
        private modalService: ModalDialogService
    ) {
        if (environment.showBetaFeature) {
            this.showBetaFeature = true;
        }

        this.invitedByUid = this.activatedRoute.snapshot.queryParamMap.get('invited_by');
    }

    async ngOnInit() {
        if (this.invitedByUid) {
            const profile = await this.profileService.getInfluencerByUid(this.invitedByUid);
            this.invitedByName = profile.name;
        }

        this.setQueryParams();
    }

    switchTermsOfUse(val: boolean) {
        this.termsOfUseStatus = val;
    }

    setQueryParams() {
        this.queryParams = {
            campaignId: this.activatedRoute.snapshot.queryParamMap.get('campaignId'),
            accountId: this.activatedRoute.snapshot.queryParamMap.get('accountId'),
        };
    }

    submitForm(): void {
        this.submitting = true;

        if (!this.showBetaFeature) {
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
        } else {
            this.profileService.currentProfile = new ProfileModel().setEmail(this.email);
            if (this.invitedByUid) {
                this.profileService.currentProfile.setInvitedBy(this.invitedByUid);
            }
        }

        // Create
        firebase
            .createUser({
                email: this.email,
                password: this.password,
            })
            .then((res) => {
                this.profileService.currentProfile.setUserId(res.uid);
                return this.profileService.createUser(ProfileModel.hydrate(this.profileService.currentProfile));
            })
            .then((user) => {
                this.profileService.currentProfile = new ProfileModel(user);
                this.submitting = false;
                this.router.navigate(['/sign-up-industry'], {
                    queryParams: this.queryParams.campaignId ? { campaignId: this.queryParams.campaignId } : {},
                });
            })
            .catch((err) => {
                const options = {
                    title: 'Warning',
                    message: err.message || err,
                    okButtonText: 'OK',
                };
                alert(options);
            })
            .finally(() => {
                this.submitting = false;
            });
    }
}
