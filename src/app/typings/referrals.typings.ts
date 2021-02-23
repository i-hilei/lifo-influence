export enum ReferralStatuses {
    invited = 'invited',
    signed_up = 'signed_up',
    campaign_completed = 'campaign_completed',
}

export interface IReferralHistory {
    id: string;
    instagram_id: string;
    invited_at: number;
    invited_by: string;
    status: ReferralStatuses;
    tickets?: number;
    extra_tickets?: number;
    invited_to_lottery?: string;
    signed_up_at?: number;
    campaign_completed_at?: number;
}
