import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '@services/campaign.service';

import HelloSign from 'hellosign-embedded';
import { Subscription } from 'rxjs';
import { Intercom } from 'ng-intercom';
import { OfferDetail } from '@src/app/typings/campaign.typings';

@Component({
    selector: 'app-sign-contract',
    templateUrl: './sign-contract.component.html',
    styleUrls: ['./sign-contract.component.scss'],
})
export class SignContractComponent implements OnInit, OnDestroy {
    campaignId;
    accountId;

    offerDetail: OfferDetail;

    API_KEY = '1d21122d55d199d3a813b23eae0f14a8993fd65dc59b02ddb7161863e95fcd84';
    CLIENT_ID = 'ed13bd512148181319db3152c8749516';

    client = new HelloSign();

    influencerEmail = '';
    completeSigning = false;

    subscriptions: Subscription[] = [];

    constructor(private activatedRoute: ActivatedRoute, private campaignService: CampaignService, public intercom: Intercom) {
        this.campaignId = this.activatedRoute.snapshot.paramMap.get('campaignId');
        this.accountId = this.activatedRoute.snapshot.paramMap.get('accountId');
    }

    async ngOnInit() {
        const campaignDetail = await this.campaignService.getInfluencerCampaignDetail(this.campaignId, this.accountId);
        this.subscriptions.push(
            campaignDetail.subscribe((result) => {
                if (result && result['influencer_public_profile']) {
                    this.offerDetail = {
                        compensation_message: result['influencer_public_profile']['compensation_message'],
                        product_message: result['influencer_public_profile']['product_message'],
                        product_image_list: result['influencer_public_profile']['product_image_list'],
                        ...result['influencer_public_profile']['offer_detail'],
                    };
                    this.influencerEmail = result['influencer_public_profile']['inf_email'];
                }
            })
        );
    }

    async signContract() {
        // Influencer Email Change
        this.subscriptions.push(
            this.campaignService.getSignUrl(this.campaignId, this.influencerEmail).subscribe(
                (url) => {
                    if (url['status'] === 'FAILED_PRECONDITION') {
                        // this.notification.addMessage({
                        //     type: AlertType.Error,
                        //     title: 'Contract Error',
                        //     message: 'Failed to find your contract.',
                        //     duration: 3000,
                        // });
                        return;
                    }
                    const embedUrl = url['embedded']['sign_url'];

                    this.intercom.update({ hide_default_launcher: true });
                    this.client.open(embedUrl, {
                        clientId: this.CLIENT_ID,
                        skipDomainVerification: true,
                    });

                    this.client.on('sign', (data) => {
                        // console.log('The document has been signed!');
                        // console.log(`Signature ID: ${  data.signatureId}`);
                        this.completeSign(data.signatureId);
                    });
                },
                (error) => {
                    // this.notification.addMessage({
                    //     type: AlertType.Error,
                    //     title: 'Contract Error',
                    //     message: error,
                    //     duration: 3000,
                    // });
                }
            )
        );
    }

    completeSign(signatureId) {
        this.subscriptions.push(
            this.campaignService.completeSign(this.campaignId, signatureId).subscribe((result) => {
                this.completeSigning = true;
                // this.notification.addMessage({
                //     type: AlertType.Success,
                //     title: 'Contract Signed',
                //     message: 'Your have signed your contract.',
                //     duration: 3000,
                // });
                this.intercom.update({ hide_default_launcher: false });
            })
        );
    }

    followLifo() {
        window.open('https://www.instagram.com/lifoinc/', '_blank');
    }

    ngOnDestroy() {
        this.client.close();
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }
}
