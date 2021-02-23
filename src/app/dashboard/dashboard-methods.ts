import { CampaignModel, OFFER_STATUS_TYPES, DISCOVER_STATUS_TYPES } from '@models/campaign.model';
import { ICampaignInvitation } from '@typings/campaign';
import { orderBy } from 'lodash';
import * as dayjs from 'dayjs';

export function orderCampaignList(
    campaignList: CampaignModel[],
    type: 'discovery' | 'mycampaign',
    invitations: { [key: string]: ICampaignInvitation },
    status?: OFFER_STATUS_TYPES
): CampaignModel[] {
    if (type === 'discovery') {
        return orderBy(
            campaignList,
            [
                (item) => {
                    const deadline = invitations[item.brand_campaign_id].inv_deadline * 1000;
                    return dayjs(deadline).isBefore(dayjs()); // expired true
                },
                (item) => {
                    return invitations[item.brand_campaign_id].campaign_status === 'Closed'; // filled true
                },
                (item) => {
                    return item.influencer_info.isApplied; // applied true
                },
                (item) => {
                    return item.create_time;
                },
            ],
            // expired, filled, applied, create_time
            ['asc', 'asc', 'asc', 'desc']
        );
    }

    if (type === 'mycampaign') {
        switch (status) {
            case OFFER_STATUS_TYPES.new:
                return orderBy(
                    campaignList.filter((campaign) => {
                        return campaign.offerStatus.statusType === OFFER_STATUS_TYPES.new && invitations[campaign.brand_campaign_id];
                    }),
                    [
                        (item) => {
                            const deadline = invitations[item.brand_campaign_id].inv_deadline * 1000;
                            return dayjs(deadline).isBefore(dayjs()); // expired true
                        },
                        (item) => {
                            return invitations[item.brand_campaign_id].campaign_status === 'Closed'; // filled true
                        },
                        (item) => {
                            return item.create_time;
                        },
                    ],
                    ['asc', 'asc', 'desc'] // expired, filled, create_time
                );
            case OFFER_STATUS_TYPES.active:
                return orderBy(
                    campaignList.filter((campaign) => campaign.offerStatus.statusType === OFFER_STATUS_TYPES.active),
                    [(item) => item?.influencer_info?.offer_accept_time],
                    ['desc']
                );
            case OFFER_STATUS_TYPES.completed:
                return orderBy(
                    campaignList.filter((campaign) => campaign.offerStatus.statusType === OFFER_STATUS_TYPES.completed),
                    [(item) => item?.influencer_info?.content_submit_time],
                    ['desc']
                );
            default:
                return [];
        }
    }
}
