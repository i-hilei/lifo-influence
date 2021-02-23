import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-store-tutorial',
    templateUrl: './store-tutorial.component.html',
    styleUrls: ['./store-tutorial.component.scss'],
})
export class StoreTutorialComponent implements OnInit {
    constructor(private modalService: NzModalService) {}

    ngOnInit(): void {}

    gotIt() {
        this.modalService.closeAll();
    }
}
