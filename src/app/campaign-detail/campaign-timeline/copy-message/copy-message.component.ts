import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-copy-message',
    templateUrl: './copy-message.component.html',
    styleUrls: ['./copy-message.component.scss'],
})
export class CopyMessageComponent implements OnInit {
    @Input() type: 'success' | 'fail';
    @Input() message: string;

    constructor() {
    }

    ngOnInit(): void {
    }
}
