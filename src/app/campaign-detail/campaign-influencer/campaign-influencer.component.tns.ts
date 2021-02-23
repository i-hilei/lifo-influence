import { SocialMediaPlatform } from '@models/campaign.model';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions, ModalDialogService, ModalDialogOptions } from '@nativescript/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Page } from '@nativescript/core';
import { InfoUpdateComponent } from '@shared/components/only-native-component/info-update/info-update.component.tns';

// Service
import { ProfileService } from '@services/profile.service';
import { CampaignsService } from '@src/app/services/campaigns.service';
import { CampaignService, Variant } from '@services/campaign.service';
import { handleCampaignDetail, CampaignInfluencerService } from './campaign-influencer.service';
import { randomNum } from '@shared/methods/randomnumber';
import { DialogsService } from '@services/dialogs.service';
import * as dayjs from 'dayjs';

// Types
import { InfluencerInfo } from '@typings/influencer';
import { ICampaignInvitation, OfferDetail, ICampaignDetail } from '@typings/campaign';
import { ExtendedShowModalOptions } from 'nativescript-windowed-modal';

@Component({
    selector: 'app-campaign-influencer',
    providers: [ModalDialogService],
    templateUrl: './campaign-influencer.component.tns.html',
    styleUrls: ['./campaign-influencer.component.tns.scss'],
})
export class CampaignInfluencerComponent implements OnInit {
    campaignId: string;
    offerDetail: OfferDetail;
    productTypeList: Variant[];
    initialPaymentPercent: number;
    influencer: InfluencerInfo;
    campaignDetail: ICampaignDetail;
    campaignInvitation: ICampaignInvitation;
    campaignRecruitStatus: 'Open' | 'Closed' = 'Open';
    quota: number;
    recruitedCount: number;
    subscriptions = new Subscription();
    status: string;
    applying: boolean;
    completeForm = true;

    // discover | myCampaign
    type: string;

    get accountId() {
        switch (this.campaignDetail?.platform) {
            case SocialMediaPlatform.instagram:
                return this.profileService.currentProfile?.instagram_id;
            case SocialMediaPlatform.tiktok:
                return this.profileService.currentProfile?.tiktok_id;
            default:
                return null;
        }
    }

    get getBonus() {
        if (this.campaignInvitation?.bonus_dollar) {
            return this.campaignInvitation.bonus_dollar;
        }
        return Math.round((this.campaignInvitation?.bonus * this.campaignInvitation?.commission) / 100) || 0;
    }

    get hoursleft() {
        return dayjs(this.campaignInvitation?.inv_deadline * 1000).diff(dayjs(), 'hour') + 1;
    }

    get appliedUser() {
        const max = this.quota > 3 ? this.quota : 10;
        const randomNumber = randomNum({ min: 3, max }, this.campaignId);
        return Math.max(randomNumber, this.recruitedCount || 0);
    }

    get filled() {
        return this.campaignRecruitStatus === 'Closed';
    }

    get expired() {
        return dayjs(this.campaignInvitation?.inv_deadline * 1000).isBefore(dayjs()) || this.filled;
    }

    get totalMoney() {
        const commission = Number(this.campaignInvitation?.commission);
        const bonus = Number(this.getBonus);
        const prodcutPrice = Number(this.campaignDetail?.product_price);
        return (commission + bonus + prodcutPrice || 0).toFixed(2);
    }

    get applied() {
        return this.status === 'Applied';
    }

    constructor(
        private router: RouterExtensions,
        private activatedRoute: ActivatedRoute,
        private profileService: ProfileService,
        private campaignService: CampaignService,
        private campaignsService: CampaignsService,
        private modalService: ModalDialogService,
        private commonService: CampaignInfluencerService,
        private vcRef: ViewContainerRef,
        private page: Page,
        private dialogService: DialogsService
    ) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.initVariable();
        this.getCampaignInvitationStatus();

        if (this.type === 'discover') {
            this.getCampaignDetail();
            this.getDiscoverOfferDetail();
            this.getDiscoverCampaignInvitation();
            this.subscribeCurrentProfileUpdate();
        }

        if (this.type === 'myCampaign') {
            this.getCampaignInvitation();
            Promise.all([this.getCampaignDetail(), this.subscribeCurrentProfileUpdate()]).then(() => this.getCampaignOfferDetail());
        }
    }

    getCampaignOfferDetail() {
        this.campaignService.getInfluencerCampaignDetail(this.campaignId, this.accountId).subscribe(
            (res) => {
                if (res?.influencer_public_profile) {
                    const { productTypeList, variantId, initialPaymentPercent, offerDetail, completeForm } = handleCampaignDetail(
                        res.influencer_public_profile
                    );
                    this.offerDetail = offerDetail;
                    this.productTypeList = productTypeList;
                    this.influencer.variant_id = variantId;
                    this.initialPaymentPercent = initialPaymentPercent;
                    this.completeForm = completeForm;
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }
    getDiscoverOfferDetail() {
        this.campaignService.getDiscoveryCampaignDetail(this.campaignId).then((res) => {
            this.offerDetail = res.offer_detail;
            this.status = res.status;
            this.productTypeList = res.product_variants;
            this.influencer.variant_id = res?.product_variants[0]?.id;
        });
    }

    getCampaignInvitation() {
        this.campaignsService.getCampaignInvitation(this.campaignId).then((res) => (this.campaignInvitation = res));
    }
    getDiscoverCampaignInvitation() {
        this.campaignService.getDiscoveryCampaignInvitation(this.campaignId).then((res) => (this.campaignInvitation = res));
    }

    getCampaignDetail() {
        return this.campaignService.getInfluencerCampaignById(this.campaignId).then((res) => (this.campaignDetail = res));
    }

    getCampaignInvitationStatus() {
        this.campaignsService.getCampaignInvitationStatus(this.campaignId).then((result) => {
            this.campaignRecruitStatus = result.status;
            this.quota = Number(result.quota) || 0;
            this.recruitedCount = Number(result.recruited_count) || 0;
        });
    }

    subscribeCurrentProfileUpdate() {
        return new Promise((resolve) => {
            const profileSub = this.profileService.currentProfileSubject.subscribe((val) => {
                if (!val) return;

                const { name, last_name, address1, address2, phone_number, city, province, zip } = val;
                this.influencer = {
                    ...this.influencer,
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
                resolve();
            });
            this.subscriptions.add(profileSub);
        });
    }

    initVariable() {
        this.influencer = {
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
            variant_id: null,
        };
        this.campaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
        this.type = this.activatedRoute.snapshot.paramMap.get('type');
    }

    back() {
        this.router.back();
    }

    showAddressInputDialog() {
        // Apply button will show after Influencer and productTypeList has got.
        // So you don't need worry influencer & productTypeList is empty
        const options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: {
                influencer: this.influencer,
                productTypeList: this.productTypeList,
            },
            dimAmount: 1,
            closeCallback: null,
        } as ExtendedShowModalOptions;
        this.modalService.showModal(InfoUpdateComponent, options).then((influencer: InfluencerInfo | null) => {
            if (influencer) {
                if (this.type === 'discover') {
                    this.applyCampaign(influencer);
                }

                if (this.type === 'myCampaign') {
                    this.acceptInvitation(influencer);
                }
            }
        });
    }

    // myCampaignInvited
    acceptInvitation(inf: InfluencerInfo) {
        this.commonService.saveProfile(inf);
        this.acceptInvitationReal(inf);
    }

    // Discover
    applyCampaign(inf: InfluencerInfo) {
        // TODO: Temp hack
        setTimeout(() => {
            this.dialogService.showLoading(this.vcRef);
        }, 500);

        const info = {
            ...inf,
            accept_commission: this.campaignInvitation.commission,
            accept_bonus: this.getBonus,
        };
        this.campaignService
            .applyDiscoveryCampaign(this.campaignId, info)
            .then(() => (this.status = 'Applied'))
            .finally(() => this.dialogService.hiddenLoading());
        this.commonService.saveProfile(inf);
    }

    acceptInvitationReal(inf: InfluencerInfo) {
        // TODO: Temp hack
        setTimeout(() => {
            this.dialogService.showLoading(this.vcRef);
        }, 500);

        if (this.campaignInvitation) {
            inf = {
                ...inf,
                commission: this.campaignInvitation.commission,
                bonus: this.getBonus,
                default_coupon_code: this.campaignInvitation.default_coupon_code,
            };
        }
        this.campaignsService.acceptCampaignInvitation(this.campaignId, true).then(
            (status) => {
                if (status.status === 'OK') {
                    this.campaignService.inputInfluencerInfo(this.campaignId, this.accountId, inf).then(() => {
                        this.completeForm = true;
                        this.dialogService.hiddenLoading();
                        setTimeout(() => {
                            this.router.navigate([`campaign-detail/timeline/${this.campaignId}`]);
                        }, 100);
                    });
                } else {
                    this.dialogService.hiddenLoading();
                }
            },
            () => {
                this.dialogService.hiddenLoading();
            }
        );
    }
}
