import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { ProfileModel } from '@models/profile.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '@services/profile.service';
import { empty, Subject } from 'rxjs';
import { MessagesService } from '@shared/messages/messages.service';
import { MessageLevel, MessageType } from '@typings/system.typings';
import { environment } from '@src/environments/environment';

@Component({
    selector: 'app-connect-instagram',
    templateUrl: './connect-instagram.component.html',
    styleUrls: ['./connect-instagram.component.scss'],
})
export class ConnectInstagramComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    code: string;
    isConnectionInProgress: boolean = false;
    instagramId: string = null;
    name: string = null;
    picture: string = null;

    constructor(
        public deviceDetectorService: DeviceDetectorService,
        public profileService: ProfileService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private messagesService: MessagesService,
        @Inject(Window) private window: Window
    ) {
        if (!environment.showBetaFeature || (this.profileService.currentProfile && this.profileService.currentProfile.instagram_id)) {
            this.router.navigate(['/dashboard']);
        }
        this.code = this.activatedRoute.snapshot.queryParamMap.get('code');
    }

    getInstagramRedirectUrl() {
        return `${this.window.origin}/connect-instagram/`;
    }

    getInstagramLink(): string {
        const clientIdString = 'client_id=349860816224303';
        const responseTypeString = 'response_type=code';
        const scopeString = 'scope=user_profile';
        const redirectUrlString = `redirect_uri=${this.getInstagramRedirectUrl()}`;
        return `https://www.instagram.com/oauth/authorize?${clientIdString}&${responseTypeString}&${redirectUrlString}&${scopeString}`;
    }

    async ngOnInit() {
        if (this.code) {
            this.isConnectionInProgress = true;
            // TODO: Need to test if it works fine now. (request.service.ts was changed)
            this.profileService
                .getUserInstagramData(this.code, this.getInstagramRedirectUrl())
                .pipe(
                    takeUntil(this.unsubscribe),
                    catchError((error) => {
                        this.router.navigate(['/connect-instagram']);
                        this.isConnectionInProgress = false;
                        return empty();
                    }),
                    switchMap((data) => {
                        this.instagramId = data.instagram_id;
                        return this.profileService.checkInstagramId(data.instagram_id).pipe(
                            takeUntil(this.unsubscribe),
                            map((result: any) => {
                                if (result.isInstagramUsed) {
                                    this.router.navigate(['/connect-instagram']);
                                    this.isConnectionInProgress = false;
                                    this.messagesService.showMessage({
                                        showOverlay: true,
                                        type: MessageType.message,
                                        messageLevel: MessageLevel.error,
                                        text: 'This social account is used in another account. Please try with another one.',
                                    });
                                    return null;
                                }
                                return data;
                            })
                        );
                    })
                )
                .subscribe((data: any) => {
                    if (data) {
                        this.name = data.name;
                        this.picture = data.profile_picture;
                    } else {
                        this.profileService.currentProfile.instagram_id = null;
                        this.instagramId = null;
                    }
                    this.isConnectionInProgress = false;
                });
        }
    }

    async nextStep() {
        this.profileService.currentProfile.setInstagramId(this.instagramId).setName(this.name).setProfilePicture(this.picture);
        await this.profileService.updateInstagram({ instagram_id: this.instagramId });
        this.router.navigate(['/sign-up-industry']);
    }

    signOut(): void {
        this.profileService.signOut();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
