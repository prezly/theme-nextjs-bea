import { translations, useIntl } from '@prezly/theme-kit-nextjs';
import { Fragment, type ReactNode, useState } from 'react';

import { Divider } from '@/components/Divider';
import {
    IconBluesky,
    IconFacebook,
    IconFileDown,
    IconFolderDown,
    IconLink,
    IconLinkedin,
    IconMastodon,
    IconPinterest,
    IconReddit,
    IconTelegram,
    IconText,
    IconThreads,
    IconTwitter,
    IconWhatsApp,
} from '@/icons';

import styles from './SharePlaceholder.module.scss';
import { Transition } from '@headlessui/react';
import { Button } from '@/components/Button';

export function SharePlaceholder() {
    const { formatMessage } = useIntl();

    return (
        <>
            <Divider />
            <h2 className={styles.title}>{trim(formatMessage(translations.actions.share))}</h2>
            <div>
                <div className={styles.socials}>
                    <DisabledTooltip>
                        <IconLinkedin className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconFacebook className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconTwitter className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconMastodon className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconPinterest className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconReddit className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconWhatsApp className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconThreads className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconTelegram className={styles.socialIcon} />
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <IconBluesky className={styles.socialIcon} />
                    </DisabledTooltip>
                </div>
                <div className={styles.actions}>
                    <DisabledTooltip>
                        <Button
                            className={styles.action}
                            disabled
                            icon={IconLink}
                            variation="secondary"
                        >
                            {formatMessage(translations.actions.copyShareUrl)}
                        </Button>
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <Button
                            className={styles.action}
                            disabled
                            icon={IconText}
                            variation="secondary"
                        >
                            {formatMessage(translations.actions.copyText)}
                        </Button>
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <Button
                            className={styles.action}
                            disabled
                            icon={IconFolderDown}
                            variation="secondary"
                        >
                            {formatMessage(translations.actions.downloadAssets)}
                        </Button>
                    </DisabledTooltip>
                    <DisabledTooltip>
                        <Button
                            className={styles.action}
                            disabled
                            icon={IconFileDown}
                            variation="secondary"
                        >
                            {formatMessage(translations.actions.downloadPdf)}
                        </Button>
                    </DisabledTooltip>
                </div>
            </div>
        </>
    );
}

function trim(text: string) {
    return text.replace(/^[\s:]+|[\s:]+$/g, '');
}

function DisabledTooltip({ children }: { children: ReactNode }) {
    const [isTooltipShown, setIsTooltipShown] = useState(false);

    return (
        <div
            className={styles.tooltipContainer}
            onMouseEnter={() => setIsTooltipShown(true)}
            onMouseLeave={() => setIsTooltipShown(false)}
        >
            {children}
            <Transition
                show={isTooltipShown}
                as={Fragment}
                enterFrom={styles.transitionStart}
                enterTo={styles.transitionFinish}
                leaveFrom={styles.transitionFinish}
                leaveTo={styles.transitionStart}
            >
                <div className={styles.tooltip}>
                    This is a preview. The story can't be shared yet.
                </div>
            </Transition>
        </div>
    );
}
