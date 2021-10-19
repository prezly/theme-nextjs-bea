import React, { FunctionComponent } from 'react';

import { IconQuoteClosing, IconQuoteOpening } from '@/icons';

import styles from './Quote.module.scss';

const Quote: FunctionComponent = ({ children }) => (
    <div className={styles.container}>
        <div className={styles.left}>
            <IconQuoteOpening className={styles.quote} />
            <IconQuoteOpening className={styles.quote} />
        </div>
        <div className={styles.content}>{children}</div>
        <div className={styles.right}>
            <IconQuoteClosing className={styles.quote} />
            <IconQuoteClosing className={styles.quote} />
        </div>
    </div>
);

export default Quote;
