import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { firebase } from '@nativescript/firebase';
import { ProfileService } from '@services/profile.service';
import { ProfileModel } from '@models/profile.model';
import { Page, AlertOptions } from '@nativescript/core';
import { RouterExtensions } from '@nativescript/angular';
import { ToastService } from '@services/toast.service';
import { DialogsService } from '@services/dialogs.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.tns.html',
    styleUrls: ['./sign-in.component.tns.scss'],
})
export class SignInComponent implements OnInit {
    email: string;
    password: string;

    signing: boolean = false;

    get enableSignIn() {
        return Boolean(this.email && this.password);
    }

    constructor(
        private router: RouterExtensions,
        private profileService: ProfileService,
        private page: Page,
        private toastService: ToastService,
        private dialogService: DialogsService,
        public vcr: ViewContainerRef
    ) {
        this.page.actionBarHidden = true;
        this.page.actionBar.backgroundColor = '#fff';
    }

    ngOnInit(): void {}

    submitForm() {
        this.signing = true;
        firebase
            .login({
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: this.email,
                    password: this.password,
                },
            })
            .then(() => this.profileService.getCurrentProfile())
            .then((result) => {
                this.profileService.currentProfile = new ProfileModel(result);
                if (!this.profileService.currentProfile.is_instagram_checked) {
                    this.profileService.checkInstagram();
                }
                this.router.navigate(['main-page', { outlets: { discover: 'discover' } }], { clearHistory: true });
            })
            .catch((err) => {
                this.signing = false;
                console.log(err);
            });
    }

    signInWithApple() {
        firebase
            .login({
                type: firebase.LoginType.APPLE,
            })
            .then((res) => {
                const options: AlertOptions = {
                    message: JSON.stringify(res),
                    okButtonText: 'Ok',
                };
                alert(options);
            })
            .catch((err) => {
                const options: AlertOptions = {
                    message: JSON.stringify(err),
                    okButtonText: 'Ok',
                };
                alert(options);
            });
    }

    goRestorePwd() {
        this.router.navigate(['auth/restore-password']);
    }

    goSignUpPage() {
        this.router.navigate(['auth/sign-up'], { clearHistory: true });
    }
}
