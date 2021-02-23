import { IProfile } from '@src/app/typings/profile.typings';
import { GenericModel } from '@src/app/models/generic.model';
import { IPaypalCustomerAddress } from '@typings/paypal.typings';

export class ProfileModel extends GenericModel<IProfile> implements IProfile {
    email: string = null;
    uid: string = null;
    name: string = null;
    last_name: string = null;
    address1: string = null;
    address2: string = null;
    city: string = null;
    province: string = null;
    zip: string = null;
    phone_number: string = null;
    instagram_id: string = null;
    tiktok_id: string = null;
    paypal: string = null;
    is_instagram_checked = false;
    profile_picture: string = null;
    industries: string[] = [];
    platforms: string[] = [];
    content_types: string[] = [];
    invited_by: string = null;
    invitation_source: string = null;
    invited_to_lottery: string = null;
    is_shop_notification_showed: boolean = false;
    is_shop_commission_showed: boolean = false;
    paypal_address: PaypalCustomerAddress = new PaypalCustomerAddress();
    readonly has_referrals: boolean = null;
    readonly invited_referrals: number = 0;
    readonly successful_referrals: number = 0;

    get editableProperties() {
        return [
            'name',
            'last_name',
            'address1',
            'address2',
            'city',
            'province',
            'country',
            'zip',
            'phone_number',
            'paypal',
            'paypal_address',
        ];
    }

    constructor(profileObj: IProfile = null) {
        super();
        if (profileObj) {
            Object.assign(this, ProfileModel.hydrate(profileObj));
        }
    }

    static get build() {
        return {
            email: (val) => (!val ? null : String(val)),
            uid: (val) => (!val ? null : String(val)),
            name: (val) => (!val ? null : String(val)),
            last_name: (val) => (!val ? null : String(val)),
            address1: (val) => (!val ? null : String(val)),
            address2: (val) => (!val ? null : String(val)),
            city: (val) => (!val ? null : String(val)),
            country: (val) => (!val ? null : String(val)),
            province: (val) => (!val ? null : String(val)),
            zip: (val) => (!val ? null : String(val)),
            phone_number: (val) => (!val ? null : String(val)),
            instagram_id: (val) => (!val ? null : String(val)),
            tiktok_id: (val) => (!val ? null : String(val)),
            paypal: (val) => (!val ? null : String(val)),
            is_instagram_checked: (val) => Boolean(val),
            profile_picture: (val) => (!val ? null : String(val)),
            invited_by: (val) => (!val ? null : String(val)),
            invited_to_lottery: (val) => (!val ? null : String(val)),
            invitation_source: (val) => (!val ? null : String(val)),
            industries: (vals) => (vals || []).map((val) => String(val)),
            platforms: (vals) => (vals || []).map((val) => String(val)),
            content_types: (vals) => (vals || []).map((val) => String(val)),
            has_referrals: (val) => Boolean(val),
            paypal_address: (val) => new PaypalCustomerAddress(val),
        };
    }

    get isSignUpCompleted(): boolean {
        return !!this.address1 && !!this.name;
    }

    get referral_link() {
        return `${window.location.origin}/sign-up?invited_by=${this.uid}`;
    }

    static hydrate(object: IProfile) {
        return super.hydrate(object, new ProfileModel());
    }

    dehydrate(): IProfile {
        return GenericModel.dehydrate(this, ProfileModel) as IProfile;
    }

    getEditableObject() {
        const object = this.dehydrate();
        Object.keys(object).forEach((key) => {
            if (!this.editableProperties.includes(key)) {
                delete object[key];
            }
        });
        return object;
    }

    setEmail(email: string) {
        this.email = email;
        return this;
    }

    setInstagramId(instagramId: string) {
        this.instagram_id = String(instagramId).toLowerCase();
        return this;
    }

    setTiktokId(tiktokId: string) {
        this.tiktok_id = String(tiktokId).toLowerCase();
        return this;
    }

    setPayPal(paypal: string) {
        this.paypal = paypal;
        return this;
    }

    setName(firstName: string) {
        this.name = firstName;
        return this;
    }

    setLastName(lastName: string) {
        this.last_name = lastName;
        return this;
    }

    setAddress1(address1: string) {
        this.address1 = address1;
        return this;
    }

    setAddress2(address2: string) {
        this.address2 = address2;
        return this;
    }

    setCity(city: string) {
        this.city = city;
        return this;
    }

    setState(state: string) {
        this.province = state;
        return this;
    }

    setZip(zip: string) {
        this.zip = zip;
        return this;
    }

    setPhoneNumber(phone_number: string) {
        this.phone_number = phone_number;
        return this;
    }

    setUserId(userId: string) {
        this.uid = userId;
        return this;
    }

    setIndustries(industries: string[]) {
        this.industries = industries;
        return this;
    }

    setProfilePicture(pictureUrl: string) {
        this.profile_picture = pictureUrl;
        return this;
    }

    setInvitedBy(invitedBy: string) {
        this.invited_by = invitedBy;
        return this;
    }

    setLottery(lotteryId: string) {
        this.invited_to_lottery = lotteryId;
        return this;
    }

    setPaypalAddress(address: PaypalCustomerAddress) {
        this.paypal_address = address;
        return this;
    }

    setSource(source: string) {
        this.invitation_source = source;
        return this;
    }
}

export class PaypalCustomerAddress extends GenericModel<IPaypalCustomerAddress> implements IPaypalCustomerAddress {
    street_address: string = null;
    locality: string = null;
    region: string = null;
    postal_code: string = null;
    country: string = null;

    constructor(profileObj: IPaypalCustomerAddress = null) {
        super();
        if (profileObj) {
            Object.assign(this, PaypalCustomerAddress.hydrate(profileObj));
        }
    }

    static get build() {
        return {
            street_address: (val) => (!val ? null : String(val)),
            locality: (val) => (!val ? null : String(val)),
            region: (val) => (!val ? null : String(val)),
            postal_code: (val) => (!val ? null : String(val)),
            country: (val) => (!val ? null : String(val)),
        };
    }

    static hydrate(object: IPaypalCustomerAddress) {
        return super.hydrate(object, new PaypalCustomerAddress());
    }
}
