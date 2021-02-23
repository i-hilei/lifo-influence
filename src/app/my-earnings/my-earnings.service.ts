import { Injectable } from '@angular/core';
import { IProfile } from '@typings/profile.typings';
import { RequestService } from '@services/request.service';

export interface TransactionItem {
    after_account_balance: number;
    after_pending_balance: number;
    amount: number;
    before_account_balance: number;
    before_pending_balance: number;
    id: number;
    influencer_id: string;
    meta_data: {
        campaign_id: string;
    };
    status: 'DONE' | 'PENDING';
    transaction_time: string;
    transaction_type: 'CAMPAIGN_PAY' | 'CASH_OUT' | 'CREDIT_CONVERT';
}

export interface AccountBalance {
    account_balance: number;
    id: Number;
    influencer_id: string;
    paypal_account: string;
    pending_balance: number;
    total_earning: number;
}

@Injectable({
    providedIn: 'root',
})
export class MyEarningsService {
    BASEURL = 'https://campaign-test.lifo.ai';

    constructor(private requestService: RequestService) {}

    getTransactionHistory() {
        return this.requestService.sendRequest<TransactionItem[]>(
            {
                method: 'GET',
                url: '/influencer/transaction_history',
            }
        );
    }

    getAccountBalance() {
        return this.requestService.sendRequest<AccountBalance>(
            {
                method: 'GET',
                url: '/influencer/account_balance',
            }
        );
    }

    cashOut(amount: number) {
        return this.requestService.sendRequest<any>(
            {
                method: 'POST',
                url: '/influencer/cash_out',
                data: { amount },
            }
        );
    }

    updateAccountInfo(userData: IProfile) {
        return this.requestService.sendRequest<IProfile>(
            {
                method: 'PUT',
                url: '/influencer/current-profile',
                data: userData,
            }
        );
    }
}
