import { IProfile } from '@typings/profile.typings';

export interface PlatformItem {
    title: string;
    src: string;
    value: string;
    checked: boolean;
}

export const platforms: PlatformItem[] = [
    {
        title: 'Instagram',
        src: 'ic_instagram_rounded-rectangle.svg',
        value: 'instagram',
        checked: false,
    },
    {
        title: 'Tik tok',
        src: 'ic_tiktok_rounded-rectangle.svg',
        value: 'tik_tok',
        checked: false,
    },
    {
        title: 'Youtube',
        src: 'ic_youtube_rounded-rectangle.svg',
        value: 'youtube',
        checked: false,
    },
    {
        title: 'Twitch',
        src: 'ic_twitch_rounded-rectangle.svg',
        value: 'twitch',
        checked: false,
    },
    {
        title: 'Snapchat',
        src: 'ic_snapchat_rounded-rectangle.svg',
        value: 'snapchat',
        checked: false,
    },
    {
        title: 'Facebook',
        src: 'ic_facebook_rounded-rectangle.svg',
        value: 'facebook',
        checked: false,
    },
    {
        title: 'Pinterest',
        src: 'ic_pinterest_rounded-rectangle.svg',
        value: 'pinterest',
        checked: false,
    },
];

export const contentTypes: PlatformItem[] = [
    {
        title: 'Photo',
        src: 'photo.svg',
        value: 'photo',
        checked: false,
    },
    {
        title: 'Short Video',
        src: 'short_video.svg',
        value: 'short_video',
        checked: false,
    },
    {
        title: 'Long Video',
        src: 'long_video.svg',
        value: 'long_video',
        checked: false,
    },
    {
        title: 'Live video',
        src: 'live_video.svg',
        value: 'live_video',
        checked: false,
    },
];

export function getConfirmBody(platforms: PlatformItem[], contentTypes: PlatformItem[]) {
    const body: IProfile = {
        platforms: null,
        content_types: null,
    };

    const checkedPlatforms = platforms.filter((platform) => platform.checked);
    const checkedContentTypes = contentTypes.filter((platform) => platform.checked);

    if (checkedPlatforms.length !== 0) {
        body.platforms = checkedPlatforms.map((item) => item.value);
    }
    if (checkedContentTypes.length !== 0) {
        body.content_types = checkedContentTypes.map((item) => item.value);
    }

    return body;
}
