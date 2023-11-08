import { Story } from '@prezly/sdk';
import { translations } from '@prezly/theme-kit-intl';

import { FormattedDate, FormattedTime } from '@/theme-kit/intl/client';
import { FormattedMessage } from '@/theme-kit/intl/server';

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
                for={translations.misc.embargoMessage}
                values={{
                    date: (
                        <>
                            <FormattedDate value={new Date(story.published_at)} />{' '}
                            <FormattedTime value={new Date(story.published_at)} />
                        </>
                    ),
                }}
            />
        </div>
    );
}
