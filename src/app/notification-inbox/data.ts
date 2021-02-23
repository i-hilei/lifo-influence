export enum NotificationDetailType {
    INVITE_ISSUE = 'invite_issue',
    PRODUCT_SHIPPING_ISSUE = 'product_shipping_issue',
    DRAFT_CONTENT_ISSUE = 'draft_content_issue',
    DUE_DATE_WARNING_ISSUE = 'due_date_warning',
    MONEY_ISSUE = 'money_issue',
}

export interface NotificationItem {
    type: NotificationDetailType;
    time: number;
    title: string;
    body: string;
    campaign_id: string;
    already_read?: boolean;
}

export const fakeData: NotificationItem[] = [
    {
        type: NotificationDetailType.DRAFT_CONTENT_ISSUE,
        time: new Date().getTime(),
        title: 'Draft Approved',
        body: 'Your Lifo campaign product shuo is delivered. Please visit Lifo Campaign Detail Page ...',
        campaign_id: '1i8ku6Cn8KvDtvjlv90w',
    },
    {
        type: NotificationDetailType.DUE_DATE_WARNING_ISSUE,
        time: new Date().getTime(),
        title: 'Draft Approved',
        body: 'Your Lifo campaign product shuo is delivered. Please visit Lifo Campaign Detail Page ...',
        campaign_id: '1i8ku6Cn8KvDtvjlv90w',
    },
    {
        type: NotificationDetailType.MONEY_ISSUE,
        time: new Date().getTime(),
        title: 'Draft Approved',
        body: 'Your Lifo campaign product shuo is delivered. Please visit Lifo Campaign Detail Page ...',
        campaign_id: '1i8ku6Cn8KvDtvjlv90w',
    },
    {
        type: NotificationDetailType.PRODUCT_SHIPPING_ISSUE,
        time: new Date().getTime(),
        title: 'Draft Approved',
        body: 'Your Lifo campaign product shuo is delivered. Please visit Lifo Campaign Detail Page ...',
        campaign_id: '1i8ku6Cn8KvDtvjlv90w',
    },
    {
        type: NotificationDetailType.INVITE_ISSUE,
        time: new Date().getTime(),
        title: 'Draft Approved',
        body: 'Your Lifo campaign product shuo is delivered. Please visit Lifo Campaign Detail Page ...',
        campaign_id: '1i8ku6Cn8KvDtvjlv90w',
    },
];
