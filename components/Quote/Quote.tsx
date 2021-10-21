import React, { FunctionComponent } from 'react';

import { IconQuoteClosing, IconQuoteOpening } from '@/icons';

import styles from './Quote.module.scss';

const Quote: FunctionComponent = ({ children }) => (
    <blockquote className={styles.container}>
        <div className={styles.left} aria-hidden="true">
            <IconQuoteOpening className={styles.quote} />
            <IconQuoteOpening className={styles.quote} />
        </div>
        <div className={styles.content}>{children}</div>
        <div className={styles.right} aria-hidden="true">
            <IconQuoteClosing className={styles.quote} />
            <IconQuoteClosing className={styles.quote} />
        </div>
    </blockquote>
);

export default Quote;
