'use client';

import classNames from 'classnames';

import Illustration from '@/public/images/error.svg';

import styles from './Error.module.scss';

export function Error() {
    function handlePageRefresh() {
        window.location.reload();
    }

    return (
        <div className={classNames(styles.container, 'container')}>
            <div className={classNames(styles.wrapper, 'wrapper')}>
                <div className={classNames(styles.illustration, 'illustration')}>
                    <Illustration className={classNames(styles.svg, 'svg')} />
                </div>
                <div className={classNames(styles.content, 'content')}>
                    <h1 className={classNames(styles.title, 'title')}>
                        We’re sorry, this site couldn’t load
                    </h1>
                    <p className={classNames(styles.description, 'description')}>
                        Try to{' '}
                        <button
                            className={classNames(styles.link, 'link')}
                            onClick={handlePageRefresh}
                        >
                            refresh
                        </button>{' '}
                        the page, or visit the platform’s{' '}
                        <a
                            className={classNames(styles.link, 'link')}
                            rel="noopener noreferrer"
                            target="_blank"
                            href="https://status.prezly.com"
                        >
                            status page
                        </a>{' '}
                        to see if any incidents are affecting the platform. You can also reach out
                        to support via{' '}
                        <a
                            className={classNames(styles.link, 'link')}
                            href="mailto:support@prezly.com"
                        >
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
