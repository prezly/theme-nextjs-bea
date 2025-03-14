import { LogoPrezly } from 'icons';

import styles from './MadeWithPrezly.module.scss';

export function MadeWithPrezly() {
    return (
        <a
            href="https://prezly.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.wrapper}
        >
            <span className={styles.text}>Made with</span>

            <LogoPrezly className={styles.logo} />
        </a>
    );
}
