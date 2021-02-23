import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalService} from 'ng-zorro-antd-mobile';

@Component({
    selector: 'app-terms-of-use',
    templateUrl: './terms-of-use.component.html',
    styleUrls: ['./terms-of-use.component.scss'],
})
export class TermsOfUseComponent implements OnInit {
    @Input() showAgreeButton: boolean = true;
    @Output() isAgree: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    constructor(
        private modalService: ModalService,
    ) {
    }

    ngOnInit(): void {
    }

    close() {
        this.modalService.close();
    }

}
