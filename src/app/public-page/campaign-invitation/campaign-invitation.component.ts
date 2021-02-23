import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ICampaignInvitation, OfferDetail } from '@typings/campaign';
import { HeaderConfig } from '@shared/components/page-header/page-header.component';
import { InfluencerInfo } from '@typings/influencer';
import { ProfileModel } from '@models/profile.model';

import { CampaignService, Variant } from '@services/campaign.service';
import { PublicPageService } from '@services/public-page.service';
import { randomNum } from '@shared/methods/randomnumber';
import { CampaignsService } from '@src/app/services/campaigns.service';
import { ProfileService } from '@services/profile.service';

import * as dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
dayjs.extend(duration);

@Component({
    selector: 'app-campaign-invitation',
    templateUrl: './campaign-invitation.component.html',
    styleUrls: ['./campaign-invitation.component.scss'],
})
export class CampaignInvitationComponent implements OnInit {
    campaignId: string;
    accountId: string;

    offerDetail: OfferDetail;
    platform: string;

    subscriptions: Subscription = new Subscription();

    decline_type: string;
    decline_text_reason: string;

    campaignInvitation: ICampaignInvitation;

    normalPageHeaderConfig: HeaderConfig = {
        title: 'Campaign Invitation',
        leftImgUrl: 'assets/svg/brand_logo_2.svg',
        rightLinkText: 'Sign Up',
    };
    declinePageHeaderConfig: HeaderConfig = {
        leftImgUrl: 'assets/svg/brand_logo_2.svg',
    };
    discoveryPageHeaderConfig: HeaderConfig = {
        title: 'Campaign Invitation',
    };

    applyDialog = {
        status: false,
        footer: [
            {
                text: 'Discover More',
                onPress: () => this.router.navigate(['/dashboard']),
            },
        ],
    };

    productTypeList: Variant[] = [];

    influencer = {
        inf_email: '',
        inf_phone: '',
        inf_name: '',
        inf_last_name: '',
        influencer_address1: '',
        influencer_address2: '',
        influencer_city: '',
        influencer_province: '',
        influencer_country: 'United States',
        influencer_zip: '',
        accept_commission: 0,
        accept_bonus: 0,
        variant_id: null,
        variants: [],
    };

    quota: number;
    recruitedCount: number;
    initialPaymentPercent: number;

    submitting = false;
    completeForm = true;
    status: string;
    campaignRecruitStatus: 'Open' | 'Closed' = 'Open';
    loading: boolean = true;
    currentPage: 'discovery' | 'public-invitation' | 'decline' | 'address-input';
    originPage: 'discovery' | 'public-invitation';

    selectedProducts = {};
    postTimelineMessage = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        private campaignService: CampaignService,
        private campaignsService: CampaignsService,
        private publicPageService: PublicPageService,
        private profileService: ProfileService,
        private modalService: ModalService,
        private toast: ToastService,
        public router: Router
    ) {
        this.campaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
        this.accountId = this.activatedRoute.snapshot.paramMap.get('accountId');
        const isDiscoveryPage = !!this.activatedRoute.snapshot.paramMap.get('discovery');
        this.currentPage = isDiscoveryPage ? 'discovery' : 'public-invitation';
        this.originPage = this.currentPage;
    }

    async ngOnInit() {
        if (this.originPage === 'discovery') {
            this.campaignService
                .getDiscoveryCampaignDetail(this.campaignId)
                .then((res) => {
                    console.log(res);
                    this.offerDetail = res.offer_detail;
                    this.offerDetail.product_list = res.product_list;
                    this.status = res.status;
                    this.productTypeList = res.product_variants;
                    this.influencer.variant_id = res?.product_variants[0]?.id;
                    this.platform = res.platform;
                    this.offerDetail.product_list.forEach((product) => {
                        if (product.variants.length && product.variants[0] && product.variants[0].id) {
                            this.changeProductVariant({
                                product_id: product.id,
                                variant_id: product.variants[0].id,
                            });
                            this.selectedProducts[product.id] = product.variants[0].id;
                        }
                    });
                    if (res.post_time) {
                        this.postTimelineMessage = `Content must be post before ${dayjs(res.post_time * 1000).format('MM/DD')}`;
                    }
                    if (res.start_post_time) {
                        this.postTimelineMessage =
                            `Content must be post in ${dayjs(res.start_post_time * 1000).format('MM/DD')}` +
                            `- ${dayjs(res.post_time * 1000).format('MM/DD')}`;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
            this.campaignService.getDiscoveryCampaignInvitation(this.campaignId).then((res) => {
                this.campaignInvitation = res;
            });
        } else {
            const sub = this.campaignService.getInfluencerCampaignDetail(this.campaignId, this.accountId).subscribe(
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
                        this.initialPaymentPercent = result.influencer_public_profile?.initial_payment_percentage;
                        this.productTypeList = result.influencer_public_profile?.product_variants;
                        this.offerDetail.product_list.forEach((product) => {
                            if (product.variants.length && product.variants[0] && product.variants[0].id) {
                                this.changeProductVariant({
                                    product_id: product.id,
                                    variant_id: product.variants[0].id,
                                });
                                this.selectedProducts[product.id] = product.variants[0].id;
                            }
                        });
                        this.influencer.variant_id = result.influencer_public_profile?.product_variants[0]?.id;
                        this.platform = result.influencer_public_profile?.platform;
                    }
                },
                (err) => (this.loading = false)
            );
            this.subscriptions.add(sub);

            this.publicPageService.getCampaignInvitation(this.campaignId, this.accountId).then((result) => {
                this.campaignInvitation = result;
            });

            this.campaignsService.getCampaignInvitationStatus(this.campaignId).then((result) => {
                this.campaignRecruitStatus = result.status;
                this.quota = Number(result.quota) || 0;
                this.recruitedCount = Number(result.recruited_count) || 0;
            });
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
                influencer_city: city,
                influencer_province: province,
                influencer_zip: zip,
            };
        });
        this.subscriptions.add(profileSub);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    async declientOfferReal(reason) {
        this.subscriptions.add(
            this.campaignService
                .declineInfluencerOffer(this.campaignId, this.accountId, reason.decline_type, reason.decline_text_reason)
                .subscribe(
                    () => {
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

    declineOfferMobile() {
        this.currentPage = 'decline';
    }

    applyCampaign() {
        this.submitting = true;
        const info = {
            ...this.influencer,
            accept_commission: this.campaignInvitation.commission,
            accept_bonus: this.getBonus,
        };
        this.campaignService
            .applyDiscoveryCampaign(this.campaignId, info)
            .then(() => {
                this.status = 'Applied';
                this.applyDialog.status = true;
            })
            .finally(() => (this.submitting = false));
        this.saveProfile();
    }

    saveProfile() {
        const newProfile = new ProfileModel(this.profileService.currentProfile);
        newProfile.setName(this.influencer.inf_name); // required
        newProfile.setLastName(this.influencer.inf_last_name); // required
        newProfile.setAddress1(this.influencer.influencer_address1); // required
        newProfile.setAddress2(this.influencer.influencer_address2);
        newProfile.setCity(this.influencer.influencer_city); // required
        newProfile.setState(this.influencer.influencer_province); // required
        newProfile.setZip(this.influencer.influencer_zip); // required
        newProfile.setPhoneNumber(this.influencer.inf_phone);
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

    goSignUpWitParams() {
        if (this.platform === 'tiktok') {
            this.router.navigate(['/sign-up/tik-tok'], {
                queryParams: {
                    campaignId: this.campaignId,
                    accountId: this.accountId,
                },
            });
        } else {
            this.router.navigate(['/sign-up'], {
                queryParams: {
                    campaignId: this.campaignId,
                    accountId: this.accountId,
                },
            });
        }
    }

    goPage(path: string) {
        this.router.navigate([path]);
    }

    backToOffer() {
        this.currentPage = this.originPage;
    }

    goAddressInput() {
        // Check proper id
        if (this.platform === 'tiktok') {
            if (!this.profileService.currentProfile.tiktok_id) {
                console.log('No ticktok id');
                this.showMissingIdPopUp('tiktok');
            } else {
                this.currentPage = 'address-input';
            }
        } else {
            if (!this.profileService.currentProfile.instagram_id) {
                console.log('No ins id');
                this.showMissingIdPopUp('instagram');
            } else {
                this.currentPage = 'address-input';
            }
        }
    }

    showMissingIdPopUp(platform) {
        const callBackOption = {
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
                    .then(() => (this.currentPage = 'address-input'))
                    .catch(() => this.toast.fail('Set instagram id failed, please try again later'));
            },
        };

        this.modalService.prompt(
            `Connect ${platform} Account`,
            `Please enter your ${platform} username to accept this campaign.`,
            [callBackOption],
            'default',
            null,
            [`${platform} Id`]
        );
    }

    goDecline() {
        this.currentPage = 'decline';
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

    get timeLeft() {
        const leftHour = dayjs(this.campaignInvitation?.inv_deadline * 1000).diff(dayjs(), 'hour') + 1;
        if (leftHour > 72) {
            return `${Math.floor(dayjs.duration(leftHour, 'hour').asDays())} days left`;
        }
        return `${leftHour} hrs left`;
    }

    get expired() {
        return (
            dayjs(this.campaignInvitation?.inv_deadline * 1000).isBefore(dayjs()) ||
            (this.campaignRecruitStatus !== 'Open' && this.currentPage !== 'public-invitation')
        );
    }

    get filled() {
        return this.campaignRecruitStatus === 'Closed' && this.currentPage !== 'public-invitation';
    }

    get getBonus() {
        if (this.campaignInvitation.bonus_dollar) {
            return this.campaignInvitation.bonus_dollar;
        }
        return Math.round((this.campaignInvitation?.bonus * this.campaignInvitation?.commission) / 100);
    }

    get applied() {
        return this.status === 'Applied';
    }

    get appliedInfluencerCount() {
        const max = this.quota > 3 ? this.quota : 10;
        const randomNumber = randomNum({ min: 3, max }, this.campaignId);
        return Math.max(randomNumber, this.recruitedCount);
    }

    get randomNum() {
        return randomNum({ min: 3, max: 10 }, this.campaignId);
    }

    get isDeclinePage() {
        return this.currentPage === 'decline';
    }

    get isDiscoveryPage() {
        return this.currentPage === 'discovery';
    }

    get isPublicInvitationPage() {
        return this.currentPage === 'public-invitation';
    }

    get isAddressInputPage() {
        return this.currentPage === 'address-input';
    }

    get isRequiredFieldFilled() {
        return !!(
            this.influencer.inf_name &&
            this.influencer.inf_last_name &&
            this.influencer.influencer_address1 &&
            this.influencer.influencer_city &&
            this.influencer.influencer_province &&
            this.influencer.influencer_zip
        );
    }

    get initialPayment() {
        return Math.round((this.campaignInvitation.commission * this.initialPaymentPercent) / 100);
    }
}
