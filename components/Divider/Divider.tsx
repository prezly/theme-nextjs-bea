import classNames from 'classnames';

import styles from './Divider.module.scss';

export function Divider({ className }: Divider.Props) {
    return (
        <div className={classNames(styles.divider, className)}>
            <div className={styles.line} />
        </div>
    );
}

export namespace Divider {
    export interface Props {
        className?: string;
    }
}
