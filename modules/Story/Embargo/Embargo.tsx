import { formatToTimeZone } from 'date-fns-timezone';
import React, { FunctionComponent } from 'react';

import { EmbargoStory } from '../types';

import styles from './Embargo.module.scss';

type Props = {
    story: EmbargoStory;
};

const Embargo: FunctionComponent<Props> = ({ story }) => {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

    return (
        <div className={styles.embargo}>
            Embargo until{' '}
            {formatToTimeZone(new Date(story.published_at), 'MMMM d, YYYY H:mm z', { timeZone })}
        </div>
    );
};

export default Embargo;
