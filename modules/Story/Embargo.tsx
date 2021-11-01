import { Story } from '@prezly/sdk';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';

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
                    date: (
                        <>
                            <FormattedDate
                                value={new Date(story.published_at)}
                                year="numeric"
                                month="long"
                                day="numeric"
                                timeZone={timeZone}
                            />{' '}
                            <FormattedTime
                                value={new Date(story.published_at)}
                                hour="2-digit"
                                minute="2-digit"
                                timeZoneName="short"
                                timeZone={timeZone}
                            />
                        </>
                    ),
                }}
            />
        </div>
    );
};

export default Embargo;
