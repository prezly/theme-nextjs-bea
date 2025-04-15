import { Story } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-nextjs';

import { FormattedDate, FormattedMessage, FormattedTime } from '@/adapters/server';

import styles from './Embargo.module.scss';

type Props = {
    story: Story;
};

export function Embargo({ story }: Props) {
    if (!Story.isScheduledEmbargo(story) || !story.published_at) {
        return null;
    }

    return (
        <div className={styles.embargo}>
            <FormattedMessage
                locale={story.culture.code}
                for={translations.misc.embargoMessage}
                values={{
                    date: (
                        <>
                            <FormattedDate locale={story.culture.code} value={story.published_at} />{' '}
                            <FormattedTime locale={story.culture.code} value={story.published_at} />
                        </>
                    ),
                }}
            />
        </div>
    );
}
