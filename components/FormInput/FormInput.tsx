import classNames from 'classnames';
import { FunctionComponent, InputHTMLAttributes } from 'react';

import styles from './FormInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
    error?: string;
}

const FormInput: FunctionComponent<Props> = ({
    label,
    description,
    className,
    error,
    ...inputProps
}) => (
    <label
        className={classNames(className, styles.wrapper, {
            [styles.hasError]: Boolean(error),
            [styles.isDisabled]: inputProps.disabled,
        })}
    >
        <span className={styles.label}>{label}</span>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input {...inputProps} className={styles.input} placeholder={label} />
        {description && !error && <p className={styles.description}>{description}</p>}
        {error && <p className={styles.error}>{error}</p>}
    </label>
);

export default FormInput;
