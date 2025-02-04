import type { NewsroomGallery } from '@prezly/sdk';
import type { Locale } from '@prezly/theme-kit-nextjs';
import { Galleries } from '@prezly/theme-kit-nextjs';

import { ContentRenderer } from '@/components/ContentRenderer';
import { PageTitle } from '@/components/PageTitle';
import { SocialShare } from '@/components/SocialShare';
import type { SocialNetwork } from 'theme-settings';

import { DownloadLink } from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    localeCode: Locale.Code;
    gallery: NewsroomGallery;
    href: string;
    socialNetworks: SocialNetwork[];
}

export function Gallery({ localeCode, gallery, href, socialNetworks }: Props) {
    const { name, description, content } = gallery;

    const downloadUrl =
        gallery.uploadcare_group_uuid &&
        Galleries.getArchiveDownloadUrl(gallery.uploadcare_group_uuid, gallery.name);

    return (
        <div className={styles.container}>
            <PageTitle className={styles.title} title={name} subtitle={description} />

            <div className={styles.links}>
                {downloadUrl && <DownloadLink localeCode={localeCode} href={downloadUrl} />}
                {socialNetworks.length > 0 && href && (
                    <SocialShare
                        className={styles.shareLinks}
                        socialNetworks={socialNetworks}
                        trackingContext="Gallery"
                        url={href}
                        uuid={gallery.uuid}
                    />
                )}
            </div>

            <ContentRenderer nodes={JSON.parse(content)} />
        </div>
    );
}
