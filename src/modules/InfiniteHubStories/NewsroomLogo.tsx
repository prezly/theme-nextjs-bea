import type { Newsroom } from '@prezly/sdk';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { getUploadcareImage } from '@/utils';

import styles from './NewsroomLogo.module.scss';

type Props = {
    newsroom: Newsroom;
};

export function NewsroomLogo({ newsroom }: Props) {
    const { newsroom_logo, square_logo } = newsroom;
    const image =
        getUploadcareImage(newsroom.square_logo) ?? getUploadcareImage(newsroom.newsroom_logo);

    const isSquareLogo = square_logo !== null;
    const isMainLogo = !isSquareLogo && newsroom_logo !== null;

    return (
        <a
            href={newsroom.url}
            className={classNames(styles.newsroom, {
                [styles.withPadding]: isMainLogo || !image,
            })}
            target="_blank"
            title={`Go to site ${newsroom.display_name}`}
            style={
                isMainLogo
                    ? {
                          color: newsroom.active_theme_preset.settings.text_color,
                          backgroundColor: newsroom.active_theme_preset.settings.background_color,
                      }
                    : undefined
            }
        >
            {image ? (
                <UploadcareImage
                    alt={newsroom.display_name}
                    src={image.cdnUrl}
                    width={373}
                    height={373}
                />
            ) : (
                newsroom.display_name
            )}
        </a>
    );
}
