import {Injectable} from '@angular/core';
import {RequestService} from '@services/request.service';
import {IOrder} from '@typings/campaign';

@Injectable({
    providedIn: 'root',
})
export class InternalShopService {

    constructor(
        private requestService: RequestService,
    ) {
    }

    getReportData(): Promise<IOrder[]> {
        return this.requestService.sendRequest<{orders: IOrder[]}>({
            method: 'GET',
            url: '/influencer/order_history',
            api: 'discover',
        })
            .then(data => data.orders);
    }
}
