import type { EmbargoStory } from '@prezly/theme-kit-core';
import { translations } from '@prezly/theme-kit-intl';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';

import styles from './Embargo.module.scss';

type Props = {
    story: EmbargoStory;
};

function Embargo({ story }: Props) {
    const { timezone } = story.newsroom;

    return (
        <div className={styles.embargo}>
            <FormattedMessage
                {...translations.misc.embargoMessage}
                values={{
                    date: (
                        <>
                            <FormattedDate
                                value={new Date(story.published_at)}
                                year="numeric"
                                month="long"
                                day="numeric"
                                timeZone={timezone}
                            />{' '}
                            <FormattedTime
                                value={new Date(story.published_at)}
                                hour="2-digit"
                                minute="2-digit"
                                timeZoneName="short"
                                timeZone={timezone}
                            />
                        </>
                    ),
                }}
            />
        </div>
    );
}

export default Embargo;
