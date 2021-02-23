export interface IProfile {
    email?: string;
    uid?: string;
    name?: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    phone_number?: string;
    instagram_id?: string;
    tiktok_id?: string;
    paypal?: string;
    is_instagram_checked?: boolean;
    industries?: string[];
    platforms?: string[];
    content_types?: string[];
    profile_picture?: string;
    invited_by?: string;
    invited_to_lottery?: string;
    is_shop_notification_showed?: boolean;
}

export interface IInstagramNotableUser {
    engagements: number;
    followers: number;
    fullname: string;
    picture: string;
    url: string;
    username: string;
    email: string;
    invite?: boolean;
    is_registered?: boolean;
    invited?: boolean;
}

export interface IInvitation {
    code: string;
    influencer_id: string;
    lottery_id: string;
}

export interface IShopActivity {
    unique_visitors: number;
    total_visits: number;
}
