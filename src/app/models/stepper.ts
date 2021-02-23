import { CampaignModel, CampaignSteps } from '@src/app/models/campaign.model';
import * as dayjs from 'dayjs';

export enum StepStatuses {
    WAITING = 'waiting',
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

export enum ColorClass {
    RED = 'red',
    ORANGE = 'orange',
    GREEN = 'green',
}

interface IStepBadge {
    text: string;
    hasTimeIcon: boolean;
    colorClass: ColorClass;
    badgeType?: 'classic' | 'no-background';
}

interface WarningMessage {
    text: string;
    colorClass?: ColorClass;
    icon?: 'time' | 'done';
}

interface Description {
    text: string;
    colorClass?: ColorClass;
}

interface IStep {
    status: StepStatuses;
    title: {
        [StepStatuses.ACTIVE]: string;
        [StepStatuses.COMPLETED]: string;
    };
    badge: {
        [StepStatuses.WAITING]: IStepBadge;
        [StepStatuses.ACTIVE]: IStepBadge;
    };
}

class Step implements IStep {
    status: StepStatuses = StepStatuses.WAITING;
    title = {
        [StepStatuses.ACTIVE]: null,
        [StepStatuses.COMPLETED]: null,
    };
    badge: { [key in StepStatuses]: IStepBadge } = {
        [StepStatuses.WAITING]: null,
        [StepStatuses.ACTIVE]: null,
        [StepStatuses.COMPLETED]: null,
    };
    warningMessage: { [key in StepStatuses]: WarningMessage } = {
        [StepStatuses.ACTIVE]: null,
        [StepStatuses.WAITING]: null,
        [StepStatuses.COMPLETED]: null,
    };
    description: { [key in StepStatuses]: Description } = {
        [StepStatuses.ACTIVE]: null,
        [StepStatuses.WAITING]: null,
        [StepStatuses.COMPLETED]: null,
    };
    bonusGetted = false;

    setStatus(status: StepStatuses) {
        this.status = status;
        return this;
    }

    setBadge(badgeType: StepStatuses.WAITING | StepStatuses.ACTIVE, badge: IStepBadge) {
        this.badge[badgeType] = badge;
        return this;
    }

    setTitle(titleType: StepStatuses.WAITING | StepStatuses.ACTIVE | StepStatuses.COMPLETED, text: string) {
        this.title[titleType] = text;
        return this;
    }

    setWarningMessage(type: StepStatuses.WAITING | StepStatuses.ACTIVE | StepStatuses.COMPLETED, msgObj: WarningMessage) {
        this.warningMessage[type] = msgObj;
        return this;
    }

    setDescription(type: StepStatuses.WAITING | StepStatuses.ACTIVE | StepStatuses.COMPLETED, msgObj: Description) {
        this.description[type] = msgObj;
        return this;
    }
}

export class StepsPresets {
    shippingStep = new Step()
        .setTitle(StepStatuses.WAITING, 'Product on the way')
        .setTitle(StepStatuses.ACTIVE, 'Product on the way')
        .setTitle(StepStatuses.COMPLETED, 'Product Delivered');

    initialCommissionPaidStep = new Step()
        .setTitle(StepStatuses.WAITING, 'Initial Commission Pending')
        .setTitle(StepStatuses.ACTIVE, 'Initial Commission Pending')
        .setTitle(StepStatuses.COMPLETED, 'Initial Commission Paid');

    tryOutProductStep = new Step()
        .setTitle(StepStatuses.WAITING, 'Try Out The Product')
        .setTitle(StepStatuses.ACTIVE, 'Try Out The Product')
        .setTitle(StepStatuses.COMPLETED, 'Try Out The Product');

    draftPendingStep = new Step()
        .setTitle(StepStatuses.WAITING, 'Draft Pending')
        .setTitle(StepStatuses.ACTIVE, 'Draft Pending')
        .setTitle(StepStatuses.COMPLETED, 'Draft Submitted')
        .setBadge(StepStatuses.WAITING, {
            text: '72 hrs left',
            hasTimeIcon: true,
            badgeType: 'classic',
            colorClass: ColorClass.ORANGE,
        })
        .setBadge(StepStatuses.ACTIVE, {
            text: null,
            hasTimeIcon: true,
            badgeType: 'classic',
            colorClass: ColorClass.ORANGE,
        })
        .setWarningMessage(StepStatuses.ACTIVE, { text: null })
        .setWarningMessage(StepStatuses.COMPLETED, { text: null })
        .setDescription(StepStatuses.ACTIVE, { text: null })
        .setDescription(StepStatuses.COMPLETED, { text: null });

    draftReviewingStep = new Step()
        .setTitle(StepStatuses.WAITING, 'Draft Under Review')
        .setTitle(StepStatuses.ACTIVE, 'Draft Under Review')
        .setTitle(StepStatuses.COMPLETED, 'Draft Approved')
        .setWarningMessage(StepStatuses.ACTIVE, { text: null })
        .setWarningMessage(StepStatuses.COMPLETED, { text: null });

    postContentStep = new Step()
        .setTitle(StepStatuses.WAITING, 'Post Content')
        .setTitle(StepStatuses.ACTIVE, 'Post Content')
        .setTitle(StepStatuses.COMPLETED, 'Content Posted')
        .setBadge(StepStatuses.WAITING, {
            text: '24 hrs left',
            hasTimeIcon: true,
            badgeType: 'classic',
            colorClass: ColorClass.ORANGE,
        })
        .setBadge(StepStatuses.ACTIVE, {
            text: null,
            hasTimeIcon: true,
            badgeType: 'classic',
            colorClass: ColorClass.ORANGE,
        })
        .setWarningMessage(StepStatuses.ACTIVE, { text: null })
        .setWarningMessage(StepStatuses.COMPLETED, { text: null })
        .setDescription(StepStatuses.ACTIVE, { text: null })
        .setDescription(StepStatuses.COMPLETED, { text: null });

    commissionStep = new Step()
        .setTitle(StepStatuses.WAITING, 'Pending for Commission')
        .setTitle(StepStatuses.ACTIVE, 'Pending for Commission')
        .setTitle(StepStatuses.COMPLETED, 'Campaign Completed')
        .setDescription(StepStatuses.ACTIVE, { text: null })
        .setDescription(StepStatuses.COMPLETED, { text: null });

    steps: { [key in CampaignSteps]: Step } = {
        [CampaignSteps.shipping]: this.shippingStep,
        [CampaignSteps.initial_commission_paid]: this.initialCommissionPaidStep,
        [CampaignSteps.try_out_product]: this.tryOutProductStep,
        [CampaignSteps.draft_pending]: this.draftPendingStep,
        [CampaignSteps.draft_under_review]: this.draftReviewingStep,
        [CampaignSteps.draft_reviewed]: this.postContentStep,
        [CampaignSteps.pending_commission]: this.commissionStep,
        [CampaignSteps.complete]: null,
    };

    constructor(campaign: CampaignModel) {
        const initialStep = campaign.has_initial_payment ? CampaignSteps.initial_commission_paid : CampaignSteps.shipping;
        const currentCampaignStatus = campaign.campaignStatus ? campaign.campaignStatus : initialStep;
        let currentStepsStatus = StepStatuses.COMPLETED;
        Object.keys(this.steps).forEach((key) => {
            if (this.steps[key]) {
                if (key === currentCampaignStatus) {
                    this.steps[key].setStatus(StepStatuses.ACTIVE);
                    currentStepsStatus = StepStatuses.WAITING;
                } else {
                    this.steps[key].setStatus(currentStepsStatus);
                }
            }
        });
        this.setStatusAndMessage(campaign);
    }

    setStatusAndMessage(campaign: CampaignModel) {
        const influencerInfo = campaign.influencer_info;
        const postDeadLine = campaign.post_time;
        const { delivery_deadline, fast_deliver_window } = campaign.configuration;
        if (postDeadLine) {
            const formattedDate = dayjs(postDeadLine * 1000).format('MMM. D[th] HH:MM');
            this.steps.draft_reviewed.setBadge(StepStatuses.WAITING, {
                text: `Post by ${formattedDate}`,
                hasTimeIcon: true,
                colorClass: ColorClass.ORANGE,
            });
        }
        switch (true) {
            // Commission Paid
            case influencerInfo.isCommissionPaid:
                this.steps.pending_commission.setDescription(StepStatuses.COMPLETED, {
                    text: `Commission credited on ${dayjs(influencerInfo.commission_paid_time * 1000).format('MM/DD/YYYY')}`,
                });
                break;

            // Post Content / Post Overdue / Pending for Commission
            case influencerInfo.isContentReviewed:
                const submitPostTime = influencerInfo.submit_post_time;
                // Pending for commision
                if (submitPostTime) {
                    this.steps.pending_commission.setDescription(StepStatuses.ACTIVE, {
                        text:
                            'Congrats! Your campaign is launched! Our team will soon credit the commission to your account. ' +
                            'Usually this takes within 1 business day. ' +
                            'We will email you when your commission is ready.',
                    });
                } else {
                    // To be post
                    const contentReviewTime = influencerInfo.content_approve_time;
                    const deadLine = dayjs(campaign.post_time ? campaign.post_time * 1000 : dayjs(contentReviewTime * 1000).add(1, 'day'));
                    const now = dayjs();
                    const leftHours = deadLine.diff(now, 'hour') + 1;
                    let formattedDate = dayjs(postDeadLine * 1000).format('MM/DD');
                    if (campaign.start_post_time) {
                        const startLine = dayjs(campaign.start_post_time * 1000).format('MM/DD');
                        formattedDate = `${startLine} - ${formattedDate}`;
                    }
                    this.steps.draft_reviewed.setDescription(StepStatuses.ACTIVE, {
                        text: 'Post content to instagram and provide link below.',
                    });
                    this.steps.draft_under_review.setDescription(StepStatuses.COMPLETED, {
                        text: 'You can launch content on Instagram now.',
                    });
                    if (leftHours > 0) {
                        // <24hours
                        this.steps.draft_reviewed.setBadge(StepStatuses.ACTIVE, {
                            hasTimeIcon: true,
                            text: postDeadLine ? `Post Date ${formattedDate}` : `${leftHours} hrs left`,
                            colorClass: ColorClass.ORANGE,
                        });
                    } else {
                        // >24hours
                        this.steps.draft_reviewed.setBadge(StepStatuses.ACTIVE, {
                            hasTimeIcon: true,
                            text: 'Overdue',
                            colorClass: ColorClass.RED,
                        });

                        this.steps.draft_reviewed.setWarningMessage(StepStatuses.ACTIVE, {
                            text: 'Commission maybe reduced',
                            colorClass: ColorClass.RED,
                        });
                    }
                }
                break;

            // Reviewing
            case influencerInfo.isContentSubmitted:
                const startDate = dayjs(influencerInfo.product_received_time * 1000);
                const endDate = dayjs(influencerInfo.content_submit_time * 1000);
                const timeDiff = endDate.diff(startDate, 'hour') + 1;
                this.steps.draft_under_review.setDescription(StepStatuses.ACTIVE, {
                    text: 'Once the content is approved, we will notify you and you can launch content on instagram. ',
                });
                switch (true) {
                    case timeDiff >= 0 && timeDiff <= Number(fast_deliver_window):
                        this.steps.draft_pending.setWarningMessage(StepStatuses.COMPLETED, {
                            text: `Submitted within ${fast_deliver_window} hrs`,
                            icon: 'done',
                            colorClass: ColorClass.GREEN,
                        });
                        this.steps.draft_pending.bonusGetted = true;
                        break;
                    case timeDiff > Number(fast_deliver_window) && timeDiff <= Number(delivery_deadline):
                        break;
                    case timeDiff > Number(delivery_deadline):
                        this.steps.draft_pending.setWarningMessage(StepStatuses.COMPLETED, {
                            text: 'Commission maybe reduced',
                            colorClass: ColorClass.RED,
                        });
                        break;
                    default:
                        this.steps.draft_pending.setWarningMessage(StepStatuses.COMPLETED, {
                            text: '',
                            colorClass: ColorClass.RED,
                        });
                }
                break;

            // Draft Pending / Draft Overdue
            case influencerInfo.isProductReceived:
                const productReceivedTime = dayjs(influencerInfo.product_received_time * 1000);

                // More than 72hrs
                if (productReceivedTime.add(Number(delivery_deadline), 'hour').isBefore(dayjs())) {
                    this.steps.draft_pending.setBadge(StepStatuses.ACTIVE, {
                        text: 'Overdue',
                        hasTimeIcon: true,
                        badgeType: 'classic',
                        colorClass: ColorClass.RED,
                    });
                    this.steps.draft_pending.setWarningMessage(StepStatuses.ACTIVE, {
                        text: 'Commission maybe reduced',
                        colorClass: ColorClass.RED,
                        icon: 'time',
                    });
                } else {
                    const hoursLeft = Number(delivery_deadline) - dayjs().diff(productReceivedTime, 'hour');
                    const bonusHoursLeft = Number(fast_deliver_window) - dayjs().diff(productReceivedTime, 'hour');
                    this.steps.draft_pending.setBadge(StepStatuses.ACTIVE, {
                        text: `${hoursLeft}${hoursLeft > 1 ? ' hrs' : ' hr'} left`,
                        hasTimeIcon: true,
                        badgeType: 'classic',
                        colorClass: ColorClass.ORANGE,
                    });
                    if (bonusHoursLeft > 0) {
                        this.steps.draft_pending.setDescription(StepStatuses.ACTIVE, {
                            text: influencerInfo.accept_bonus
                                ? `Win an additional $${influencerInfo.accept_bonus} if upload within ${bonusHoursLeft} hrs`
                                : '',
                            colorClass: ColorClass.GREEN,
                        });
                    }
                }
                break;

            // Initial commission paid
            case influencerInfo.isUpfrontPaymentPaid:
                this.steps.initial_commission_paid.setTitle(StepStatuses.COMPLETED, 'Initial Commission Paid');
                break;

            // Shipping
            case influencerInfo.isAccepted:
                this.steps.draft_pending.setBadge(StepStatuses.WAITING, {
                    text: `${delivery_deadline} hrs left`,
                    hasTimeIcon: true,
                    badgeType: 'classic',
                    colorClass: ColorClass.ORANGE,
                });
                break;
        }
    }
}
