import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ProfileService} from 'src/app/services/profile.service';
import {NzMessageService} from 'ng-zorro-antd';
import {MessagesService} from '@shared/messages/messages.service';
import {MessageLevel, MessageType} from '@typings/system.typings';

import firebase from 'firebase/app';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    submitting = false;

    signInForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
        rememberMe: [false],
    });

    constructor(
        private formBuilder: FormBuilder,
        private auth: AngularFireAuth,
        private router: Router,
        private profileService: ProfileService,
        private message: NzMessageService,
        private messagesService: MessagesService
    ) {
    }

    ngOnInit(): void {
        this.profileService.currentProfileSubject
            .pipe(
                takeUntil(this.unsubscribe),
                switchMap(async currentProfile => {
                    if (currentProfile) {
                        const signInInformation = this.signInForm.getRawValue();
                        await this.auth.setPersistence(signInInformation.rememberMe ?
                            firebase.auth.Auth.Persistence.LOCAL :
                            firebase.auth.Auth.Persistence.SESSION);
                        return true;
                    }
                    return false;
                })
            )
            .subscribe(result => {
                if (result) {
                    this.router.navigate(['/dashboard']);
                }
            });
    }

    submitForm() {
        if (this.submitting) {
            return;
        }
        if (!this.signInForm.valid) {
            throw new Error('Form is not valid');
        }
        this.submitting = true;
        const signInInformation = this.signInForm.getRawValue();

        this.auth
            .signInWithEmailAndPassword(signInInformation.email, signInInformation.password)
            .catch((error) => {
                console.error(error);
                this.submitting = false;
                this.messagesService.showMessage({
                    type: MessageType.message,
                    showOverlay: true,
                    messageLevel: MessageLevel.error,
                    text: error.message,
                });
            });
    }

    navigate(target) {
        this.router.navigate([target], {queryParamsHandling: 'preserve'});
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
