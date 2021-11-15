import Image from '@prezly/uploadcare-image';
import type { FunctionComponent } from 'react';

import { useNewsroom } from '@/hooks';
import { StoryWithImage } from 'types';

import { getStoryThumbnail } from './lib';

import styles from './StoryImage.module.scss';

type Props = {
    story: StoryWithImage;
};

const StoryImage: FunctionComponent<Props> = ({ story }) => {
    const { newsroom_logo: logo } = useNewsroom();
    const image = getStoryThumbnail(story);

    if (image) {
        return (
            <Image
                imageDetails={image}
                alt={story.title}
                layout="fill"
                objectFit="cover"
                containerClassName={styles.imageContainer}
                className={styles.image}
            />
        );
    }

    return (
        <div className={styles.placeholder}>
            {logo && (
                <Image
                    imageDetails={logo}
                    layout="fill"
                    objectFit="contain"
                    alt="No image"
                    className={styles.placeholderLogo}
                />
            )}
        </div>
    );
};

export default StoryImage;
