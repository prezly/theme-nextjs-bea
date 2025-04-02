import classNames from 'classnames';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

import styles from './FormInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    description?: string;
    error?: string;
    inputClassName?: string;
    inputRef?: Ref<HTMLInputElement>;
}

export function FormInput({
    label,
    description,
    className,
    error,
    inputClassName,
    inputRef,
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
            <input
                {...inputProps}
                className={classNames(styles.input, inputClassName)}
                ref={inputRef}
            />
            {description && !error && <p className={styles.description}>{description}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </label>
    );
}
