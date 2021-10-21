import { FormikErrors } from 'formik';

import { FormValidator } from 'types';

export interface SubscribeFormData {
    email: string;
}

export const INITIAL_FORM_DATA: SubscribeFormData = { email: '' };
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validateForm: FormValidator<SubscribeFormData> = ({ email }) => {
    const errors: FormikErrors<SubscribeFormData> = {};
    if (!email) {
        errors.email = 'This field is required';
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Introduce a valid email address';
    }

    return errors;
};
