import classNames from 'classnames';
import type { InputHTMLAttributes, ReactNode } from 'react';

import styles from './FormInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    description?: string;
    error?: string;
    inputClassName?: string;
}

export function FormInput({
    label,
    description,
    className,
    error,
    inputClassName,
    ...inputProps
}: Props) {
    return (
        <label
            className={classNames(className, styles.wrapper, {
                [styles.hasError]: Boolean(error),
                [styles.isDisabled]: inputProps.disabled,
            })}
        >
            <span className={styles.label}>{label}</span>
            <input {...inputProps} className={classNames(styles.input, inputClassName)} />
            {description && !error && <p className={styles.description}>{description}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </label>
    );
}
