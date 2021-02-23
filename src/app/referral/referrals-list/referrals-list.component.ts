import {Component, OnInit} from '@angular/core';
import {ReferralsService} from '@src/app/referral/referrals.service';
import {IInstagramNotableUser} from '@typings/profile.typings';
import {ProfileService} from '@services/profile.service';
import {ToastService} from 'ng-zorro-antd-mobile';
import {MessagesService} from '@shared/messages/messages.service';
import {MessageLevel, MessageType} from '@typings/system.typings';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-referrals-list',
    templateUrl: './referrals-list.component.html',
    styleUrls: ['./referrals-list.component.scss'],
})
export class ReferralsListComponent implements OnInit {
    availableReferrals: IInstagramNotableUser[] = [];
    inviteList: string[] = [];
    lotteryId: string = null;
    isLoading: boolean = false;
    referralLink: string;

    constructor(
        private referralsService: ReferralsService,
        public profileService: ProfileService,
        public messagesService: MessagesService,
        private toast: ToastService,
        private activatedRoute: ActivatedRoute,
        private location: Location,
    ) {
        this.lotteryId = this.activatedRoute.snapshot.paramMap.get('lottery_id');
        this.referralsService.getInvitationLink(this.lotteryId ? this.lotteryId : null)
            .then(code => {
                this.referralLink = `${window.location.origin}/sign-up?code=${code}`;
            });
    }

    ngOnInit(): void {
        this.getAvailableReferrals();
    }

    getAvailableReferrals() {
        this.isLoading = true;
        this.referralsService.getPossibleReferrals()
            .then(res => {
                if (!res.length) {
                    this.isLoading = false;
                    this.messagesService.showMessage({
                        type: MessageType.message,
                        messageLevel: MessageLevel.error,
                        text: 'We are unable to find your follower information. You can copy the link above and send to your influencer friends.',
                        showOverlay: true,
                    });
                    return;
                }
                res.forEach(referral => {
                    referral.invite = true;
                });
                this.availableReferrals = res;
                this.inviteList = [];
                this.isLoading = false;
            });
    }

    changeInviteReferralsList(instagramId) {
        const itemToChange = this.availableReferrals.find(referral => referral.username === instagramId);
        if (itemToChange && !itemToChange.is_registered) {
            itemToChange.invite = !itemToChange.invite;
        }
    }

    getReferralsToInviteCount() {
        return this.availableReferrals.filter(referral => referral.invite && !referral.invited && !referral.is_registered).length;
    }

    inviteReferrals() {
        const referralsToInvite = this.availableReferrals
            .filter(referral => referral.invite && !referral.invited && !referral.is_registered)
            .map(referral => {
                return {
                    instagram_id: referral.username,
                    email: referral.email,
                };
            });
        if (referralsToInvite.length === 0) {
            this.messagesService.showMessage({
                type: MessageType.message,
                messageLevel: MessageLevel.error,
                text: 'Please, select referrals to invite',
                showOverlay: true,
            });
            return;
        }

        // Don't need to wait until message sent
        this.messagesService.showMessage({
            type: MessageType.message,
            messageLevel: MessageLevel.success,
            text: 'Referrals invited successfully!',
            showOverlay: true,
        });

        this.referralsService.inviteReferrals({
            invitation_link: this.referralLink,
            referee_list: referralsToInvite,
        }, this.lotteryId)
            .then(() => {
                // this.getAvailableReferrals();
                this.availableReferrals.filter(referral => referral.invite).forEach(referral => {
                    referral.invited = true;
                });
            })
            .catch(error => {
                this.messagesService.showMessage({
                    type: MessageType.message,
                    messageLevel: MessageLevel.error,
                    text: error.message,
                    showOverlay: true,
                });
            });
    }

    copyToClipboard() {
        let textarea;
        let result;

        try {
            textarea = document.createElement('textarea');
            textarea.setAttribute('readonly', true);
            textarea.setAttribute('contenteditable', true);
            textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
            textarea.value = this.referralLink;

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            const range = document.createRange();
            range.selectNodeContents(textarea);

            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            textarea.setSelectionRange(0, textarea.value.length);
            result = document.execCommand('copy');
        } catch (err) {
            console.error(err);
            result = null;
        } finally {
            document.body.removeChild(textarea);
        }
        this.toast.success('Link copied successfully!', 2000);
    }

    back() {
        this.location.back();
    }
}
