import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { switchMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IPaypalAuthTokenResponse, IPaypalCustomerInfo } from '@typings/paypal.typings';
import { environment } from '@src/environments/environment.prod';
import { Base64Service } from '@services/base64.service';
import { RequestService } from '@services/request.service';

@Injectable({
    providedIn: 'root',
})
export class PaypalService {
    readonly clientId: string = environment.paypal.clientId;
    readonly clientSecret: string = environment.paypal.clientSecret;
    paypalTokenInfo: IPaypalAuthTokenResponse;

    constructor(private http: HttpClient, private base64: Base64Service, private requestService: RequestService) {}

    getPaypalData(code: string): Observable<IPaypalCustomerInfo> {
        return this.getAccessToken(code).pipe(
            switchMap((tokenResponse) => {
                this.paypalTokenInfo = tokenResponse;
                return this.getCustomerInfo();
            })
        );
    }

    getPaypalLink(redirectParamsString = null) {
        const url = `${environment.paypal.websiteUrl}/connect`;
        const flowEntry = 'flowEntry=static';
        const client_id = `client_id=${environment.paypal.clientId}`;
        const scope = 'scope=email%20address';
        const redirect_uri = `redirect_uri=${window?.origin}/connect-paypal`;
        return `${url}?${flowEntry}&${client_id}&${scope}&${redirect_uri}${redirectParamsString ? redirectParamsString : ''}`;
    }

    async getPayPalDataPromise(code: string): Promise<IPaypalCustomerInfo> {
        console.log(code);
        this.paypalTokenInfo = (await this.getAccessToken(code).pipe(take(1)).toPromise()) as IPaypalAuthTokenResponse;
        console.log(this.paypalTokenInfo);
        return this.getCustomerInfo().pipe(take(1)).toPromise() as Promise<IPaypalCustomerInfo>;
    }

    private getAccessToken(code: string): Observable<IPaypalAuthTokenResponse> {
        const url = `${environment.paypal.apiUrl}/v1/oauth2/token`;
        const body = new HttpParams().set('grant_type', 'authorization_code').set('code', code);

        const encodedToken = `Basic ${this.base64.encode(`${this.clientId}:${this.clientSecret}`)}`;
        return this.http.post<IPaypalAuthTokenResponse>(url, body.toString(), {
            headers: new HttpHeaders().set('Authorization', encodedToken),
        });
    }

    private getCustomerInfo(): Observable<IPaypalCustomerInfo> {
        const url = `${environment.paypal.apiUrl}/v1/identity/oauth2/userinfo?schema=paypalv1.1`;
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${this.paypalTokenInfo.access_token}`);
        return this.http.get<IPaypalCustomerInfo>(url, {
            headers,
        });
    }
}
