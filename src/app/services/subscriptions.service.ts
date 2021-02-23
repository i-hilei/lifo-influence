import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionsService {
    private closeLoadingSubject = new Subject();

    constructor() {}

    // Loading
    subscribeCloaseLoading(callback: () => void): Subscription {
        return this.closeLoadingSubject.subscribe(callback);
    }
    closeLoadingSubjectUpdate() {
        this.closeLoadingSubject.next();
    }
}
