import {NgModule} from '@angular/core';
import {MessagesComponent} from './messages.component';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        MessagesComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        MessagesComponent,
    ],
})
export class MessagesModule {
}
