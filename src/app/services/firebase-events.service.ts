import {Injectable} from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {ProfileService} from '@services/profile.service';
import {debounceTime, filter, map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, of} from 'rxjs';

export interface CustomFirebaseEvent {
    name: string;
    properties?: object;
}

@Injectable({
    providedIn: 'root'
})
export class FirebaseEventsService {
    isReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private analytics: AngularFireAnalytics,
        private profileService: ProfileService,
    ) {
        profileService.currentProfileSubject
            .pipe(
                switchMap(currentProfile => {
                    this.isReady.next(false);
                    return of(currentProfile);
                }),
                debounceTime(1000)
            )
            .subscribe(currentProfile => {
                if (currentProfile && currentProfile.uid) {
                    this.analytics.setUserId(this.profileService.currentProfile.uid);
                } else {
                    this.analytics.setUserId(null);
                }
                this.isReady.next(true);
            });
    }

    logEvent(event: CustomFirebaseEvent) {
        this.isReady
            .pipe(
                filter(isReady => isReady)
            )
            .subscribe(() => {
                this.analytics.logEvent(event.name, event.properties);
                console.debug('event_sent:', event);
            })
    }
}
