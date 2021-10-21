import classNames from 'classnames';
import { ErrorMessage, Field, useField } from 'formik';
import { FunctionComponent, InputHTMLAttributes } from 'react';

import styles from './FormInput.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
    name: string;
}

const FormInput: FunctionComponent<Props> = ({ label, description, className, ...inputProps }) => {
    const [, meta] = useField(inputProps.name);
    const { error } = meta;

    return (
        <label
            className={classNames(
                styles.wrapper,
                { [styles.hasError]: Boolean(error), [styles.isDisabled]: inputProps.disabled },
                className,
            )}
        >
            <span className={styles.label}>{label}</span>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Field {...inputProps} className={styles.input} placeholder={label} />
            {description && !error && <p className={styles.description}>{description}</p>}
            {error && (
                <ErrorMessage name={inputProps.name} component="p" className={styles.error} />
            )}
        </label>
    );
};

export default FormInput;
