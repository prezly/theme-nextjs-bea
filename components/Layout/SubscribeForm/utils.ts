export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const validateForm = (email: string) => {
    if (!email) {
        return 'This field is required';
    }
    if (!EMAIL_REGEX.test(email)) {
        return 'Introduce a valid email address';
    }

    return undefined;
};
