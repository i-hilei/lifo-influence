export interface IRequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    data?: object;
    api?: string;
}

export enum MessageLevel {
    success = 'success',
    warning = 'warning',
    error = 'error'
}

export enum MessageType {
    message = 'message',
    prompt = 'prompt',
    custom = 'custom'
}

export interface IMessageEvent extends IMessageOptions {
    eventType: 'message_showing_start' | 'message_showing_end';
}

export interface IMessageOptions {
    showOverlay?: boolean;
    type?: MessageType;
    messageLevel?: MessageLevel;
    text?: string;
    timeout?: number;
}
