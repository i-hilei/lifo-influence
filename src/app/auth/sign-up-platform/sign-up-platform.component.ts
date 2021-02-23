import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileModel } from '@models/profile.model';
import { ProfileService } from '@services/profile.service';
import { PlatformItem, platforms, contentTypes, getConfirmBody } from './sign-up-platform.common';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-sign-up-platform',
    templateUrl: './sign-up-platform.component.html',
    styleUrls: ['./sign-up-platform.component.scss'],
})
export class SignUpPlatformComponent implements OnInit {
    platforms = cloneDeep(platforms);

    contentTypes = cloneDeep(contentTypes);

    constructor(private router: Router, private activatedRoute: ActivatedRoute, public profileService: ProfileService) {}

    ngOnInit(): void {}

    selectItem(item: PlatformItem) {
        item.checked = !item.checked;
    }

    goNextPage() {
        const queryParamsCampaignId = this.activatedRoute.snapshot.queryParamMap.get('campaignId');
        if (queryParamsCampaignId) {
            this.router.navigate([`/campaign-detail/${queryParamsCampaignId}`]);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }

    confirmBtn() {
        const body = getConfirmBody(this.platforms, this.contentTypes);

        this.profileService.updateCurrentProfile(body).then((user) => {
            this.profileService.currentProfile = new ProfileModel(user);
            this.goNextPage();
        });
    }
}
