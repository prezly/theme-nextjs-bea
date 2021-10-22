import { Story } from '@prezly/sdk';
import { formatToTimeZone } from 'date-fns-timezone';
import React, { FunctionComponent } from 'react';

import styles from './Embargo.module.scss';

type Props = {
    story: Story;
};

const Embargo: FunctionComponent<Props> = ({ story }) => {
    if (!story.is_embargo || !story.published_at) {
        return null;
    }

    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

    return (
        <div className={styles.embargo}>
            Embargo until{' '}
            {formatToTimeZone(new Date(story.published_at), 'MMMM d, YYYY H:mm z', { timeZone })}
        </div>
    );
};

export default Embargo;
