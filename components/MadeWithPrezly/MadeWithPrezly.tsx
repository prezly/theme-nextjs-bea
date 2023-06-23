import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { LogoPrezly } from 'icons';

import styles from './MadeWithPrezly.module.scss';

const FOOTER_HEIGHT = 88;

export function MadeWithPrezly() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        function scrollListener() {
            setIsVisible(
                window.innerHeight + Math.round(window.scrollY) <
                    document.body.offsetHeight - FOOTER_HEIGHT,
            );
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', scrollListener, { passive: true });
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('scroll', scrollListener);
            }
        };
    }, []);

    return (
        <a
            href="https://prez.ly/storytelling-platform"
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(styles.wrapper, { [styles.visible]: isVisible })}
        >
            <span className={styles.text}>Made with</span>

            <LogoPrezly className={styles.logo} />
        </a>
    );
}
