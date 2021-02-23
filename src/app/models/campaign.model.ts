import {
    CommissionType,
    ICampaignDetail,
    ICampaignExtraInfo,
    ICampaingInfluencerInfo,
    IImageContent,
    IOfferDetail,
    IOfferStatus,
    IShopifyProduct,
    IUploadFile,
    OfferStatusClassNames,
} from '@src/app/typings/campaign.typings';
import { GenericModel } from '@src/app/models/generic.model';
import * as dayjs from 'dayjs';

export enum CampaignSteps {
    shipping = 'shipping',
    initial_commission_paid = 'initial_commission_paid',
    try_out_product = 'try_out_prodcut',
    draft_pending = 'draft_pending',
    draft_under_review = 'draft_under_review',
    draft_reviewed = 'draft_reviewed',
    pending_commission = 'pending_commission',
    complete = 'complete',
}

export enum SocialMediaPlatform {
    instagram = 'instagram',
    tiktok = 'tiktok',
}

import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';

import { ICampaignInvitation, ICampaignDetailConfiguration } from '../typings/campaign';
dayjs.extend(advancedFormat);
dayjs.extend(duration);

export class CampaignModel extends GenericModel<ICampaignDetail> implements ICampaignDetail {
    content_concept?: string = null;
    image?: string = null;
    images?: ImageContent = null;
    feed_back?: string = null;
    end_time?: number = null;
    post_time?: number = null;
    start_post_time?: number = null;
    campaign_id?: string = null;
    brand_campaign_id?: string = null;
    time_stamp?: number = null;
    create_time?: number = null;
    video?: string = null;
    brand: string = null;
    platform?: SocialMediaPlatform = null;
    product?: ShopifyProduct = null;
    influencer_id?: string = null;
    campaign_name: string = null;
    contacts?: string = null;
    contact_name?: string = null;
    contact_email?: string = null;
    commission_type?: CommissionType = null;
    commission_dollar?: number = null;
    commission_percent?: number = null;
    budget?: number = null;
    milestones?: string[] = [];
    donts?: string[] = [];
    requirements?: string[] = [];
    shipping_address?: string = null;
    tracking_number?: string = null;
    history_id?: string = null;
    extra_info?: string | CampaignExtraInfo = null;
    title?: string = null;
    description?: string = null;
    tags?: string[] = [];
    collaborating_influencers?: string[] = [];
    inf_campaign_dict?: {} = null;
    share_url?: string = null;
    short_share_url?: string = null;
    tracking_url?: string = null;
    short_tracking_url?: string = null;
    is_final?: boolean = null;
    campaign_type?: string = null;
    product_name: string = null;
    product_price: number = null;
    product_image: string = null;
    product_url: string = null;
    unit_cost: number = null;
    amazon_url?: string = null;
    number_of_posts: number = null;
    estimated_total_cost: number = null;
    campaign_coupon_code?: string = null;
    coupon_discount_percentage?: number = null;
    audience_detail?: any = null;
    status?: string = null;
    statusMessage?: string = null;
    discovery_status?: string = null;
    has_initial_payment?: boolean = null;
    require_application?: boolean = null;
    offer_detail?: OfferDetail = null;
    influencer_info?: CampaingInfluencerInfo = new CampaingInfluencerInfo();
    configuration: CampaignDetailConfiguration = new CampaignDetailConfiguration();
    offerStatus: OfferStatus = new OfferStatus();

    isDiscoveryCampaign: boolean = false;

    constructor(obj: ICampaignDetail = null, invitations?: { [key: string]: ICampaignInvitation }, isDiscoveryCampaign?: boolean) {
        super();
        if (obj) {
            Object.assign(this, CampaignModel.hydrate(obj));
        }
        this.isDiscoveryCampaign = isDiscoveryCampaign;
        this.setStatusAndMessage(invitations);
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            product: (val) => ShopifyProduct.hydrate(val),
            images: (val) => ImageContent.hydrate(val),
            commission_type: (val) => CommissionType[val],
            extra_info: (val) => CampaignExtraInfo.hydrate(JSON.parse(val)),
            offer_detail: (val) => OfferDetail.hydrate(val),
            influencer_info: (val) => CampaingInfluencerInfo.hydrate(val),
            configuration: (val) => CampaignDetailConfiguration.hydrate(val),
        };
    }

    get campaignStatus(): CampaignSteps {
        switch (true) {
            case this.influencer_info.isCommissionPaid:
                return CampaignSteps.complete;
            case this.influencer_info.isContentPosted:
                return CampaignSteps.pending_commission;
            case this.influencer_info.isContentReviewed:
                return CampaignSteps.draft_reviewed;
            case this.influencer_info.isContentSubmitted:
                return CampaignSteps.draft_under_review;
            case this.influencer_info.isProductReceived:
                return CampaignSteps.draft_pending;
            case this.influencer_info.isShipping:
                return CampaignSteps.shipping;
            case this.influencer_info.isUpfrontPaymentPaid:
                return CampaignSteps.try_out_product;
            case this.influencer_info.isAccepted:
                if (this.has_initial_payment) {
                    return CampaignSteps.initial_commission_paid;
                } else {
                    return CampaignSteps.shipping;
                }
            default:
                return null;
        }
    }

    static hydrate(object: ICampaignDetail) {
        return super.hydrate(object, new CampaignModel());
    }

    setStatusAndMessage(invitations: { [key: string]: ICampaignInvitation }) {
        if (typeof this.influencer_info !== 'undefined' && !!this.influencer_info) {
            const { delivery_deadline } = this.configuration;
            switch (true) {
                // Commission Paid
                case this.influencer_info.isCommissionPaid:
                    this.offerStatus
                        .setStatus('Completed')
                        .setColorClass(OfferStatusClassNames.GREEN)
                        .setStatusMessageColorClass(OfferStatusClassNames.GREEN)
                        .setType(OFFER_STATUS_TYPES.completed);
                    break;

                // Post Content / Post Overdue / Pending for Commission
                case this.influencer_info.isContentReviewed:
                    const submitPostTime = this.influencer_info.submit_post_time;

                    // Pending for commision
                    if (submitPostTime) {
                        this.offerStatus
                            .setStatus('Pending for Commission')
                            .setColorClass(OfferStatusClassNames.GREEN)
                            .setType(OFFER_STATUS_TYPES.completed);
                    } else {
                        // To be post
                        const contentReviewTime = this.influencer_info.content_approve_time;
                        const deadLine = dayjs(this.post_time ? this.post_time * 1000 : dayjs(contentReviewTime * 1000).add(1, 'day'));
                        const now = dayjs();
                        const leftHours = deadLine.diff(now, 'hour');
                        let reminderMessage = `Please post content before ${deadLine.format('MM/DD HH:MM')}`;
                        if (this.start_post_time) {
                            const startLine = dayjs(this.start_post_time * 1000);
                            reminderMessage = `Please post the content between ${startLine.format('MM/DD')} - ${deadLine.format(
                                'MM/DD'
                            )} ONLY`;
                        }
                        if (leftHours > 0) {
                            this.offerStatus
                                .setStatus('Post Content')
                                .setColorClass(OfferStatusClassNames.ORANGE)
                                .setStatusMessage(reminderMessage)
                                .setStatusMessageColorClass(OfferStatusClassNames.ORANGE)
                                .setType(OFFER_STATUS_TYPES.active);
                        } else {
                            this.offerStatus
                                .setStatus('Post Overdue')
                                .setColorClass(OfferStatusClassNames.RED)
                                .setStatusMessage('Commission maybe reduce')
                                .setStatusMessageColorClass(OfferStatusClassNames.RED)
                                .setType(OFFER_STATUS_TYPES.active);
                        }
                    }
                    break;

                // Reviewing
                case this.influencer_info.isContentSubmitted:
                    this.offerStatus
                        .setStatus('Draft under review')
                        .setColorClass(OfferStatusClassNames.GREEN)
                        .setType(OFFER_STATUS_TYPES.active);
                    break;

                // Draft Pending / Draft Overdue
                case this.influencer_info.isProductReceived:
                    const productReceivedTime = dayjs(this.influencer_info.product_received_time * 1000);
                    if (productReceivedTime.add(Number(delivery_deadline), 'hour').isBefore(dayjs())) {
                        this.offerStatus
                            .setStatus('Draft Overdue')
                            .setStatusMessage('Commission maybe reduce')
                            .setColorClass(OfferStatusClassNames.RED)
                            .setStatusMessageColorClass(OfferStatusClassNames.RED);
                    } else {
                        const hoursLeft = Number(delivery_deadline) - dayjs().diff(productReceivedTime, 'hour');
                        this.offerStatus
                            .setStatus('Draft Pending')
                            .setColorClass(OfferStatusClassNames.ORANGE)
                            .setStatusMessage(`Please upload in ${hoursLeft}${hoursLeft > 1 ? ' hrs' : ' hr'}`)
                            .setStatusMessageColorClass(OfferStatusClassNames.ORANGE);
                    }
                    this.offerStatus.setType(OFFER_STATUS_TYPES.active);

                    break;
                case this.influencer_info.isShipping:
                    this.offerStatus
                        .setStatus('Shipping')
                        .setStatusMessage('Product on the way')
                        .setColorClass(OfferStatusClassNames.GREEN)
                        .setStatusMessageColorClass(OfferStatusClassNames.GREEN)
                        .setType(OFFER_STATUS_TYPES.active);
                    break;
                case this.influencer_info.isUpfrontPaymentPaid:
                    this.offerStatus
                        .setStatus('Try Out')
                        .setStatusMessage('Try out and submit your order id')
                        .setColorClass(OfferStatusClassNames.ORANGE)
                        .setStatusMessageColorClass(OfferStatusClassNames.ORANGE)
                        .setType(OFFER_STATUS_TYPES.active);
                    break;
                case this.influencer_info.isAccepted:
                    if (!this.has_initial_payment) {
                        this.offerStatus
                            .setStatus('Shipping')
                            .setStatusMessage('On the way')
                            .setColorClass(OfferStatusClassNames.GREEN)
                            .setStatusMessageColorClass(OfferStatusClassNames.GREEN);
                    }
                    if (this.has_initial_payment) {
                        this.offerStatus.setStatus('Initial Commission Pending').setColorClass(OfferStatusClassNames.GREEN);
                    }
                    this.offerStatus.setType(OFFER_STATUS_TYPES.active);
                    break;
                case this.require_application && this.influencer_info.isApplied:
                    this.offerStatus.setStatus('Applied').setColorClass(OfferStatusClassNames.BLUE).setType(OFFER_STATUS_TYPES.new);
                    break;
                case this.influencer_info.isOfferReceived:
                    const invitation = invitations[this.brand_campaign_id];
                    if (invitation) {
                        const { inv_deadline, bonus, commission, default_coupon_code, campaign_status } = invitation;
                        const deadLine = dayjs(inv_deadline * 1000);
                        const leftHour = deadLine.diff(dayjs(), 'hour');
                        const isFilled = campaign_status === 'Closed';
                        this.offerStatus.setType(OFFER_STATUS_TYPES.new);
                        if (isFilled) {
                            this.offerStatus.setStatus('Sorry, the campaign is full');
                        } else {
                            if (dayjs().isBefore(deadLine)) {
                                this.offerStatus.setStatus(`${leftHour + 1} hrs left`).setColorClass(OfferStatusClassNames.ORANGE);
                            } else {
                                this.offerStatus.setStatus('Expired');
                            }
                        }

                        this.influencer_info.accept_commission = commission;
                        this.influencer_info.accept_bonus = Math.round((commission * bonus) / 100);
                        this.influencer_info.default_coupon_code = default_coupon_code;
                    }
                    break;
                case this.isDiscoveryCampaign:
                    const discoveryInvitation = invitations[this.brand_campaign_id];

                    const { inv_deadline, bonus, commission, campaign_status } = discoveryInvitation;
                    const deadLine = dayjs(inv_deadline * 1000);
                    const leftHour = deadLine.diff(dayjs(), 'hour');
                    const isFilled = campaign_status === 'Closed';
                    if (isFilled) {
                        this.offerStatus.setStatus('Filled');
                    } else {
                        if (dayjs().isBefore(deadLine)) {
                            // To be post
                            let reminderMessage = '';
                            if (this.start_post_time && this.post_time) {
                                const startLine = dayjs(this.start_post_time * 1000);
                                const deadLine = dayjs(this.post_time * 1000);
                                reminderMessage = `Content post period ${startLine.format('MM/DD')} - ${deadLine.format('MM/DD')}`;
                            }
                            this.offerStatus
                                .setColorClass(OfferStatusClassNames.BLUE)
                                .setStatusMessageColorClass(OfferStatusClassNames.RED)
                                .setStatusMessage(reminderMessage);

                            if (this.influencer_info.isApplied) {
                                this.offerStatus.setStatus('Applied');
                            } else {
                                this.offerStatus.setStatus(
                                    leftHour + 1 > 72
                                        ? `${Math.floor(dayjs.duration(leftHour + 1, 'hour').asDays())} days left`
                                        : `${leftHour + 1} hrs left`
                                );
                            }
                        } else {
                            this.offerStatus.setStatus('Expired');
                        }
                    }

                    this.influencer_info.accept_commission = commission;
                    this.influencer_info.accept_bonus = Math.round((commission * bonus) / 100);
            }
        }
    }
}

export class UploadFile extends GenericModel<IUploadFile> implements IUploadFile {
    url: string = null;
    path: string = null;

    constructor(obj: IUploadFile = null) {
        super();
        if (obj) {
            Object.assign(this, UploadFile.hydrate(obj));
        }
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            url: (val) => String(val),
            path: (val) => String(val),
        };
    }

    static hydrate(object: IUploadFile) {
        return super.hydrate(object, new UploadFile());
    }
}

export class ImageContent extends GenericModel<IImageContent> implements IImageContent {
    images: IUploadFile[] = [];
    caption: string = null;

    constructor(obj: IImageContent = null) {
        super();
        if (obj) {
            Object.assign(this, ImageContent.hydrate(obj));
        }
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            images: (values) => values.map((val) => UploadFile.hydrate(val)),
            caption: (val) => String(val),
        };
    }

    static hydrate(object: IImageContent) {
        return super.hydrate(object, new ImageContent());
    }
}

export class ShopifyProduct extends GenericModel<IShopifyProduct> implements IShopifyProduct {
    title: string = null;
    image: string = null;
    id: string = null;

    constructor(obj: IShopifyProduct = null) {
        super();
        if (obj) {
            Object.assign(this, ShopifyProduct.hydrate(obj));
        }
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            title: (val) => String(val),
            image: (val) => String(val),
            id: (val) => String(val),
        };
    }

    static hydrate(object: IShopifyProduct) {
        return super.hydrate(object, new ShopifyProduct());
    }
}

export class CampaignExtraInfo extends GenericModel<ICampaignExtraInfo> implements ICampaignExtraInfo {
    type?: string = null;
    platform?: string = null;
    post_time?: number = null;
    contracts: IUploadFile[] = [];
    commissionType?: CommissionType = null;

    constructor(obj: ICampaignExtraInfo = null) {
        super();
        if (obj) {
            Object.assign(this, CampaignExtraInfo.hydrate(obj));
        }
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            type: (val) => String(val),
            platform: (val) => String(val),
            post_time: (val) => Number(val),
            contracts: (values) => values.map((val) => UploadFile.hydrate(val)),
            commissionType: (val) => CommissionType[val],
        };
    }

    static hydrate(object: ICampaignExtraInfo) {
        return super.hydrate(object, new CampaignExtraInfo());
    }
}

export class OfferDetail extends GenericModel<IOfferDetail> implements IOfferDetail {
    compensation_message: string = null;
    product_message: string = null;
    product_image_list: string[] = [];
    content_format?: string = null;
    post_tags?: string[] = [];
    visual_content_guideline?: string = null;
    text_post_guideline?: string = null;
    post_hastags?: string[] = [];
    compensate_method?: string = null;
    payment_platform?: string = null;

    constructor(obj: IOfferDetail = null) {
        super();
        if (obj) {
            Object.assign(this, OfferDetail.hydrate(obj));
        }
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            compensation_message: (val) => String(val),
            product_message: (val) => String(val),
            product_image_list: (values) => values.map((val) => String(val)),
            content_format: (val) => String(val),
            post_tags: (values) => (Array.isArray(values) ? values.map((val) => String(val)) : String(values)),
            visual_content_guideline: (val) => String(val),
            text_post_guideline: (val) => String(val),
            post_hastags: (values) => (Array.isArray(values) ? values.map((val) => String(val)) : String(values)),
            compensate_method: (val) => String(val),
            payment_platform: (val) => String(val),
        };
    }

    static hydrate(object: IOfferDetail) {
        return super.hydrate(object, new OfferDetail());
    }
}

type CampaingInfluencerInfoTimestamps =
    | 'offer_received_time'
    | 'offer_accept_time'
    | 'upfront_paid_time'
    | 'offer_decline_time'
    | 'product_ship_time'
    | 'product_received_time'
    | 'content_submit_time'
    | 'content_approve_time'
    | 'submit_post_time'
    | 'commission_paid_time'
    | 'commission_paid_amount';

/**
 * has_initial_payment: false / true
 *
 * Order:
 * offer_received_time / commission_paid_time
 * offer_accept_time / offer_accept_time
 * product_ship_time / upfront_paid_time
 * product_received_time / product_recevied_time
 * content_submit_time / content_submit_time
 * content_approve_time / content_approve_time
 * submit_post_time / submit_post_time
 * commission_paid_time / commission_paid_time
 *  */
export class CampaingInfluencerInfo extends GenericModel<ICampaingInfluencerInfo> implements ICampaingInfluencerInfo {
    account_id: string = null;
    brand_signature_id: string = null;
    brand_signing_status: string = null;
    contract_data: object = null;
    contract_received_time: number = null;
    email: string = null;
    inf_contacting_status: string = null;
    inf_contract_status: string = null;
    inf_contract_thread: string = null;
    inf_email: string = null;
    inf_name: string = null;
    inf_offer_thread: string = null;
    inf_phone: string = null;
    inf_signature_id: string = null;
    inf_signing_status: string = null;
    influencer_address1: string = null;
    influencer_address2: string = null;
    platform: SocialMediaPlatform = null;
    profile: object = null;
    signature_request_id: string = null;
    application_time: number = null;
    offer_received_time: number = null;
    offer_accept_time: number = null;
    offer_decline_time: number = null;
    order_number: string = null;
    product_ship_time: number = null;
    upfront_paid_time: number = null;
    upfront_paid_amount: number = null;
    product_received_time: number = null;
    content_submit_time: number = null;
    content_approve_time: number = null;
    post_url: string = null;
    submit_post_time: number = null;
    commission_paid_time: number = null;
    commission_paid_amount: number = null;
    shipping_info: {
        carrier: string;
        tracking_number: string;
    } = null;
    accept_commission: number = null;
    accept_bonus: number = null;
    default_coupon_code: string = null;

    constructor(obj: ICampaingInfluencerInfo = null) {
        super();
        if (obj) {
            Object.assign(this, CampaingInfluencerInfo.hydrate(obj));
        }
    }

    getFormattedDate(timestampPropertyName: CampaingInfluencerInfoTimestamps, format: string = 'HH:mm MMM Do') {
        if (Number(dayjs(this[timestampPropertyName] * 1000).format('YYYY')) !== Number(dayjs().format('YYYY'))) {
            format += ' YYYY';
        }
        return dayjs(this[timestampPropertyName] * 1000).format(format);
    }

    get isApplied(): boolean {
        return !!this.application_time;
    }

    get isOfferReceived(): boolean {
        return !!this.offer_received_time;
    }

    get isAccepted(): boolean {
        return !!this.offer_accept_time;
    }

    get isShipping(): boolean {
        return !!this.product_ship_time;
    }

    get isUpfrontPaymentPaid() {
        return !!this.upfront_paid_time;
    }

    get isProductReceived(): boolean {
        return !!this.product_received_time;
    }

    get isContentSubmitted(): boolean {
        return !!this.content_submit_time;
    }

    get isBonusGetted(): boolean {
        return this.isContentSubmitted && dayjs(this.content_submit_time).isBefore(dayjs(this.product_received_time).add(48, 'hour'));
    }

    get isContentReviewed(): boolean {
        return !!this.content_approve_time;
    }

    get isContentPosted(): boolean {
        return !!this.submit_post_time;
    }

    get isCommissionPaid(): boolean {
        return !!this.commission_paid_time;
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            account_id: (val) => String(val),
            brand_signature_id: (val) => String(val),
            brand_signing_status: (val) => String(val),
            contract_data: (val) => val,
            contract_received_time: (val) => Number(val),
            email: (val) => String(val),
            inf_contacting_status: (val) => String(val),
            inf_contract_status: (val) => String(val),
            inf_contract_thread: (val) => String(val),
            inf_email: (val) => String(val),
            inf_name: (val) => String(val),
            inf_offer_thread: (val) => String(val),
            inf_phone: (val) => String(val),
            inf_signature_id: (val) => String(val),
            inf_signing_status: (val) => String(val),
            influencer_address1: (val) => String(val),
            influencer_address2: (val) => String(val),
            offer_received_time: (val) => Number(val),
            platform: (val) => String(val),
            profile: (val) => val,
            signature_request_id: (val) => String(val),
        };
    }

    static hydrate(object: ICampaingInfluencerInfo) {
        return super.hydrate(object, new CampaingInfluencerInfo());
    }
}

export enum OFFER_STATUS_TYPES {
    new = 'new',
    active = 'active',
    completed = 'completed',
}

export enum DISCOVER_STATUS_TYPES {
    hot = 'hot',
    applied = 'applied',
}

export enum OFFER_STATUS_ICONS {
    time = 'time',
    done = 'done',
}

type OFFER_STATUS_ICONS_TYPE = OFFER_STATUS_ICONS.time | OFFER_STATUS_ICONS.done;

export class OfferStatus extends GenericModel<IOfferStatus> implements IOfferStatus {
    status: string = null;
    colorClass: OfferStatusClassNames = null;
    isTime: boolean = null;
    statusMessage: string = null;
    statusMessageColorClass = null;
    statusType: OFFER_STATUS_TYPES;
    statusIcon: OFFER_STATUS_ICONS = null;
    messageIcon: OFFER_STATUS_ICONS = null;

    constructor(obj: IOfferStatus = null) {
        super();
        if (obj) {
            Object.assign(this, OfferStatus.hydrate(obj));
        }
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            status: (val) => String(val),
            colorClass: (val) => OfferStatusClassNames[val],
            isTime: (val) => Boolean(val),
            statusMessage: (val) => String(val),
            statusMessageColorClass: (val) => OfferStatusClassNames[val],
        };
    }

    static hydrate(object: IOfferStatus) {
        return super.hydrate(object, new OfferStatus());
    }

    setStatus(status: string) {
        this.status = status;
        return this;
    }

    setColorClass(colorClass: OfferStatusClassNames) {
        this.colorClass = colorClass;
        return this;
    }

    setStatusIcon(icon: OFFER_STATUS_ICONS_TYPE) {
        this.statusIcon = OFFER_STATUS_ICONS[icon];
        return this;
    }

    setMessageIcon(icon: OFFER_STATUS_ICONS_TYPE) {
        this.messageIcon = icon;
        return this;
    }

    setStatusMessage(statusMessage: string) {
        this.statusMessage = statusMessage;
        return this;
    }

    setStatusMessageColorClass(statusMessageColorClass: OfferStatusClassNames) {
        this.statusMessageColorClass = statusMessageColorClass;
        return this;
    }

    setType(statusType: OFFER_STATUS_TYPES) {
        this.statusType = statusType;
        return this;
    }

    isValid(): boolean {
        return !!this.status && !!this.statusMessage;
    }
}

export class CampaignDetailConfiguration extends GenericModel<ICampaignDetailConfiguration> implements ICampaignDetailConfiguration {
    cpm: string = null;
    delivery_deadline: string = null;
    fast_deliver_window: string = null;
    fast_delivery_bonus: string = null;
    max_base_commission: string = null;
    offer_expiration_time: string = null;

    constructor(obj: ICampaignDetailConfiguration = null) {
        super();
        if (obj) {
            Object.assign(this, CampaignDetailConfiguration.hydrate(obj));
        }
    }

    get build(): { [key: string]: (val: any) => any } {
        return {
            cpm: (val) => String(val),
            delivery_deadline: (val) => String(val),
            fast_deliver_window: (val) => String(val),
            fast_delivery_bonus: (val) => String(val),
            max_base_commission: (val) => String(val),
            offer_expiration_time: (val) => String(val),
        };
    }

    static hydrate(object: ICampaignDetailConfiguration) {
        return super.hydrate(object, new CampaignDetailConfiguration());
    }
}
