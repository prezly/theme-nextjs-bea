import type { EmbargoStory } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';

import styles from './Embargo.module.scss';

type Props = {
    story: EmbargoStory;
};

function Embargo({ story }: Props) {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

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
}

export default Embargo;
