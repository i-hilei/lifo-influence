import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageLevel, MessageType} from '@typings/system.typings';
import {MessagesService} from '@shared/messages/messages.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    code: string;
    restorePasswordForm: FormGroup;

    constructor(
        private auth: AngularFireAuth,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private messagesService: MessagesService,
    ) {
        this.code = this.activatedRoute.snapshot.queryParamMap.get('oobCode');
        if (this.code) {
            this.restorePasswordForm = this.formBuilder.group({
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', this.confirmValidator],
            });
        } else {
            this.restorePasswordForm = this.formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
            });
        }
    }

    confirmValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return {error: true, required: true};
        } else if (control.value !== this.restorePasswordForm.controls.password.value) {
            return {confirm: true, error: true};
        }
        return {};
    };

    validateConfirmPassword(): void {
        setTimeout(() => this.restorePasswordForm.controls.confirm.updateValueAndValidity());
    }


    ngOnInit(): void {
    }

    resetPassword() {
        if (!this.code) {
            this.auth.sendPasswordResetEmail(this.restorePasswordForm.get('email').value)
                .then(() => {
                    this.messagesService.showMessage({
                        type: MessageType.message,
                        showOverlay: true,
                        messageLevel: MessageLevel.success,
                        text: 'Email sent successfully',
                    });
                    this.router.navigate(['/sign-in']);
                })
                .catch(e => {
                    console.log(e);
                    this.messagesService.showMessage({
                        type: MessageType.message,
                        showOverlay: true,
                        messageLevel: MessageLevel.error,
                        text: e.message,
                    });
                });
        } else {
            if (this.restorePasswordForm.get('password').value !== this.restorePasswordForm.get('confirmPassword').value) {
                return;
            }

            this.auth.confirmPasswordReset(
                this.code,
                this.restorePasswordForm.get('password').value
            )
                .then(resp => {
                    this.messagesService.showMessage({
                        type: MessageType.message,
                        showOverlay: true,
                        messageLevel: MessageLevel.success,
                        text: 'Password reset successfully',
                    });
                    this.router.navigate(['/sign-in']);
                })
                .catch(e => {
                    console.log(e);
                    this.messagesService.showMessage({
                        type: MessageType.message,
                        showOverlay: true,
                        messageLevel: MessageLevel.error,
                        text: e.message,
                    });
                });
        }
    }
}
