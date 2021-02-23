import { Injectable } from '@angular/core';
import { isIOS } from '@shared/methods/common';
import { environment } from '@src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class AppDownloadControlService {
    private showSection = false;

    get isShowAddDownloadSection() {
        return this.showSection;
    }

    set isShowAddDownloadSection(val: boolean) {
        this.showSection = val;
    }

    constructor() {
        if (isIOS() && environment.host !== 'https://influencer-app.lifo.ai') {
            this.isShowAddDownloadSection = true;
        }
    }

    downloadIosApp() {
        location.href = 'https://itunes.apple.com/cn/app/lifo.ai/id1544233755?l=en&mt=8';
    }
}
