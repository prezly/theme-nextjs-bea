import { Story } from '@prezly/sdk';
import { formatToTimeZone } from 'date-fns-timezone';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './Embargo.module.scss';

type Props = {
    story: Story;
};

const messages = defineMessages({
    embargoMessage: {
        defaultMessage: 'Embargo until {date}',
    },
});

const Embargo: FunctionComponent<Props> = ({ story }) => {
    if (!story.is_embargo || !story.published_at) {
        return null;
    }

    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

    return (
        <div className={styles.embargo}>
            <FormattedMessage
                {...messages.embargoMessage}
                values={{
                    date: formatToTimeZone(new Date(story.published_at), 'MMMM d, YYYY H:mm z', {
                        timeZone,
                    }),
                }}
            />
        </div>
    );
};

export default Embargo;
