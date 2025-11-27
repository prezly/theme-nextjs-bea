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
import { SocialNetwork, StoryActions } from '@/theme-settings';

import styles from './SharePlaceholder.module.scss';
import { Transition } from '@headlessui/react';
import { Button } from '@/components/Button';

interface Props {
    actions: StoryActions;
    socialNetworks: SocialNetwork[];
}

export function SharePlaceholder({ actions, socialNetworks }: Props) {
    const { formatMessage } = useIntl();
    const hasActions = Object.values(actions).filter(Boolean).length > 0;
    const hasSocials = socialNetworks.length > 0;

    if (!hasActions && !hasSocials) {
        return null;
    }

    return (
        <>
            <Divider />
            <h2>{trim(formatMessage(translations.actions.share))}</h2>
            <div>
                {hasSocials && (
                    <div className={styles.socials}>
                        {socialNetworks.includes(SocialNetwork.LINKEDIN) && (
                            <DisabledTooltip isSocial>
                                <IconLinkedin className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}
                        {socialNetworks.includes(SocialNetwork.FACEBOOK) && (
                            <DisabledTooltip isSocial>
                                <IconFacebook className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.TWITTER) && (
                            <DisabledTooltip isSocial>
                                <IconTwitter className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.MASTODON) && (
                            <DisabledTooltip isSocial>
                                <IconMastodon className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.PINTEREST) && (
                            <DisabledTooltip isSocial>
                                <IconPinterest className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.REDDIT) && (
                            <DisabledTooltip isSocial>
                                <IconReddit className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.WHATSAPP) && (
                            <DisabledTooltip isSocial>
                                <IconWhatsApp className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.THREADS) && (
                            <DisabledTooltip isSocial>
                                <IconThreads className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.TELEGRAM) && (
                            <DisabledTooltip isSocial>
                                <IconTelegram className={styles.socialIcon} />
                            </DisabledTooltip>
                        )}

                        {socialNetworks.includes(SocialNetwork.BLUESKY) && (
                            <DisabledTooltip isSocial>
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

function DisabledTooltip({ children, isSocial }: { children: ReactNode; isSocial?: boolean }) {
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
                    {isSocial
                        ? 'This is a preview, and sharing options are not available yet'
                        : 'This is a preview, and current URL is temporary'}
                </div>
            </Transition>
        </div>
    );
}
