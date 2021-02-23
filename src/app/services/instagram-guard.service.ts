import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Router } from '@src/app/native-helper/router-helper/router';
import { ProfileService } from '@services/profile.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '@src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class InstagramGuardService implements CanActivate {
    // Control global loading show or hidden
    globalLoadingSubject = new BehaviorSubject(false);

    constructor(private profileService: ProfileService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        this.globalLoadingSubject.next(true);
        return this.profileService.currentProfileSubject.pipe(
            filter((currentProfile) => !!currentProfile),
            map((currentProfile) => {
                this.globalLoadingSubject.next(false);

                if ((currentProfile && (currentProfile.instagram_id || currentProfile.tiktok_id)) || !environment.showBetaFeature) {
                    return true;
                }
                this.router.navigate(['/connect-instagram']);
                return false;
            })
        );
    }
}
