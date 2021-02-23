import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessagesService} from '@shared/messages/messages.service';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {IMessageOptions, MessageType} from '@typings/system.typings';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
    MessageType = MessageType;
    lastMessageOptions: IMessageOptions;
    showMessage: boolean = false;
    private unsubscribe: Subject<void> = new Subject();

    constructor(private messagesService: MessagesService) {
        this.messagesService.messagesEvents
            .pipe(
                takeUntil(this.unsubscribe),
                filter(event => !!event),
            )
            .subscribe(event => {
                switch (event.eventType) {
                    case 'message_showing_start':
                        this.lastMessageOptions = event;
                        this.showMessage = true;
                        break;
                    case 'message_showing_end':
                        this.showMessage = false;
                        break;
                }
            });
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    closeMessage() {
        this.messagesService.closeMessasge();
    }

}
