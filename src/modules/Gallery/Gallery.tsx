import { NewsroomGallery } from '@prezly/sdk';
import { Galleries, type Locale } from '@prezly/theme-kit-nextjs';

import { ContentRenderer } from '@/components/ContentRenderer';
import { PageTitle } from '@/components/PageTitle';
import { SocialShare } from '@/components/SocialShare';
import type { SocialNetwork } from '@/theme-settings';

import { DownloadLink } from './DownloadLink';

import styles from './Gallery.module.scss';

interface Props {
    localeCode: Locale.Code;
    gallery: NewsroomGallery;
    href: string;
    socialNetworks: SocialNetwork[];
}

export function Gallery({ localeCode, gallery, href, socialNetworks }: Props) {
    const { name, description, content, uuid } = gallery;

    const downloadUrl =
        gallery.uploadcare_group_uuid &&
        Galleries.getArchiveDownloadUrl(gallery.uploadcare_group_uuid, gallery.name);

    return (
        <div className={styles.container}>
            <PageTitle className={styles.title} title={name} subtitle={description} />

            <div className={styles.links}>
                {downloadUrl && <DownloadLink localeCode={localeCode} href={downloadUrl} />}
                {gallery.status === NewsroomGallery.Status.PUBLIC &&
                    socialNetworks.length > 0 &&
                    href && (
                        <SocialShare
                            summary={description ?? undefined}
                            socialNetworks={socialNetworks}
                            url={href}
                            title={name}
                            className={styles.shareLinks}
                            uuid={uuid}
                            trackingContext="Gallery"
                        />
                    )}
            </div>

            <ContentRenderer nodes={JSON.parse(content)} />
        </div>
    );
}
