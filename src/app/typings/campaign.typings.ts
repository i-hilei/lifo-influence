export interface ICampaignDetail {
    content_concept?: string;
    image?: string;
    images?: IImageContent;
    feed_back?: string;
    end_time?: number;
    post_time?: number;
    campaign_id?: string;
    brand_campaign_id?: string;
    time_stamp?: number;
    create_time?: number;
    video?: string;
    brand: string;
    platform?: string;
    product?: IShopifyProduct;
    influencer_id?: string;
    campaign_name: string;
    contacts?: string;
    contact_name?: string;
    contact_email?: string;
    commission_type?: CommissionType;
    commission_dollar?: number;
    commission_percent?: number;
    budget?: number;
    milestones?: string[];
    donts?: string[];
    requirements?: string[];
    shipping_address?: string;
    tracking_number?: string;
    history_id?: string;
    extra_info?: string | ICampaignExtraInfo;
    title?: string;
    description?: string;
    tags?: string[];
    collaborating_influencers?: string[];
    inf_campaign_dict?: {};
    share_url?: string;
    short_share_url?: string;
    tracking_url?: string;
    short_tracking_url?: string;
    is_final?: boolean;
    campaign_type?: string;
    product_name: string;
    product_price: number;
    product_image: string;
    product_url: string;
    unit_cost: number;
    amazon_url?: string;
    number_of_posts: number;
    estimated_total_cost: number;
    campaign_coupon_code?: string;
    coupon_discount_percentage?: number;
    audience_detail?: any;
    status?: string;
    discovery_status?: string;
    has_initial_payment?: boolean;
    offer_detail?: IOfferDetail;
    influencer_info?: ICampaingInfluencerInfo;
    require_application?: boolean;
}

export interface ICampaignExtraInfo {
    type?: string;
    platform?: string;
    post_time?: number;
    contracts: IUploadFile[];
    commissionType?: CommissionType;
}

export enum CommissionType {
    PER_SALES = 'Per Sales Commission',
    PRODUCT_FOR_POST = 'Product For Post',
    ONE_TIME_PAY = 'One Time Commission',
    FIX_PAY_PLUS_PER_SALES = 'Fixed Pay + Per Sales Commission',
}

export interface IImageContent {
    images: IUploadFile[];
    caption: string;
}

export interface IOfferDetail {
    compensation_message: string;
    product_message: string;
    product_image_list: string[];
    content_format?: string;
    post_tags?: string[];
    visual_content_guideline?: string;
    text_post_guideline?: string;
    post_hastags?: string[];
    compensate_method?: string;
    payment_platform?: string;
}

// TODO: check and remove this
export interface OfferDetail {
    compensation_message: string;
    product_message: string;
    product_image_list: string[];
    content_format?: string;
    post_tags?: string[];
    visual_content_guideline?: string;
    text_post_guideline?: string;
    post_hastags?: string[];
    compensate_method?: string;
    payment_platform?: string;
}

export interface IShopifyProduct {
    title: string;
    image: string;
    id: string;
}

export interface IUploadFile {
    url: string;
    path: string;
}

export interface ICampaingInfluencerInfo {
    account_id: string;
    brand_signature_id: string;
    brand_signing_status: string;
    contract_data: object;
    contract_received_time: number;
    email: string;
    inf_contacting_status: string;
    inf_contract_status: string;
    inf_contract_thread: string;
    inf_email: string;
    inf_name: string;
    inf_offer_thread: string;
    inf_phone: string;
    inf_signature_id: string;
    inf_signing_status: string;
    influencer_address1: string;
    influencer_address2: string;
    platform: string;
    profile: object;
    signature_request_id: string;
    offer_received_time: number;
    offer_accept_time: number;
    offer_decline_time: number;
    product_ship_time: number;
    product_received_time: number;
    content_submit_time: number;
    content_approve_time: number;
    post_url: string;
    submit_post_time: number;
    commission_paid_time: number;
    commission_paid_amount: number;
    shipping_info: {
        carrier: string;
        tracking_number: string;
    };
    accept_commission: number;
    accept_bonus: number;
    default_coupon_code: string;
}

export enum OfferStatusClassNames {
    RED = 'red',
    BLUE = 'blue',
    GREEN = 'green',
    ORANGE = 'orange',
}

export interface IOfferStatus {
    status: string;
    colorClass: OfferStatusClassNames;
    isTime: boolean;
    statusMessage: string;
    statusMessageColorClass: OfferStatusClassNames;
}

export interface ShippingInfo {
    carrier: string;
    tracking_details: {
        description: string;
        datetime: string;
        message: string;
    }[];
    tracking_code: string;
    est_delivery_date: string;
}
