import { Transition } from '@headlessui/react';
import { translations, useIntl } from '@prezly/theme-kit-nextjs';
import { Fragment, type ReactNode, useState } from 'react';

import { Button } from '@/components/Button';
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
import { SocialNetwork, StoryActions } from '@/theme-settings';

import styles from './SharePlaceholder.module.scss';

interface Props {
    actions: StoryActions;
    socialNetworks: SocialNetwork[];
}

export function SharePlaceholder({ actions, socialNetworks }: Props) {
    const { formatMessage } = useIntl();
    const hasActions =
        [
            actions.show_copy_content,
            actions.show_copy_url,
            actions.show_download_assets,
            actions.show_download_pdf,
        ].filter(Boolean).length > 0;

    if (!hasActions || socialNetworks.length === 0) {
        return null;
    }

    return (
        <>
            <Divider />
            <h2 className={styles.title}>{trim(formatMessage(translations.actions.share))}</h2>
            <div>
                {socialNetworks.length > 0 && (
                    <div className={styles.socials}>
                        {socialNetworks.includes(SocialNetwork.LINKEDIN) && (
                            <DisabledTooltip>
                                <IconLinkedin className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.FACEBOOK) && (
                            <DisabledTooltip>
                                <IconFacebook className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.TWITTER) && (
                            <DisabledTooltip>
                                <IconTwitter className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.MASTODON) && (
                            <DisabledTooltip>
                                <IconMastodon className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.PINTEREST) && (
                            <DisabledTooltip>
                                <IconPinterest className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.REDDIT) && (
                            <DisabledTooltip>
                                <IconReddit className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.WHATSAPP) && (
                            <DisabledTooltip>
                                <IconWhatsApp className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.THREADS) && (
                            <DisabledTooltip>
                                <IconThreads className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.TELEGRAM) && (
                            <DisabledTooltip>
                                <IconTelegram className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.BLUESKY) && (
                            <DisabledTooltip>
                                <IconBluesky className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                    </div>
                )}
                {hasActions && (
                    <div className={styles.actions}>
                        {actions.show_copy_url && (
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
                        )}
                        {actions.show_copy_content && (
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
                        )}
                        {actions.show_download_assets && (
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
                        )}
                        {actions.show_download_pdf && (
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
                        )}
                    </div>
                )}
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
                <div className={styles.tooltip}>This is a preview that shouldn't be shared</div>
            </Transition>
        </div>
    );
}
