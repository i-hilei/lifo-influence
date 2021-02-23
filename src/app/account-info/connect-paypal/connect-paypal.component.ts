import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PaypalService} from '@services/paypal.service';
import {of, Subject} from 'rxjs';
import {catchError, switchMap, takeUntil} from 'rxjs/operators';
import {IPaypalCustomerInfo} from '@typings/paypal.typings';
import {ProfileService} from '@services/profile.service';
import {IProfile} from '@typings/profile.typings';
import {PaypalCustomerAddress, ProfileModel} from '@models/profile.model';

@Component({
    selector: 'app-connect-paypal',
    template: `
        <section class="connect-paypal">
            <div class="loading">
                <i nz-icon nzTheme="outline" nzType="loading"></i>
            </div>
            <label>Connecting Paypal account...</label>
        </section>
    `,
    styles: [`
        .connect-paypal {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .connect-paypal > .loading {
            width: 100%;
            height: 100px;
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40px;
        }

    `],
})
export class ConnectPaypalComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    code: string;
    page: string = 'account-info';

    constructor(
        private activatedRoute: ActivatedRoute,
        private paypalService: PaypalService,
        private router: Router,
        private profileService: ProfileService,
    ) {
    }

    ngOnInit(): void {
        this.code = this.activatedRoute.snapshot.queryParamMap.get('code');
        if (this.activatedRoute.snapshot.queryParamMap.get('page')) {
            this.page = this.activatedRoute.snapshot.queryParamMap.get('page');
        }
        if (!this.code) {
            this.router.navigate([this.page], {
                state: {
                    messageType: 'error',
                    message: 'Paypal was not connected'
                }
            });
        }

        this.paypalService.getPaypalData(this.code)
            .pipe(
                takeUntil(this.unsubscribe),
                catchError(error => {
                    console.error(error);
                    this.router.navigate([this.page, {message: error.message}]);
                    return of(null);
                }),
                switchMap((res: IPaypalCustomerInfo | null) => {
                    if (res !== null) {
                        const primaryEmail = res.emails.find(email => email.primary);
                        if (primaryEmail) {
                            this.profileService.currentProfile.setPayPal(primaryEmail.value)
                                .setPaypalAddress(
                                    new PaypalCustomerAddress(res.address)
                                );
                            const newProfileObject: IProfile = this.profileService.currentProfile.getEditableObject();
                            return this.profileService.updateCurrentProfile(newProfileObject);
                        }
                    }
                    return of(null);
                })
            )
            .subscribe((updatedProfile: IProfile | null) => {
                if (updatedProfile !== null) {
                    this.profileService.currentProfile = new ProfileModel(updatedProfile);
                    this.router.navigate([this.page], {
                        state: {
                            messageType: 'success',
                            message: 'Paypal connected successfully. Please, request payment again'
                        }
                    });
                }
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
