import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDownloadControlService } from '@shared/components/app-download-section/app-download-control.service';

@Component({
    selector: 'app-get-started',
    templateUrl: './get-started.component.html',
    styleUrls: ['./get-started.component.scss'],
})
export class GetStartedComponent implements OnInit {
    lotteryId: string;
    source: string;

    constructor(
        public deviceDetectorService: DeviceDetectorService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private downloadService: AppDownloadControlService
    ) {
        this.lotteryId = this.activatedRoute.snapshot.queryParamMap.get('lotteryId');
        this.source = this.activatedRoute.snapshot.queryParamMap.get('source');
    }

    ngOnInit(): void {}

    navigate(target) {
        this.router.navigate([target], { queryParamsHandling: 'preserve' });
    }

    downloadIosApp() {
        this.downloadService.downloadIosApp();
    }
}
