import Image from '@prezly/uploadcare-image';
import type { FunctionComponent } from 'react';

import { useNewsroom } from '@/hooks/useNewsroom';
import { StoryWithImage } from '@/modules/Stories';

import styles from './StoryImage.module.scss';

type Props = {
    story: StoryWithImage;
};

const StoryImage: FunctionComponent<Props> = ({ story }) => {
    const newsroom = useNewsroom();
    const image = JSON.parse(story.header_image as string);

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

    const logo = newsroom?.newsroom_logo;

    return (
        <div className={styles.placeholder}>
            {!!logo && (
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
