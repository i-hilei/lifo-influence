export interface ICampaignDetailConfiguration {
    cpm: string;
    delivery_deadline: string;
    fast_deliver_window: string;
    fast_delivery_bonus: string;
    max_base_commission: string;
    offer_expiration_time: string;
}

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
    video?: string;
    brand: string;
    platform?: string;
    product?: IShopifyProduct;
    influencer_id?: string;
    campaign_name: string;
    contacts?: string;
    contact_name?: string;
    contact_email?: string;
    content?: {
        images: { path: string; url: string }[];
        videos: { path: string; url: string }[];
    };
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
    invitation?: ICampaignInvitation;
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
    offer_detail?: IOfferDetail;
    configuration: ICampaignDetailConfiguration;
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

export interface IShopifyProduct {
    title: string;
    image: string;
    id: string;
}

export interface IUploadFile {
    url: string;
    path: string;
}

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
    product_list?: IProduct[];
}

export interface ICampaignInvitation {
    bonus: number;
    bonus_time: number;
    bonus_dollar: number;
    brand_campaign_id: string;
    commission: number;
    inv_deadline: number;
    max_time: number;
    status: string;
    campaign_status: CampaignStatus;
    default_coupon_code: string;
    additional_commission: string;
}

enum CampaignStatus {
    open = 'Open',
    closed = 'Closed',
}

export interface IProduct {
    admin_graphql_api_id: string;
    body_html: string;
    created_at: string;
    handle: string;
    id: number;
    image: IProductImage;
    images: IProductImage[];
    options: IProductOptions[];
    product_type: string;
    published_at: string;
    published_scope: string;
    tags: string;
    template_suffix: string;
    title: string;
    updated_at: string;
    variants: IProductVariant[];
    vendor: string;
}

export interface IProductVariant {
    admin_graphql_api_id: string;
    barcode: string;
    compare_at_price: string;
    created_at: string;
    fulfillment_service: string;
    grams: number;
    id: number;
    image_id: number;
    inventory_item_id: number;
    inventory_management: string;
    inventory_policy: string;
    inventory_quantity: number;
    old_inventory_quantity: number;
    option1: string;
    option2: string;
    option3: string;
    position: number;
    price: string;
    product_id: number;
    requires_shipping: boolean;
    sku: string;
    tax_code: string;
    taxable: boolean;
    title: string;
    updated_at: string;
    weight: number;
    weight_unit: string;
}

export interface IProductOptions {
    id: number;
    name: string;
    position: number;
    product_id: number;
    values: string[];
}

export interface IProductImage {
    admin_graphql_api_id: string;
    alt: any;
    created_at: string;
    height: number;
    id: number;
    position: number;
    product_id: number;
    src: string;
    updated_at: string;
    variant_ids: string[];
    width: number;
}

export interface IOrder {
    commission: number;
    price: number;
    product_id: number;
    quantity: number;
    shopifyProduct?: any;
}
