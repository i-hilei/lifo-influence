import { Component, OnInit } from '@angular/core';
import { AppDownloadControlService } from './app-download-control.service';

@Component({
    selector: 'app-app-download-section',
    templateUrl: './app-download-section.component.html',
    styleUrls: ['./app-download-section.component.scss'],
})
export class AppDownloadSectionComponent implements OnInit {
    get isDownloadSectionShow() {
        return this.appDownloadService.isShowAddDownloadSection;
    }

    constructor(private appDownloadService: AppDownloadControlService) {}

    ngOnInit(): void {}

    hidden() {
        this.appDownloadService.isShowAddDownloadSection = false;
    }

    openAppStore() {
        this.appDownloadService.downloadIosApp();
    }
}
