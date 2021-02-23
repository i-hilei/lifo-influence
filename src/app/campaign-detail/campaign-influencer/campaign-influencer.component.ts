import { CampaignModel } from '@models/campaign.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as dayjs from 'dayjs';

import { ICampaignInvitation, OfferDetail, ICampaignDetail } from '@typings/campaign';
import { InfluencerInfo } from '@typings/influencer';
import { ProfileModel } from '@models/profile.model';
import { MessageLevel, MessageType } from '@src/app/typings/system.typings';

import { CampaignService, Variant } from '@services/campaign.service';
import { ProfileService } from '@services/profile.service';
import { CampaignsService } from '@src/app/services/campaigns.service';
import { MessagesService } from '@src/app/shared/messages/messages.service';
import { randomNum } from '@shared/methods/randomnumber';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-campaign-influencer',
    templateUrl: './campaign-influencer.component.html',
    styleUrls: ['./campaign-influencer.component.scss'],
})
export class CampaignInfluencerComponent implements OnInit {
    @ViewChild('addresstext') addresstext: any;

    campaignId: string;
    accountId: string;
    platform: string = 'instagram';
    campaignDetail = new CampaignModel();

    completeForm = true;

    influencer: InfluencerInfo = {
        inf_email: '',
        inf_phone: '',
        inf_name: '',
        inf_last_name: '',
        influencer_address1: '',
        influencer_address2: '',
        city: '',
        province: '',
        country: '',
        zip: '',
        variants: [],
        variant_id: null,
    };

    productTypeList: Variant[] = [];

    offerDetail: OfferDetail;
    postTimelineMessage = '';

    subscriptions: Subscription[] = [];

    showDeclineOfferMobile = false;
    showAcceptOfferMobile = false;
    decline_type: string;
    decline_text_reason: string;

    campaignInvitation: ICampaignInvitation;

    quota: number;
    recruitedCount: number;

    initialPaymentPercent: number;

    campaignRecruitStatus = 'Open';

    pageHeaderConfig = {
        title: 'Campaign Detail',
        backUrl: '/dashboard',
        queryParams: null,
    };

    submitting: boolean;
    loading: boolean = true;
    selectedProducts = {};

    shippingAddress = this.formBuilder.group({
        influencer_address1: [''],
        influencer_address2: [''],
        city: [''],
        province: [''],
        zip: [''],
        country: [''],
    });

    get requireApplication() {
        return !!this.campaignDetail?.require_application;
    }

    get isApplied() {
        return this.campaignDetail.require_application && this.campaignDetail.influencer_info?.application_time;
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private campaignService: CampaignService,
        private campaignsService: CampaignsService,
        private messagesService: MessagesService,
        private profileService: ProfileService,
        private modalService: ModalService,
        private toast: ToastService,
        public router: Router,
        private formBuilder: FormBuilder
    ) {
        this.campaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
    }

    ngAfterViewInit() {}

    async ngOnInit() {
        const fetchCampaignInvitation = this.campaignsService.getCampaignInvitation(this.campaignId);
        const fetchCampaignDetail = this.campaignService.getInfluencerCampaignById(this.campaignId);
        await Promise.all([fetchCampaignInvitation, fetchCampaignDetail]).then(([invitation, campaignDetail]) => {
            this.campaignInvitation = invitation;
            this.handleCampaignDetail(campaignDetail);
            this.campaignDetail = new CampaignModel(campaignDetail, { [this.campaignId]: this.campaignInvitation });
        });

        if (!this.accountId) {
            this.loading = false;
            return;
        }
        const infCampaignDetail = await this.campaignService.getInfluencerCampaignDetail(this.campaignId, this.accountId);
        this.subscriptions.push(
            infCampaignDetail.subscribe(
                (result) => {
                    this.loading = false;
                    if (result?.influencer_public_profile) {
                        this.offerDetail = {
                            compensation_message: result.influencer_public_profile.compensation_message,
                            product_message: result.influencer_public_profile.product_message,
                            product_image_list: result.influencer_public_profile.product_image_list,
                            product_list: result.influencer_public_profile.product_list,
                            ...(result.influencer_public_profile.offer_detail || []),
                        };

                        if (result.influencer_public_profile.post_time) {
                            this.postTimelineMessage = `Content must be post before ${dayjs(
                                result.influencer_public_profile.post_time * 1000
                            ).format('MM/DD')}`;
                        }
                        if (result.influencer_public_profile.start_post_time) {
                            this.postTimelineMessage =
                                `Content must be post in ${dayjs(result.influencer_public_profile.start_post_time * 1000).format(
                                    'MM/DD'
                                )}` + `- ${dayjs(result.influencer_public_profile.post_time * 1000).format('MM/DD')}`;
                        }

                        // For single product
                        this.productTypeList = result.influencer_public_profile.product_variants;
                        this.influencer.variant_id = result.influencer_public_profile.product_variants[0]?.id;

                        // For multiple product
                        this.offerDetail.product_list.forEach((product) => {
                            if (product.variants.length && product.variants[0] && product.variants[0].id) {
                                this.changeProductVariant({
                                    product_id: product.id,
                                    variant_id: product.variants[0].id,
                                });
                                this.selectedProducts[product.id] = product.variants[0].id;
                            }
                        });
                        this.initialPaymentPercent = result.influencer_public_profile?.initial_payment_percentage;

                        if (result.influencer_public_profile.status !== 'Influencer signed up' || this.requireApplication) {
                            this.completeForm = false;
                        }
                    }
                },
                (err) => (this.loading = false)
            )
        );

        this.campaignsService.getCampaignInvitationStatus(this.campaignId).then((result) => {
            this.campaignRecruitStatus = result.status;
            this.quota = Number(result.quota) || 0;
            this.recruitedCount = Number(result.recruited_count) || 0;
        });

        this.pageHeaderConfig.queryParams = this.activatedRoute.snapshot.queryParams;
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    async handleCampaignDetail(campaignDetail) {
        this.platform = campaignDetail.platform;

        if (this.platform === 'tiktok') {
            this.accountId = this.profileService.currentProfile.tiktok_id;
        } else {
            this.accountId = this.profileService.currentProfile.instagram_id;
        }

        if (this.accountId === undefined || !this.accountId) {
            this.showMissingIdPopUp(this.platform);
        }

        const profileSub = this.profileService.currentProfileSubject.subscribe((val) => {
            if (!val) return;

            const { name, email, last_name, address1, address2, phone_number, city, province, zip } = val;
            this.influencer = {
                ...this.influencer,
                inf_email: email,
                inf_phone: phone_number,
                inf_name: name,
                inf_last_name: last_name,
                influencer_address1: address1,
                influencer_address2: address2,
                city,
                province,
                country: 'United States',
                zip,
            };

            this.shippingAddress.get('influencer_address1').setValue(address1);
            this.shippingAddress.get('influencer_address2').setValue(address2);
            this.shippingAddress.get('city').setValue(city);
            this.shippingAddress.get('province').setValue(province);
            this.shippingAddress.get('zip').setValue(zip);
            this.shippingAddress.get('country').setValue('United States');
        });
        this.subscriptions.push(profileSub);
    }

    saveInfoReal(inf) {
        if (this.campaignInvitation) {
            inf = {
                ...inf,
                influencer_address1: this.shippingAddress.get('influencer_address1').value,
                influencer_address2: this.shippingAddress.get('influencer_address2').value,
                city: this.shippingAddress.get('city').value,
                province: this.shippingAddress.get('province').value,
                zip: this.shippingAddress.get('zip').value,
                commission: this.campaignInvitation.commission,
                bonus: this.getBonus,
                default_coupon_code: this.campaignInvitation.default_coupon_code,
            };
            if (this.campaignDetail?.require_application) {
                inf.application_time = dayjs().unix();
            }
        }
        this.campaignsService.acceptCampaignInvitation(this.campaignId, true, !!this.campaignDetail?.require_application).then(
            (status) => {
                if (status.status === 'OK') {
                    this.campaignService
                        .inputInfluencerInfo(this.campaignId, this.accountId, inf)
                        .then(() => {
                            if (this.requireApplication) {
                                this.campaignDetail.influencer_info.application_time = dayjs().unix();
                                this.showAcceptOfferMobile = false;
                            } else {
                                this.completeForm = true;
                                this.showAcceptOfferMobile = false;
                                this.router.navigate([`/campaign/${this.campaignId}`]);
                            }
                        })
                        .finally(() => {
                            this.submitting = false;
                        });
                } else {
                    this.submitting = false;
                    this.messagesService.showMessage({
                        type: MessageType.message,
                        showOverlay: true,
                        messageLevel: MessageLevel.error,
                        text: status.status,
                    });
                }
            },
            (error) => {
                this.submitting = false;
                this.messagesService.showMessage({
                    type: MessageType.message,
                    showOverlay: true,
                    messageLevel: MessageLevel.error,
                    text: error,
                });
            }
        );
    }

    saveProfile(inf: InfluencerInfo) {
        const newProfile = new ProfileModel(this.profileService.currentProfile);
        newProfile.setName(inf.inf_name); // required
        newProfile.setLastName(inf.inf_last_name); // required
        newProfile.setAddress1(this.shippingAddress.get('influencer_address1').value); // required
        newProfile.setAddress2(this.shippingAddress.get('influencer_address2').value);
        newProfile.setCity(this.shippingAddress.get('city').value); // required
        newProfile.setState(this.shippingAddress.get('province').value); // required
        newProfile.setZip(this.shippingAddress.get('zip').value); // required
        newProfile.setPhoneNumber(inf.inf_phone);
        const profileToUpdate = newProfile.getEditableObject();
        this.profileService
            .updateCurrentProfile(profileToUpdate)
            .then(() => {
                this.profileService.currentProfile = newProfile;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async declientOfferReal(reason) {
        this.subscriptions.push(
            this.campaignService
                .declineInfluencerOffer(this.campaignId, this.accountId, reason.decline_type, reason.decline_text_reason)
                .subscribe(
                    () => {
                        this.completeForm = true;
                        this.showDeclineOfferMobile = false;
                        this.router.navigate(['/dashboard']);
                    },
                    (err) => {
                        console.error(err);
                    }
                )
        );
    }

    declientOfferRealMobile() {
        this.declientOfferReal({
            decline_type: this.decline_type,
            decline_text_reason: this.decline_text_reason,
        });
    }

    acceptOfferRealMobile() {
        this.submitting = true;
        this.saveProfile(this.influencer);
        this.saveInfoReal(this.influencer);
    }

    declineOfferMobile() {
        this.showDeclineOfferMobile = true;
    }

    acceptOfferMobile() {
        this.showAcceptOfferMobile = true;

        setTimeout(() => this.getPlaceAutocomplete(), 300);
    }

    backToOffer() {
        this.showDeclineOfferMobile = false;
        this.showAcceptOfferMobile = false;
    }

    get hoursleft() {
        return dayjs(this.campaignInvitation?.inv_deadline * 1000).diff(dayjs(), 'hour') + 1;
    }

    get expired() {
        return dayjs(this.campaignInvitation?.inv_deadline * 1000).isBefore(dayjs()) || this.campaignRecruitStatus !== 'Open';
    }

    get filled() {
        return this.campaignRecruitStatus === 'Closed';
    }

    get getBonus() {
        if (this.campaignInvitation?.bonus_dollar) {
            return this.campaignInvitation.bonus_dollar;
        }
        return Math.round((this.campaignInvitation?.bonus * this.campaignInvitation?.commission) / 100) || 0;
    }

    get isRequiredFieldFilled() {
        return !!(
            this.influencer.inf_name &&
            this.influencer.inf_last_name &&
            this.shippingAddress.get('influencer_address1').value &&
            this.shippingAddress.get('city').value &&
            this.shippingAddress.get('province').value &&
            this.shippingAddress.get('zip').value
        );
    }

    get appliedUser() {
        const max = this.quota > 3 ? this.quota : 10;
        const randomNumber = randomNum({ min: 3, max }, this.campaignId);
        return Math.max(randomNumber, this.recruitedCount || 0);
    }

    get initialPayment() {
        return Math.round((this.campaignInvitation.commission * this.initialPaymentPercent) / 100);
    }

    changeProductVariant(event) {
        const variantToChangeIndex = this.influencer.variants.findIndex((variant) => variant.product_id === event.product_id);
        if (variantToChangeIndex !== -1) {
            this.influencer.variants[variantToChangeIndex] = {
                product_id: event.product_id,
                variant_id: event.variant_id,
            };
        } else {
            this.influencer.variants.push({
                product_id: event.product_id,
                variant_id: event.variant_id,
            });
        }
        this.influencer.variant_id = this.influencer.variants.map((variant) => variant.variant_id).join(',');
    }

    showMissingIdPopUp(platform) {
        this.modalService.prompt(
            `Connect ${platform} Account`,
            `Please enter your ${platform} username to accept this campaign.`,
            [
                {
                    text: 'Confirm',
                    onPress: (ins_id: string) => {
                        // handel ins
                        let cleanInsId = ins_id.trim();
                        // If @xxxxx, remove the '@'
                        if (cleanInsId.indexOf('@') >= 0) {
                            cleanInsId = cleanInsId.substring(cleanInsId.indexOf('@') + 1);
                        }
                        // If user put in full url, only keep the username
                        if (cleanInsId.lastIndexOf('/') >= 0) {
                            cleanInsId = cleanInsId.substring(cleanInsId.lastIndexOf('/') + 1);
                        }

                        cleanInsId = cleanInsId.toLowerCase().trim();

                        const update_body: any = {};
                        if (platform === 'tiktok') {
                            update_body.tiktok_id = cleanInsId;
                            this.profileService.currentProfile.setTiktokId(cleanInsId);
                        } else {
                            update_body.instagram_id = cleanInsId;
                            this.profileService.currentProfile.setInstagramId(cleanInsId);
                        }
                        // handel ins
                        this.profileService
                            .updateCurrentProfile(update_body)
                            .then(() => {
                                window.location.reload();
                            })
                            .catch(() => {
                                this.toast.fail('Set instagram id failed, please try again later');
                            });
                    },
                },
            ],
            'default',
            null,
            [`${platform} Id`]
        );
    }

    getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
            componentRestrictions: { country: 'US' },
            types: ['address'],
        });

        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0];
                if (addressType === 'postal_code') {
                    this.shippingAddress.get('zip').setValue(place.address_components[i].long_name);
                } else if (addressType === 'administrative_area_level_1') {
                    this.shippingAddress.get('province').setValue(place.address_components[i].long_name);
                } else if (addressType === 'locality') {
                    this.shippingAddress.get('city').setValue(place.address_components[i].long_name);
                }
                this.shippingAddress.get('influencer_address1').setValue(place.name);
            }
            Object.assign(this.influencer, this.shippingAddress.getRawValue());
        });
    }
}
