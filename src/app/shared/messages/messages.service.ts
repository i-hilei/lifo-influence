import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IMessageEvent, IMessageOptions, MessageType} from '@typings/system.typings';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    messagesEvents: BehaviorSubject<IMessageEvent> = new BehaviorSubject<IMessageEvent>(null);

    constructor() {
    }

    showMessage(options: IMessageOptions) {
        if (!options.type) {
            options.type = MessageType.message;
        }
        this.messagesEvents.next({
            ...options,
            eventType: 'message_showing_start',
        });
        if (options.timeout) {
            setTimeout(() => {
                this.closeMessasge();
            }, options.timeout);
        }
    }

    closeMessasge() {
        this.messagesEvents.next({
            eventType: 'message_showing_end',
        });
    }
}
