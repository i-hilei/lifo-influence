import { Component, OnInit } from '@angular/core';
import { Router } from '@src/app/native-helper/router-helper/router';
import { ActivatedRoute } from '@angular/router';
import { ProfileModel } from '@src/app/models/profile.model';
import { ProfileService } from '@src/app/services/profile.service';
import { images, ImageItem } from './sign-up-industry.common';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-sign-up-industry',
    templateUrl: './sign-up-industry.component.html',
    styleUrls: ['./sign-up-industry.component.scss'],
})
export class SignUpIndustryComponent implements OnInit {
    constructor(private router: Router, private activatedRoute: ActivatedRoute, public profileService: ProfileService) {}
    num = 0;

    imagesAll = cloneDeep(images);

    ngOnInit() {}

    select_industry(val: ImageItem, key: number) {
        this.num = 0;
        for (const i of this.imagesAll) {
            if (i.checked) {
                this.num += 1;
            }
            if (i.checked && i.title === val.title) {
                this.num -= 1;
            } else if (!i.checked && i.title === val.title) {
                this.num += 1;
            }
        }
        if (this.num < 4) {
            this.imagesAll[key].checked = !val.checked;
        }
        event.preventDefault();
    }

    confirmBtn() {
        if (this.num !== 0) {
            const arrAfter = [];
            for (const i of this.imagesAll) {
                if (i.checked) {
                    arrAfter.push(i.title);
                }
            }

            this.profileService
                .updateCurrentProfile({
                    industries: arrAfter,
                })
                .then((user) => {
                    this.profileService.currentProfile = new ProfileModel(user);
                    this.goNextPage();
                });
        }
    }

    skipToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    goNextPage() {
        const queryParamsCampaignId = this.activatedRoute.snapshot.queryParamMap.get('campaignId');
        if (queryParamsCampaignId) {
            this.router.navigate(['/sign-up-platform'], {
                queryParams: {
                    campaignId: queryParamsCampaignId,
                },
            });
        } else {
            this.router.navigate(['/sign-up-platform']);
        }
    }

    getCol(index: number) {
        return index % 3;
    }

    getRow(index: number) {
        return Math.floor(index / 3);
    }
}
