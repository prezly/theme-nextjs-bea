/* eslint-disable id-blacklist */

'use client';

import Illustration from '@/public/images/error.svg';

import 'modern-normalize/modern-normalize.css';
import '@/styles/styles.globals.scss';

import styles from './error.module.scss';

export default function Error({ reset }: { reset: () => void }) {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.illustration}>
                    <Illustration className={styles.svg} />
                </div>
                <div className={styles.content}>
                    <h1 className={styles.title}>We’re sorry, this newsroom couldn’t load</h1>
                    <p className={styles.description}>
                        Try to{' '}
                        <button className={styles.link} onClick={reset}>
                            refresh
                        </button>{' '}
                        the page, or visit the platform’s{' '}
                        <a className={styles.link} href="https://status.prezly.com">
                            status page
                        </a>{' '}
                        to see if any incidents are affecting the platform. You can also reach out
                        to support via{' '}
                        <a className={styles.link} href="mailto:support@prezly.com">
                            {' '}
                            email
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
