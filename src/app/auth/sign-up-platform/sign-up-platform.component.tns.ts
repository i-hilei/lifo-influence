import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions as Router } from '@nativescript/angular';
import { Page } from '@nativescript/core';

import { cloneDeep } from 'lodash';
import { ProfileModel } from '@models/profile.model';
import { ProfileService } from '@services/profile.service';
import { PlatformItem, platforms, contentTypes, getConfirmBody } from './sign-up-platform.common';
import { DialogsService } from '@services/dialogs.service';

@Component({
    selector: 'app-sign-up-platform',
    templateUrl: './sign-up-platform.component.tns.html',
    styleUrls: ['./sign-up-platform.component.tns.scss'],
})
export class SignUpPlatformComponent implements OnInit {
    platforms = cloneDeep(
        platforms.map((item) => {
            return {
                ...item,
                src: `${item.src.slice(0, item.src.length - 3)}png`,
            };
        })
    );

    contentTypes = cloneDeep(
        contentTypes.map((item) => {
            return {
                ...item,
                src: `${item.src.slice(0, item.src.length - 3)}png`,
            };
        })
    );

    loading = false;

    constructor(
        private router: Router,
        private page: Page,
        private dialogService: DialogsService,
        public vcr: ViewContainerRef,
        public profileService: ProfileService
    ) {}

    ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    selectItem(item: PlatformItem) {
        item.checked = !item.checked;
    }

    goNextPage() {
        this.router.navigate(['dashboard'], { clearHistory: true });
    }

    confirm() {
        this.loading = true;

        const body = getConfirmBody(this.platforms, this.contentTypes);
        this.profileService
            .updateCurrentProfile(body)
            .then((user) => {
                this.profileService.currentProfile = new ProfileModel(user);
                this.goNextPage();
            })
            .catch(() => {
                this.loading = false;
                this.dialogService.showErrorMessage();
            });
    }

    getCol(index: number) {
        return index % 2;
    }

    getRow(index: number) {
        return Math.floor(index / 2);
    }

    isFirstColumn(index: number) {
        return index % 2 === 0;
    }
}
