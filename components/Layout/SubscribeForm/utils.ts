import { defineMessages, MessageDescriptor } from 'react-intl';

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const messages = defineMessages({
    errorFieldRequired: {
        defaultMessage: 'This field is required',
    },
    errorEmailInvalid: {
        defaultMessage: 'Introduce a valid email address',
    },
});

export const validateEmail = (email: string): MessageDescriptor | undefined => {
    if (!email) {
        return messages.errorFieldRequired;
    }
    if (!EMAIL_REGEX.test(email)) {
        return messages.errorEmailInvalid;
    }

    return undefined;
};
