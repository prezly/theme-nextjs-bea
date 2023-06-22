import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { LogoPrezly } from 'icons';

import styles from './MadeWithPrezly.module.scss';

const FOOTER_HEIGHT = 88;

export function MadeWithPrezly() {
    const [isMadeWithPrezlyVisible, setIsMadeWithPrezlyVisible] = useState(true);

    useEffect(() => {
        function madeWithPrezlyListener() {
            setIsMadeWithPrezlyVisible(
                window.innerHeight + Math.round(window.scrollY) <
                    document.body.offsetHeight - FOOTER_HEIGHT,
            );
        }
        if (typeof window !== 'undefined') {
            window.onscroll = madeWithPrezlyListener;
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.onscroll = null;
            }
        };
    }, []);

    return (
        <a
            href="https://prez.ly/storytelling-platform"
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(styles.wrapper, { [styles.visible]: isMadeWithPrezlyVisible })}
        >
            <span className={styles.text}>Made with</span>

            <LogoPrezly className={styles.logo} />
        </a>
    );
}
