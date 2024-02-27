'use client';

import { Transition } from '@headlessui/react';
import { translations } from '@prezly/theme-kit-nextjs';
import classNames from 'classnames';
import { Fragment, useState } from 'react';

import { FormattedMessage, useIntl, useLocale } from '@/adapters/client';
import { Button } from '@/components/Button';
import { IconLink } from '@/icons';

import styles from './StoryShareUrl.module.scss';

interface Props {
    url: string;
    buttonClassName?: string;
}

const TOOLTIP_HIDE_DELAY = 3000; // 3 seconds

export function StoryShareUrl({ url, buttonClassName }: Props) {
    const locale = useLocale();
    const [isTooltipShown, setIsTooltipShown] = useState(false);
    const { formatMessage } = useIntl();

    function handleCopyButtonClick() {
        window.navigator.clipboard.writeText(url);
        setIsTooltipShown(true);

        setTimeout(() => {
            setIsTooltipShown(false);
        }, TOOLTIP_HIDE_DELAY);
    }

    return (
        <div className={styles.container}>
            <Button
                variation="secondary"
                className={classNames(styles.paste, buttonClassName)}
                onClick={handleCopyButtonClick}
                title={formatMessage(translations.actions.copyShareUrl)}
            >
                <IconLink width={16} height={16} className={styles.icon} />
            </Button>
            <Transition
                show={isTooltipShown}
                as={Fragment}
                enterFrom={styles.transitionStart}
                enterTo={styles.transitionFinish}
                leaveFrom={styles.transitionFinish}
                leaveTo={styles.transitionStart}
            >
                <div className={styles.message}>
                    <IconLink width={16} height={16} className={styles.messageIcon} />
                    <FormattedMessage locale={locale} for={translations.misc.shareUrlCopied} />
                </div>
            </Transition>
        </div>
    );
}
