import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Screen } from '@nativescript/core/platform';
import { Page } from '@nativescript/core';

import { cloneDeep } from 'lodash';
import { images, ImageItem } from './sign-up-industry.common';
import { ProfileModel } from '@src/app/models/profile.model';
import { ProfileService } from '@src/app/services/profile.service';
import { DialogsService } from '@services/dialogs.service';

@Component({
    selector: 'app-sign-up-industry',
    templateUrl: './sign-up-industry.component.tns.html',
    styleUrls: ['./sign-up-industry.component.tns.scss'],
})
export class SignUpIndustryComponent implements OnInit {
    imagesAll = cloneDeep(images);

    imageSize: number;

    PAGE_PADDING = 20;
    MARGIN_BETWEEN_IMAGE = 15;
    IMAGE_COUNT_EVERY_ROW = 3;

    loading = false;

    get selectedTopics() {
        return this.imagesAll.filter((img) => img.checked);
    }

    constructor(
        private router: RouterExtensions,
        public profileService: ProfileService,
        private page: Page,
        private dialogService: DialogsService,
        public vcr: ViewContainerRef
    ) {}

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.imageSize = (Screen.mainScreen.widthDIPs - this.PAGE_PADDING * 2 - this.MARGIN_BETWEEN_IMAGE * 2) / this.IMAGE_COUNT_EVERY_ROW;
    }

    selectTopic(topic: ImageItem) {
        if (topic.checked) {
            topic.checked = false;
            return;
        }

        if (this.selectedTopics.length < 3) {
            topic.checked = true;
        }
    }

    confirm() {
        if (this.selectedTopics.length !== 0) {
            this.loading = true;

            const arrAfter = this.selectedTopics.map((topic) => topic.title);

            this.profileService
                .updateCurrentProfile({
                    industries: arrAfter,
                })
                .then((user) => {
                    this.profileService.currentProfile = new ProfileModel(user);
                    this.goNextPage();
                })
                .catch((err) => {
                    this.loading = false;
                    console.error('updateProfile failed: ', err);
                });
        }
    }

    skipToDashboard() {
        this.router.navigate(['dashboard']);
    }

    goNextPage() {
        this.router.navigate(['auth/sign-up-platform']);
    }

    getCol(index: number) {
        return index % 3;
    }

    getRow(index: number) {
        return Math.floor(index / 3);
    }
}
