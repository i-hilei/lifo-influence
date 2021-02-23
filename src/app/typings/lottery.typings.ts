export enum LotteryStatus {
    raffle= 'raffle',
    winner_to_be_announced= 'winner_to_be_announced',
    winner_announced= 'winner_announced',
    closed= 'closed',
}

export enum LotteryType {
    invitation= 'invitation',
    drawing= 'drawing',
    link= 'link',
}

export interface ILottery {
    id: string;
    status: LotteryStatus;
    type: LotteryType;
    end_date: number;
    img_src: string;
    short_description: string;
    description: ILotteryDescription;
}

export interface ILotteryDescription {
    who_eligible: string;
    get_more_tickets: string;
    full_message: string;
}

export interface IRaffleHistory {
    amount: number;
    id: number;
    influencer_id: string;
    meta_data: {
        raffle_id: {
            raffle_id: string;
        };
    };
    transaction_time: string;
}
