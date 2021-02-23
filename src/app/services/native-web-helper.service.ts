import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {IRequestOptions} from '@src/app/typings/system.typings';
import {Observable, throwError} from 'rxjs';
import {catchError, mergeMap, take} from 'rxjs/operators';
import {environment} from '@src/environments/environment';

interface IHttpRequestOptions {
    body?: any;
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    responseType?: 'json';
    reportProgress?: boolean;
    withCredentials?: boolean;
}


@Injectable({
    providedIn: 'root',
})
export class NativeWebHelperService {
    constructor(private auth: AngularFireAuth, private http: HttpClient) {
    }

    private sendRequest$<T>(requestOptions: IRequestOptions): Observable<T> {
        let host = '';
        switch (requestOptions.api) {
            case 'api-shop':
                host = 'https://campaign-shop.lifo.ai';
                break;
            case 'data-shop':
                host = 'https://discover-shop.lifo.ai';
            case 'discover':
                host = environment.discoverApiUrl;
                break;
            default:
                host = environment.apiUrl;
                break;
        }

        return this.auth.idToken.pipe(
            mergeMap((token) => {
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                });

                const url = `${host ?? environment.apiUrl}${requestOptions.url}`;

                const options: IHttpRequestOptions = {
                    headers,
                };

                if (requestOptions.data) {
                    options.body = requestOptions.data;
                }

                return this.http.request<T>(requestOptions.method, url, options);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    sendRequest<T>(requestOptions: IRequestOptions): Promise<T> {
        return this.sendRequest$<T>(requestOptions).pipe(take(1)).toPromise();
    }

    signOut() {
        return this.auth.signOut();
    }

    async getIdToken() {
        return await (await this.auth.currentUser).getIdToken();
    }

    handleError(error: HttpErrorResponse) {
        let error_message = '';
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            error_message = `An error occurred:', ${error.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            error_message = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
        }
        // return an observable with a user-facing error message
        return throwError(error_message);
    }
}
