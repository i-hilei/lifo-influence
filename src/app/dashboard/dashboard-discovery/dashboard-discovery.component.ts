import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-dashboard-discovery',
    templateUrl: './dashboard-discovery.component.html',
    styleUrls: ['./dashboard-discovery.component.scss'],
})
export class DashboardDiscoveryComponent implements OnInit {
    constructor(private changeDetectionRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.changeDetectionRef.detectChanges();
    }
}
