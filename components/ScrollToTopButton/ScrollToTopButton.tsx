import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { IconCaret } from '@/icons';

import Button from '../Button';

import styles from './ScrollToTopButton.module.scss';

const SCROLL_TOP_MIN_HEIGHT = 300;

function ScrollToTopButton() {
    const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

    useEffect(() => {
        function scrollListener() {
            setIsScrollToTopVisible(
                document.body.scrollTop > SCROLL_TOP_MIN_HEIGHT ||
                    document.documentElement.scrollTop > SCROLL_TOP_MIN_HEIGHT,
            );
        }
        if (typeof window !== 'undefined') {
            window.onscroll = scrollListener;
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.onscroll = null;
            }
        };
    }, []);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    return (
        <Button
            variation="secondary"
            className={classNames(styles.button, { [styles.visible]: isScrollToTopVisible })}
            onClick={scrollToTop}
        >
            <IconCaret className={styles.icon} />
        </Button>
    );
}

export default ScrollToTopButton;
