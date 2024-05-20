import type { UploadedImage } from '@prezly/uploadcare';
import UploadcareImage from '@uploadcare/nextjs-loader';
import classNames from 'classnames';

import { getUploadcareImage } from 'utils';

import styles from './Logo.module.scss';

// TODO: Remove after SDK is updated
enum LogoSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

interface Props {
    image: UploadedImage | null;
    size: `${LogoSize}`;
}

const REM = 16;

export function Logo({ image, size }: Props) {
    const uploadcareImage = getUploadcareImage(image);

    if (!uploadcareImage) {
        return null;
    }

    const { aspectRatio } = uploadcareImage;
    const isLandscape = uploadcareImage.aspectRatio > 1;

    let width;
    let height;

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

function getWidth(size: `${LogoSize}`) {
    switch (size) {
        case LogoSize.LARGE:
            return 15 * REM;
        case LogoSize.MEDIUM:
            return 10 * REM;
        default:
            return 5 * REM;
    }
}

function getHeight(size: `${LogoSize}`) {
    switch (size) {
        case LogoSize.LARGE:
            return 5.5 * REM;
        case LogoSize.MEDIUM:
            return 4.5 * REM;
        default:
            return 3.5 * REM;
    }
}
