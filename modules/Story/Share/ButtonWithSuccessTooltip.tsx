import { Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

import { Button, type ButtonProps } from '@/components/Button';
import { IconCheck } from '@/icons';

import styles from './ButtonWithSuccessTooltip.module.scss';

interface Props extends ButtonProps {
    onClick: () => void;
    successMessage: string;
}

const TOOLTIP_HIDE_DELAY = 3000;

export function ButtonWithSuccessTooltip({
    children,
    onClick,
    successMessage,
    ...restProps
}: Props) {
    const [isTooltipShown, setIsTooltipShown] = useState(false);

    async function handleClick() {
        await onClick();
        setIsTooltipShown(true);
        setTimeout(setIsTooltipShown, TOOLTIP_HIDE_DELAY, false);
    }

    return (
        <div className={styles.container}>
            <Button
                className={styles.button}
                disabled={isTooltipShown}
                onClick={handleClick}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...restProps}
            >
                {children}
            </Button>
            <Transition
                show={isTooltipShown}
                as={Fragment}
                enterFrom={styles.transitionStart}
                enterTo={styles.transitionFinish}
                leaveFrom={styles.transitionFinish}
                leaveTo={styles.transitionStart}
            >
                <div className={styles.tooltip}>
                    <IconCheck width={16} height={16} />
                    {successMessage}
                </div>
            </Transition>
        </div>
    );
}

// formatMessage(translations.actions.copyShareUrl)
