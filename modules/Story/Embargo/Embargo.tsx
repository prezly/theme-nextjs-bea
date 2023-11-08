import { Story } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';
import { FormattedDate, FormattedTime } from 'react-intl';

import { FormattedMessage } from '@/theme-kit/intl/server';

import styles from './Embargo.module.scss';

type Props = {
    story: Story;
};

export function Embargo({ story }: Props) {
    if (!Story.isScheduledEmbargo(story) || !story.published_at) {
        return null;
    }

    const { timezone } = story.newsroom;

    return (
        <div className={styles.embargo}>
            <FormattedMessage
                for={translations.misc.embargoMessage}
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
