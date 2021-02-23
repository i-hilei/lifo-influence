import { GenericModel } from './generic.model';
import { IReferralHistory, ReferralStatuses } from '@typings/referrals.typings';
import { ILottery } from '@typings/lottery.typings';

export class ReferralHistoryModel extends GenericModel<IReferralHistory> implements IReferralHistory {
    id: string = null;
    instagram_id: string = null;
    invited_at: number = null;
    invited_by: string = null;
    status: ReferralStatuses = null;
    tickets?: number = null;
    extra_tickets?: number = null;
    invited_to_lottery?: string = null;
    lottery?: ILottery = null;
    signed_up_at?: number = null;
    campaign_completed_at?: number = null;

    constructor(profileObj: IReferralHistory = null) {
        super();
        if (profileObj) {
            Object.assign(this, ReferralHistoryModel.hydrate(profileObj));
        }
    }

    static get build() {
        return {
            id: (val) => (!val ? null : String(val)),
            instagram_id: (val) => (!val ? null : String(val)),
            invited_at: (val) => (!val ? null : Number(val)),
            tickets: (val) => (!val ? null : Number(val)),
            extra_tickets: (val) => (!val ? null : Number(val)),
            invited_by: (val) => (!val ? null : String(val)),
            status: (val) => (!val ? null : String(val)),
            invited_to_lottery: (val) => (!val ? null : String(val)),
            signed_up_at: (val) => (!val ? null : Number(val)),
        };
    }

    static hydrate(object: IReferralHistory) {
        return super.hydrate(object, new ReferralHistoryModel());
    }

    get displayTime() {
        if (this.campaign_completed_at) {
            return this.campaign_completed_at;
        }
        if (this.signed_up_at) {
            return this.signed_up_at;
        }
        return this.invited_at;
    }

    get totalTicket() {
        const tickets = this.tickets ? this.tickets : 0;
        const extra_tickets = this.extra_tickets ? this.extra_tickets : 0;
        return tickets + extra_tickets;
    }
}
