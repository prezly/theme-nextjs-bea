import { Transition } from '@headlessui/react';
import { IconLink, IconPaste } from '@prezly/icons';
import translations from '@prezly/themes-intl-messages';
import type { MouseEvent } from 'react';
import { Fragment, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import styles from './StoryShareUrl.module.scss';

interface Props {
    url: string;
}

const TOOLTIP_HIDE_DELAY = 3000; // 3 seconds

function StoryShareUrl({ url }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTooltipShown, setIsTooltipShown] = useState(false);
    const { formatMessage } = useIntl();

    function handleInputClick(event: MouseEvent<HTMLInputElement>) {
        const input = event.currentTarget;
        input.setSelectionRange(0, input.value.length);
    }

    function handleCopyButtonClick() {
        window.navigator.clipboard.writeText(url);
        setIsTooltipShown(true);

        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(0, 0);
            inputRef.current.blur();
        }

        setTimeout(() => {
            setIsTooltipShown(false);
        }, TOOLTIP_HIDE_DELAY);
    }

    return (
        <div className={styles.container}>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <input
                ref={inputRef}
                type="text"
                name="share-link"
                id="share-link"
                readOnly
                autoComplete="off"
                value={url}
                className={styles.input}
                // Selects full input value on click
                onClick={handleInputClick}
            />
            <button
                type="button"
                className={styles.paste}
                onClick={handleCopyButtonClick}
                title={formatMessage(translations.actions.copyShareUrl)}
            >
                <IconLink className={styles.mobileIcon} />
                <IconPaste className={styles.desktopIcon} />
            </button>
            <Transition
                show={isTooltipShown}
                as={Fragment}
                enterFrom={styles.transitionStart}
                enterTo={styles.transitionStart}
                leaveFrom={styles.transitionFinish}
                leaveTo={styles.transitionStart}
            >
                <div className={styles.message}>
                    <IconLink className={styles.mobileIcon} />
                    <FormattedMessage {...translations.misc.shareUrlCopied} />
                </div>
            </Transition>
        </div>
    );
}

export default StoryShareUrl;
