export enum ShopStatusEnum {
    NOT_ELIGIBLE = 'NOT_ELIGIBLE',
    APPLIED = 'APPLIED',
    DEV = 'DEV', // It's same with LIVE, but currently the status of some shop is DEV, so add it here.
    LIVE = 'LIVE',
}

export interface ShopDetail {
    id: string;
    instagram_id: string;
    internal: boolean;
    product_list: any[];
    shop_id: string;
    shop_image_url: string;
    shop_name: string;
    shop_url: string;
    show_campaign_post: boolean;
    status: ShopStatusEnum; // Maybe update future
    tiktok_id: string;
    isTutorialShowed: boolean;
    active_bonuses?: {
        commission?: number;
    };
    enable_shoping_cart?: boolean;
}

export interface ProductDetail {}
