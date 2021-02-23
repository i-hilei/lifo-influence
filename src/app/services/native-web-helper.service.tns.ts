import { Injectable } from '@angular/core';
import { firebase } from '@nativescript/firebase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { IRequestOptions } from '@src/app/typings/system.typings';
import { take } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NativeWebHelperService {
    constructor(private http: HttpClient) {}

    private sendRequest$<T>(requestOptions: IRequestOptions, host: string = null) {
        return firebase
            .getAuthToken({ forceRefresh: false })
            .then(({ token }) => {
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    }),
                };

                const url = `${host ?? environment.apiUrl}${requestOptions.url}`;
                switch (requestOptions.method) {
                    case 'GET':
                        return this.http.get<T>(url, httpOptions).pipe(take(1)).toPromise();
                    case 'POST':
                        return this.http.post<T>(url, requestOptions.data, httpOptions).pipe(take(1)).toPromise();
                    case 'PUT':
                        return this.http.put<T>(url, requestOptions.data, httpOptions).pipe(take(1)).toPromise();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    sendRequest<T>(requestOptions: IRequestOptions, host?: string) {
        return this.sendRequest$<T>(requestOptions, host);
    }

    signOut() {
        return firebase.logout();
    }

    async getIdToken() {
        const res = await firebase.getAuthToken({
            forceRefresh: false,
        });
        return res.token;
    }

    handleError(error) {
        return throwError('Something bad happened; please try again later.');
    }
}
