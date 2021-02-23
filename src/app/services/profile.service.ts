import { InfluencerInfo } from '@typings/influencer';
import { Injectable } from '@angular/core';
import { ProfileModel } from '@src/app/models/profile.model';
import { IInvitation, IProfile, IShopActivity } from '@src/app/typings/profile.typings';
import { Router } from '@angular/router';
import { RequestService } from '@services/request.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { IInstagramFullData } from '@typings/instagram.typings';
import { NativeWebHelperService } from '@services/native-web-helper.service';
import { LotteryService } from '@src/app/lottery/lottery.service';
import { ShopService } from '@src/app/shop/shop.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    currentProfileSubject = new BehaviorSubject<ProfileModel>(this.currentProfile);
    private current_profile: ProfileModel;

    constructor(
        protected requestService: RequestService,
        protected router: Router,
        private http: HttpClient,
        private nativeWebHelper: NativeWebHelperService,
        private lotteryService: LotteryService,
        private shopService: ShopService
    ) {}

    get currentProfile() {
        return this.current_profile;
    }

    set currentProfile(newVal: ProfileModel) {
        this.current_profile = newVal;
        this.currentProfileSubject.next(newVal);
    }

    get instagramRequestOptions() {
        return {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        };
    }

    getUserInstagramData(code: string, redirectUrl: string): Observable<IProfile> {
        return this.getInstagramAccessToken(code, redirectUrl).pipe(
            switchMap((res) => this.getInstagramData(res['access_token'])),
            switchMap((userData) => {
                return this.getInstagramFullDataById(userData['username']);
            })
        );
    }

    private getInstagramAccessToken(code: string, redirectUrl) {
        const url = 'https://api.instagram.com/oauth/access_token';
        const body = new HttpParams()
            .set('client_id', '349860816224303')
            .set('client_secret', '0660e8d293ee20334f383cb067773956')
            .set('code', code)
            .set('grant_type', 'authorization_code')
            .set('redirect_uri', redirectUrl);
        return this.http.post(url, body.toString(), this.instagramRequestOptions);
    }

    private getInstagramData(accessToken: string) {
        const exchangeUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`;
        return this.http.get(exchangeUrl, this.instagramRequestOptions);
    }

    private getInstagramFullDataById(instagramId: string): Observable<IProfile> {
        const dataToReturn: IProfile = {
            instagram_id: instagramId,
            name: null,
            profile_picture: null,
        };
        return this.http.get(`https://www.instagram.com/${instagramId}/?__a=1`).pipe(
            switchMap((data: IInstagramFullData) => {
                if (data && data['graphql'] && data['graphql']['user']) {
                    dataToReturn.name = data['graphql']['user'].full_name;
                    dataToReturn.profile_picture = data['graphql']['user'].profile_pic_url_hd;
                }
                return of(dataToReturn);
            }),
            catchError((error) => {
                console.error(error);
                return of(dataToReturn);
            })
        );
    }

    getInfluencerByUid(uid: string) {
        return this.requestService.sendRequest<{ name: string }>({
            url: `/shared/influencer-profile/${uid}`,
            method: 'GET',
        });
    }

    checkInstagramId(instagram_id: string) {
        return this.requestService.sendRequest$<{ result: boolean; isInstagramUsed: boolean }>({
            url: `/shared/check-instagram/${instagram_id}`,
            method: 'GET',
        });
    }

    getCurrentProfile(): Promise<IProfile> {
        return this.requestService.sendRequest<IProfile>({
            method: 'GET',
            url: '/influencer/current-profile',
        });
    }

    createUser(userData: IProfile): Promise<IProfile> {
        return this.requestService.sendRequest({
            method: 'POST',
            url: '/influencer/sign-up/influencer',
            data: userData,
        });
    }

    completeSignUp(userData: IProfile): Promise<IProfile> {
        return this.requestService.sendRequest({
            method: 'PUT',
            url: '/influencer/complete-sign-up',
            data: userData,
        });
    }

    updateCurrentProfile(userData: IProfile): Promise<IProfile> {
        return this.requestService.sendRequest({
            method: 'PUT',
            url: '/influencer/current-profile',
            data: userData,
        });
    }

    updateInstagram(userData: { instagram_id: string }): Promise<IProfile> {
        return this.requestService.sendRequest({
            method: 'PUT',
            url: '/influencer/instagram',
            data: userData,
        });
    }

    checkInstagram() {
        return this.requestService.sendRequest({
            method: 'GET',
            url: '/influencer/check-instagram',
        });
    }

    getInvitation(code: string): Promise<IInvitation> {
        return this.requestService.sendRequest({
            method: 'GET',
            url: `/shared/invitation/${code}`,
        });
    }

    getShopActivity(): Promise<IShopActivity> {
        return this.requestService.sendRequest({
            method: 'GET',
            url: '/influencer/shop-activity',
        });
    }

    updateShopDetails(data): Promise<any> {
        return this.requestService.sendRequest({
            method: 'PUT',
            url: '/influencer/shop',
            data,
        });
    }

    async signOut() {
        await this.nativeWebHelper.signOut();
        const id = setTimeout(() => {
            clearTimeout(id);
            this.shopService.clearAllCachedShopData();
            this.currentProfile = undefined;
            this.lotteryService.userTotalTickets = 0;
            this.lotteryService.userAvailableTickets = 0;
            this.router.navigate(['/sign-in']);
        }, 500);
    }

    updateCurrentProfileWithInluencerInfo(inf: InfluencerInfo) {
        const newProfile = new ProfileModel(this.currentProfile);
        newProfile.setName(inf.inf_name);
        newProfile.setLastName(inf.inf_last_name);
        newProfile.setAddress1(inf.influencer_address1);
        newProfile.setAddress2(inf.influencer_address2);
        newProfile.setCity(inf.city);
        newProfile.setState(inf.province);
        newProfile.setZip(inf.zip);
        newProfile.setPhoneNumber(inf.inf_phone);
        const profileToUpdate = newProfile.getEditableObject();
        return this.updateCurrentProfile(profileToUpdate).then(() => {
            this.currentProfile = newProfile;
            return Promise.resolve();
        });
    }
}
