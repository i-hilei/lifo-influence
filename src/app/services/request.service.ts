import { Injectable } from '@angular/core';
import { IRequestOptions } from '@src/app/typings/system.typings';
import { NativeWebHelperService } from '@services/native-web-helper.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    constructor(private nativeWebHelper: NativeWebHelperService) {}

    sendRequest<T>(requestOptions: IRequestOptions): Promise<T | any> {
        return this.nativeWebHelper.sendRequest<T>(requestOptions);
    }

    sendRequest$<T>(requestOptions: IRequestOptions): Observable<T | any> {
        return new Observable((subscribe) => {
            this.nativeWebHelper
                .sendRequest<T>(requestOptions)
                .then((res) => {
                    subscribe.next(res);
                    subscribe.complete();
                })
                .catch((err) => {
                    subscribe.error(err);
                });
        });
    }
}
