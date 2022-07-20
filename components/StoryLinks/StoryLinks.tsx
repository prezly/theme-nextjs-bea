import { IconFacebook, IconLinkedin, IconTwitter } from '@prezly/icons';
import { SocialShareButton } from '@prezly/themes-ui-components';
import classNames from 'classnames';

import StoryShareUrl from './StoryShareUrl';

import styles from './StoryLinks.module.scss';

interface Props {
    url: string | null;
    className?: string;
    buttonClassName?: string;
    iconClassName?: string;
}

function StoryLinks({ url, buttonClassName, className, iconClassName }: Props) {
    if (!url) {
        return null;
    }

    return (
        <div className={classNames(styles.container, className)}>
            <SocialShareButton
                network="facebook"
                url={url}
                className={classNames(styles.button, buttonClassName)}
            >
                <IconFacebook
                    width={16}
                    height={16}
                    className={classNames(styles.icon, iconClassName)}
                />
            </SocialShareButton>
            <SocialShareButton
                network="twitter"
                url={url}
                className={classNames(styles.button, buttonClassName)}
            >
                <IconTwitter
                    width={16}
                    height={16}
                    className={classNames(styles.icon, iconClassName)}
                />
            </SocialShareButton>
            <SocialShareButton
                network="linkedin"
                url={url}
                className={classNames(styles.button, buttonClassName)}
            >
                <IconLinkedin
                    width={16}
                    height={16}
                    className={classNames(styles.icon, iconClassName)}
                />
            </SocialShareButton>
            <StoryShareUrl url={url} buttonClassName={buttonClassName} />
        </div>
    );
}

export default StoryLinks;
