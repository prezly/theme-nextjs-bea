import type { UploadedImage } from '@prezly/uploadcare';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { useDevice } from '@/hooks';
import { getUploadcareImage } from '@/utils';

import styles from './Logo.module.scss';

enum LogoSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

interface Props {
    image: UploadedImage | null;
    size: string;
}

const REM = 16;

export function Logo({ image, size: preferredSize }: Props) {
    const device = useDevice();
    const uploadcareImage = getUploadcareImage(image);

    if (!uploadcareImage) {
        return null;
    }

    const { aspectRatio } = uploadcareImage;
    const isLandscape = uploadcareImage.aspectRatio > 1;

    let width;
    let height;
    let size = isSupportedLogoSize(preferredSize) ? preferredSize : LogoSize.MEDIUM;

    // For mobile we want to override the logo size so it looks good
    if (device.isMobile) {
        size = isLandscape ? LogoSize.MEDIUM : LogoSize.SMALL;
    }

    if (aspectRatio > 1) {
        // landscape
        width = getWidth(size);
        height = width / aspectRatio;
    } else {
        // portrait
        height = getHeight(size);
        width = height / aspectRatio;
    }

    return (
        <UploadcareImage
            src={uploadcareImage.cdnUrl}
            alt="" // This is a presentation image, the link has text inside <h1>, no need to have it twice. See [DEV-12311].
            className={classNames(styles.logo, {
                [styles.landscape]: isLandscape,
                [styles.portrait]: !isLandscape,
                [styles.small]: size === 'small',
                [styles.medium]: size === 'medium',
                [styles.large]: size === 'large',
            })}
            width={width}
            height={height}
        />
    );
}

function isSupportedLogoSize(size: string): size is LogoSize {
    return size === 'small' || size === 'medium' || size === 'large';
}

function getWidth(size: LogoSize) {
    switch (size) {
        case LogoSize.LARGE:
            return 15 * REM;
        case LogoSize.MEDIUM:
            return 10 * REM;
        default:
            return 5 * REM;
    }
}

function getHeight(size: LogoSize) {
    switch (size) {
        case LogoSize.LARGE:
            return 5.5 * REM;
        case LogoSize.MEDIUM:
            return 4.5 * REM;
        default:
            return 3.5 * REM;
    }
}
