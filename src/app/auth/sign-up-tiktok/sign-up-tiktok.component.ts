import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileModel } from 'src/app/models/profile.model';
import { ProfileService } from 'src/app/services/profile.service';
import { ModalComponent } from 'ng-zorro-antd-mobile';
import { MessageLevel, MessageType } from '@typings/system.typings';
import { MessagesService } from '@shared/messages/messages.service';
import { environment } from '@src/environments/environment';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up-tiktok.component.html',
    styleUrls: ['./sign-up-tiktok.component.scss'],
})
export class SignUpTiktokComponent implements OnInit {
    signUpForm: FormGroup;
    modalShow = false;
    code: string;
    @ViewChild(ModalComponent) modal: ModalComponent;

    matcher = new MyErrorStateMatcher();
    submitting = false;

    showBetaFeature = false;
    queryParams: { campaignId: string; accountId: string };

    invitedByUid: string;
    lotteryId: string;
    source: string = 'organic';
    invitedByName: string;

    get disableSignUpBtn() {
        return !this.signUpForm.get('agreeWithTermsOfService').value || this.submitting;
    }

    constructor(
        public deviceDetectorService: DeviceDetectorService,
        private formBuilder: FormBuilder,
        private auth: AngularFireAuth,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private profileService: ProfileService,
        private messagesService: MessagesService,
        public afAuth: AngularFireAuth
    ) {
        if (environment.showBetaFeature) {
            this.showBetaFeature = true;
        }

        this.invitedByUid = this.activatedRoute.snapshot.queryParamMap.get('invited_by');
        this.lotteryId = this.activatedRoute.snapshot.queryParamMap.get('lotteryId');
        this.source = this.activatedRoute.snapshot.queryParamMap.get('source');
        this.code = this.activatedRoute.snapshot.queryParamMap.get('code');

        if (!this.source && (this.invitedByUid || this.code)) {
            this.source = 'invitation_link';
        }
        this.signUpForm = this.formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: [''],
                tiktok_id: ['', [Validators.required]],
                agreeWithTermsOfService: [false],
            },
            { validator: this.checkPasswords }
        );
    }

    async ngOnInit() {
        if (this.code) {
            const invitation = await this.profileService.getInvitation(this.code);
            this.invitedByUid = invitation.influencer_id;
            this.lotteryId = invitation.lottery_id;
        }
        if (this.invitedByUid) {
            const profile = await this.profileService.getInfluencerByUid(this.invitedByUid);
            this.invitedByName = profile.name;
        }

        this.signUpForm.setValidators(this.checkPasswords);
        this.setQueryParams();
    }

    setQueryParams() {
        this.queryParams = {
            campaignId: this.activatedRoute.snapshot.queryParamMap.get('campaignId'),
            accountId: this.activatedRoute.snapshot.queryParamMap.get('accountId'),
        };
    }

    checkPasswords(group: FormGroup) {
        const pass = group.get('password').value;
        const confirmPass = group.get('confirmPassword').value;

        return pass === confirmPass ? null : { notSame: true };
    }

    confirmValidator(control: FormControl): { [s: string]: boolean } {
        let confirm = false;
        let required = false;
        if (!control.value) {
            required = true;
            return { confirm, required };
        }
        if (!this.signUpForm || control.value !== this.signUpForm.controls.password.value) {
            confirm = true;
        }
        return { confirm, required };
    }

    openTerm(elem: ModalComponent): void {
        event.stopPropagation();
        elem.option.visible = true;
    }

    submitForm(): void {
        if (!this.showBetaFeature) {
            this.signUpForm.updateValueAndValidity();
        }

        const newInfluencer = this.signUpForm.getRawValue();

        if (this.disableSignUpBtn) {
            return;
        }

        if (!this.signUpForm.valid) {
            for (const key in this.signUpForm.controls) {
                if (this.signUpForm.controls.hasOwnProperty(key)) {
                    this.signUpForm.controls[key].markAsDirty();
                    this.signUpForm.controls[key].updateValueAndValidity();
                }
            }
            this.signUpForm.updateValueAndValidity();
            return;
        }
        this.submitting = true;

        // An Instagram username is limited to 30 characters and must contain only letters, numbers, periods, and underscores.
        let cleanTiktokId = newInfluencer.tiktok_id.toLowerCase().trim();
        // If @xxxxx, remove the '@'
        if (cleanTiktokId.indexOf('@') >= 0) {
            cleanTiktokId = cleanTiktokId.substring(cleanTiktokId.indexOf('@') + 1);
        }
        this.profileService.currentProfile = new ProfileModel().setEmail(newInfluencer.email).setTiktokId(cleanTiktokId);
        // Referral to live
        if (this.invitedByUid) {
            this.profileService.currentProfile
                .setInvitedBy(this.invitedByUid);
        }

        this.profileService.currentProfile
            .setSource(this.source)
            .setLottery(this.lotteryId);
        this.auth
            .createUserWithEmailAndPassword(newInfluencer.email, newInfluencer.password)
            .then((resp) => {
                // make sure the user is created
                return new Promise<any>((resolve, reject) => {
                    const id = setTimeout(() => {
                      clearTimeout(id);
                      resolve(this.auth.currentUser);
                    }, 1500);
                });
            })
            .then((user) => {
                this.profileService.currentProfile.setUserId(user.uid);
                return this.profileService.createUser(ProfileModel.hydrate(this.profileService.currentProfile));
            })
            .then(async (user) => {
                this.profileService.currentProfile = new ProfileModel(user);
                this.submitting = false;
                this.router.navigate(['/sign-up-industry'], {
                    queryParams: this.queryParams.campaignId ? { campaignId: this.queryParams.campaignId } : {},
                });
            })
            .catch((e) => {
                console.error(e);
                this.messagesService.showMessage({
                    type: MessageType.message,
                    showOverlay: true,
                    messageLevel: MessageLevel.error,
                    text: e.message,
                });
                this.submitting = false;
            });
    }

    navigate(target) {
        this.router.navigate([target], { queryParamsHandling: 'preserve' });
    }
}

export class MyErrorStateMatcher implements MyErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return invalidCtrl || invalidParent;
    }
}
