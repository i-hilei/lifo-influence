import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from '@nativescript/core';
import { RouterExtensions } from '@nativescript/angular';
import { firebase } from '@nativescript/firebase';

import { isString } from 'lodash';

import { DialogsService } from '@services/dialogs.service';
import { ToastService } from '@services/toast.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.tns.html',
    styleUrls: ['./forgot-password.component.tns.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    email: string = '';

    pwd: string = '';
    confirmPwd: string = '';
    code: string = '';

    step: 'forgot' | 'reset' = 'forgot';
    stepCompleted: boolean = false;

    get passwordValid() {
        return !!(this.pwd.length >= 8 && this.pwd && this.confirmPwd && this.pwd === this.confirmPwd);
    }

    get emailValid() {
        return (this.email || '').indexOf('@') !== -1;
    }

    get isErrorShow() {
        return this.pwd && this.confirmPwd && !this.pwd.startsWith(this.confirmPwd);
    }

    constructor(
        private router: RouterExtensions,
        private route: ActivatedRoute,
        private dialogService: DialogsService,
        private vcRef: ViewContainerRef,
        private page: Page,
        private toast: ToastService
    ) {}

    ngOnInit(): void {
        this.page.actionBarHidden = false;
        this.code = this.route.snapshot.queryParamMap.get('oopCode');
        this.step = this.code ? 'reset' : 'forgot';
    }

    sendEmail() {
        this.dialogService.showLoading(this.vcRef);

        firebase
            .sendPasswordResetEmail(this.email)
            .then(() => (this.stepCompleted = true))
            .catch((error) => {
                console.log(error);
                let text = 'Send email failed, please try again';
                if (isString(error)) {
                    text = error;
                }

                this.toast.show({ text });
            })
            .finally(() => this.dialogService.hiddenLoading());
    }

    resetPassword() {
        this.dialogService.showLoading(this.vcRef);
        setTimeout(() => {
            this.dialogService.hiddenLoading();
            this.stepCompleted = true;
        }, 1000);
    }

    back() {
        this.router.back();
    }
}
