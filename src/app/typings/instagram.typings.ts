export interface IInstagramFullData {
    biography: string;
    business_category_name: string;
    business_email: string;
    category_enum: any;
    connected_fb_page: any;
    country_block: boolean;
    edge_felix_video_timeline: IEdgeData;
    edge_follow: IEdgeData;
    edge_followed_by: IEdgeData;
    edge_media_collections: IEdgeData;
    edge_mutual_followed_by: IEdgeData;
    edge_owner_to_timeline_media: IEdgeData;
    edge_related_profiles: IEdgeData;
    edge_saved_media: IEdgeData;
    external_url: any;
    external_url_linkshimmed: any;
    followed_by_viewer: boolean;
    follows_viewer: boolean;
    full_name: string;
    has_ar_effects: boolean;
    has_blocked_viewer: boolean;
    has_channel: boolean;
    has_clips: boolean;
    has_guides: boolean;
    has_requested_viewer: boolean;
    highlight_reel_count: number;
    id: string;
    is_business_account: boolean;
    is_joined_recently: boolean;
    is_private: boolean;
    is_verified: boolean;
    overall_category_name: any;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    requested_by_viewer: boolean;
    restricted_by_viewer: any;
    username: string;
}

export interface IEdgeData {
    count: number;
    edges?: any[];
    page_info?: {
        end_cursor: any;
        has_next_page: boolean;
    };
}
