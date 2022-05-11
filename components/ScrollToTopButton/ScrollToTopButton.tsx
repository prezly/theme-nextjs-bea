import classNames from 'classnames';

import { IconCaret } from '@/icons';

import Button from '../Button';

import styles from './ScrollToTopButton.module.scss';

interface Props {
    isVisible: boolean;
    onClick: () => void;
}

function ScrollToTopButton({ isVisible, onClick }: Props) {
    return (
        <Button
            variation="secondary"
            className={classNames(styles.button, { [styles.visible]: isVisible })}
            onClick={onClick}
        >
            <IconCaret className={styles.icon} />
        </Button>
    );
}

export default ScrollToTopButton;
