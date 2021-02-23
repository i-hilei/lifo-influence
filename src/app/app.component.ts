import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { InstagramGuardService } from '@services/instagram-guard.service';
import { InternalShopGuardGuard } from '@services/internal-shop-guard.guard';
import { Intercom } from 'ng-intercom';

import { ProfileService } from '@services/profile.service';
import { LotteryService } from '@src/app/lottery/lottery.service';
import { ProfileModel } from '@models/profile.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnDestroy {
    title = 'lifo-influencer';
    showLoading = false;
    private unsubscribe: Subject<void> = new Subject();

    constructor(
        private profileService: ProfileService,
        private modalService: ModalService,
        private toast: ToastService,
        private intercom: Intercom,
        private auth: AngularFireAuth,
        private lotteryService: LotteryService,
        private insGuardService: InstagramGuardService,
        private internalShopGuard: InternalShopGuardGuard
    ) {}

    async ngOnInit() {
        this.intercom.boot({
            app_id: 'etq9z8nj',
            // Supports all optional configuration.
            widget: {
                activator: '#intercom',
            },
        });

        this.auth.authState.pipe(takeUntil(this.unsubscribe)).subscribe((fireUser) => {
            if (fireUser) {
                this.profileService.getCurrentProfile().then((profile) => {
                    // This will create conflict with signup
                    if (profile.email) {
                        this.profileService.currentProfile = new ProfileModel(profile);
                        if (!this.profileService.currentProfile.is_instagram_checked) {
                            this.profileService.checkInstagram();
                        }
                        this.lotteryService.getActiveLottery();
                    }
                });
            }
        });

        this.insGuardService.globalLoadingSubject.pipe(takeUntil(this.unsubscribe)).subscribe((status) => {
            this.showLoading = status;
        });

        this.internalShopGuard.globalLoadingSubject.pipe(takeUntil(this.unsubscribe)).subscribe((status) => {
            this.showLoading = status;
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    // If logged user have not instagram_id, show popup
    showInsIdPopUp() {
        const TITLE = 'We missed your instagram id. Fill in below to continue.';
        const ACTION = {
            text: 'Confirm',
            onPress: (ins_id: string) => {
                // handel ins
                let cleanInsId = ins_id.trim();
                // If @xxxxx, remove the '@'
                if (cleanInsId.indexOf('@') >= 0) {
                    cleanInsId = cleanInsId.substring(cleanInsId.indexOf('@') + 1);
                }
                // If user put in full url, only keep the username
                if (cleanInsId.lastIndexOf('/') >= 0) {
                    cleanInsId = cleanInsId.substring(cleanInsId.lastIndexOf('/') + 1);
                }

                cleanInsId = cleanInsId.toLowerCase().trim();
                // handel ins
                this.profileService
                    .updateCurrentProfile({ instagram_id: cleanInsId })
                    .then(() => window.location.reload())
                    .catch(() => this.toast.fail('Set instagram id failed, please try again later'));
            },
        };
        const TYPE = 'default';
        const PLACEHOLDER = ['Instagram Id'];

        this.modalService.prompt(null, TITLE, [ACTION], TYPE, null, PLACEHOLDER);
    }
}
