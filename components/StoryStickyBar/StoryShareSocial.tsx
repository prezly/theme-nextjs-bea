import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';

import { IconFacebook, IconLinkedin, IconTwitter } from '@/icons';

import styles from './StoryShareSocial.module.scss';

interface Props {
    url: string;
}

const messages = defineMessages({
    actionShare: {
        defaultMessage: 'Share:',
    },
});

const StoryShareSocial: FunctionComponent<Props> = ({ url }) => (
    <div className={styles.container}>
        <span>
            <FormattedMessage {...messages.actionShare} />
        </span>
        <TwitterShareButton className={styles.button} url={url}>
            <IconTwitter className={styles.icon} />
        </TwitterShareButton>
        <FacebookShareButton className={styles.button} url={url}>
            <IconFacebook className={styles.icon} />
        </FacebookShareButton>
        <LinkedinShareButton className={styles.button} url={url}>
            <IconLinkedin className={styles.icon} />
        </LinkedinShareButton>
    </div>
);

export default StoryShareSocial;
