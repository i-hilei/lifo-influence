import { Injectable } from '@angular/core';
import { InfluencerPublicProfile } from '@services/campaign.service';
import { InfluencerInfo } from '@typings/influencer';
import { OfferDetail } from '@typings/campaign';
import { ProfileModel } from '@models/profile.model';
import { ProfileService } from '@services/profile.service';

@Injectable({
    providedIn: 'root',
})
export class CampaignInfluencerService {
    constructor(private profileService: ProfileService) {}

    saveProfile(inf: InfluencerInfo) {
        const newProfile = new ProfileModel(this.profileService.currentProfile);
        newProfile.setName(inf.inf_name);
        newProfile.setLastName(inf.inf_last_name);
        newProfile.setAddress1(inf.influencer_address1);
        newProfile.setAddress2(inf.influencer_address2);
        newProfile.setCity(inf.city);
        newProfile.setState(inf.province);
        newProfile.setZip(inf.zip);
        newProfile.setPhoneNumber(inf.inf_phone);
        const profileToUpdate = newProfile.getEditableObject();
        this.profileService
            .updateCurrentProfile(profileToUpdate)
            .then(() => (this.profileService.currentProfile = newProfile))
            .catch((err) => console.error(err));
    }
}

export function handleCampaignDetail(influencerPublicInfo: InfluencerPublicProfile) {
    const offerDetail: OfferDetail = {
        compensation_message: influencerPublicInfo.compensation_message,
        product_message: influencerPublicInfo.product_message,
        product_image_list: influencerPublicInfo.product_image_list,
        ...(influencerPublicInfo.offer_detail || []),
    };
    const productTypeList = influencerPublicInfo.product_variants;
    const variantId = influencerPublicInfo?.product_variants[0]?.id;
    const initialPaymentPercent = influencerPublicInfo?.initial_payment_percentage;
    const completeForm = influencerPublicInfo.status === 'Influencer signed up';

    return { offerDetail, productTypeList, variantId, initialPaymentPercent, completeForm };
}
