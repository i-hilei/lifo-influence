import { Injectable } from '@angular/core';
import { Toasty, ToastDuration, ToastPosition, ToastyOptions } from '@triniwiz/nativescript-toasty';
@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor() {}

    show(options?: ToastyOptions): Toasty {
        const realOptions: ToastyOptions = {
            position: ToastPosition.CENTER,
            duration: ToastDuration.SHORT,
            ...options,
        };
        const toast = new Toasty(realOptions);
        toast.show();
        return toast;
    }
}
