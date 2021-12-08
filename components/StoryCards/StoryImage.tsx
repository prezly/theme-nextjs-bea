import Image from '@prezly/uploadcare-image';
import classNames from 'classnames';
import type { FunctionComponent } from 'react';

import { useNewsroom } from '@/hooks';
import { StoryWithImage } from 'types';

import { getStoryThumbnail } from './lib';

import styles from './StoryImage.module.scss';

type Props = {
    story: StoryWithImage;
    className?: string;
    placeholderClassName?: string;
};

const StoryImage: FunctionComponent<Props> = ({ story, className, placeholderClassName }) => {
    const { name, newsroom_logo: logo } = useNewsroom();
    const image = getStoryThumbnail(story);

    if (image) {
        return (
            <Image
                imageDetails={image}
                alt={story.title}
                layout="fill"
                objectFit="cover"
                containerClassName={classNames(styles.imageContainer, className)}
                className={styles.image}
            />
        );
    }

    return (
        <span className={classNames(styles.placeholder, placeholderClassName)}>
            {logo && (
                <Image
                    imageDetails={logo}
                    layout="fill"
                    objectFit="contain"
                    alt="No image"
                    className={classNames(styles.imageContainer, styles.placeholderLogo, className)}
                />
            )}
            {!logo && name}
        </span>
    );
};

export default StoryImage;
