import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'ng-zorro-antd-mobile';

@Component({
    selector: 'app-purchase-sample-modal',
    templateUrl: './purchase-sample-modal.component.html',
    styleUrls: ['./purchase-sample-modal.component.scss'],
})
export class PurchaseSampleModalComponent implements OnInit {
    @Output() onConfirmClicked = new EventEmitter();

    constructor(private modalService: ModalService) {}

    ngOnInit(): void {}

    confirm() {
        this.onConfirmClicked.emit();
    }
}
