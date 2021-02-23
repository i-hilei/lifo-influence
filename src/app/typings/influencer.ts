export interface InfluencerInfo {
    compensation_message?: string;
    inf_email: string;
    inf_name: string;
    inf_last_name: string;
    inf_phone: string;
    influencer_address1: string;
    influencer_address2: string;
    product_image_list?: string[];
    product_message?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
    commission?: number;
    bonus?: number;
    default_coupon_code?: string;
    variant_id?: number | string;
    variants?: {
        product_id: number;
        variant_id: number;
    }[];
}
