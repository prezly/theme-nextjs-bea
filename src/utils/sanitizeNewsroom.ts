import type { Newsroom, NewsroomRef } from '@prezly/sdk';

export type PublicNewsroomRef = Pick<NewsroomRef, 'url' | 'uuid'>;

export type PublicNewsroom = Pick<
    Newsroom,
    | 'display_name'
    | 'is_hub'
    | 'name'
    | 'newsroom_logo'
    | 'public_galleries_number'
    | 'square_logo'
    | 'stories_number'
    | 'url'
    | 'uuid'
> & {
    active_theme_preset: {
        settings: {
            header_background_color: string;
            header_link_color: string;
        };
    };
};

export function sanitizeNewsrooms(newsrooms: Newsroom[]): PublicNewsroom[] {
    return newsrooms.map(sanitizeNewsroom);
}

export function sanitizeNewsroom(newsroom: Newsroom): PublicNewsroom {
    const {
        active_theme_preset,
        display_name,
        is_hub,
        name,
        newsroom_logo,
        public_galleries_number,
        square_logo,
        stories_number,
        url,
        uuid,
    } = newsroom;

    return {
        active_theme_preset: {
            settings: {
                header_background_color: active_theme_preset.settings.header_background_color,
                header_link_color: active_theme_preset.settings.header_link_color,
            },
        },
        display_name,
        is_hub,
        name,
        newsroom_logo,
        public_galleries_number,
        square_logo,
        stories_number,
        url,
        uuid,
    };
}

export function sanitizeNewsroomRef(newsroom: NewsroomRef): PublicNewsroomRef {
    return { url: newsroom.url, uuid: newsroom.uuid };
}
