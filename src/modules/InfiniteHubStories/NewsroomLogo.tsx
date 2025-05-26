import type { Newsroom } from '@prezly/sdk';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { getUploadcareImage } from '@/utils';

import styles from './NewsroomLogo.module.scss';

type Props = {
    newsroom: Newsroom;
};

export function NewsroomLogo({ newsroom }: Props) {
    const { active_theme_preset, display_name, newsroom_logo, square_logo, url } = newsroom;
    const image = getUploadcareImage(square_logo) ?? getUploadcareImage(newsroom_logo);

    const isSquareLogo = square_logo !== null;
    const isMainLogo = !isSquareLogo && newsroom_logo !== null;

    return (
        <a
            href={url}
            className={classNames(styles.newsroom, {
                [styles.withPadding]: isMainLogo || !image,
            })}
            target="_blank"
            title={`Go to site ${display_name}`}
            style={
                isMainLogo
                    ? {
                          color: active_theme_preset.settings.header_link_color,
                          backgroundColor: active_theme_preset.settings.header_background_color,
                      }
                    : undefined
            }
        >
            {image ? (
                <UploadcareImage alt={display_name} src={image.cdnUrl} width={373} height={373} />
            ) : (
                display_name
            )}
        </a>
    );
}
