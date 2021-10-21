import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Form, Formik, FormikErrors } from 'formik';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { useNewsroom } from '@/hooks/useNewsroom';
import { getPrivacyPortalUrl } from '@/utils/prezly';
import { HCAPTCHA_SITEKEY } from '@/utils/prezly/constants';
import { FormSubmitHandler, FormValidator } from 'types';

import { EMAIL_REGEX, INITIAL_FORM_DATA, SubscribeFormData } from './utils';

import styles from './SubscribeForm.module.scss';

const SubscribeForm: FunctionComponent = () => {
    const newsroom = useNewsroom();

    const validateForm: FormValidator<SubscribeFormData> = ({ email }) => {
        const errors: FormikErrors<SubscribeFormData> = {};
        if (!email) {
            errors.email = 'This field is required';
        } else if (!EMAIL_REGEX.test(email)) {
            errors.email = 'Introduce a valid email address';
        }

        return errors;
    };

    const handleSubmit: FormSubmitHandler<SubscribeFormData> = (
        { email },
        { setSubmitting, setFieldError },
    ) => {
        if (!newsroom) {
            setFieldError('email', 'Something went wrong. Please try submitting the form again');
            setSubmitting(false);
            return;
        }

        window.location.href = getPrivacyPortalUrl(newsroom, { email });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Get updates in your mailbox</h2>
            <p className={styles.subtitle}>
                Get all the updates on{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{newsroom?.display_name}</span> in your
                inbox. No spam, unsubscribe at anytime.
            </p>

            <Formik
                initialValues={INITIAL_FORM_DATA}
                validate={validateForm}
                onSubmit={handleSubmit}
                validateOnBlur={false}
                validateOnChange={false}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className={styles.inlineForm}>
                            <FormInput
                                name="email"
                                type="email"
                                label="Your email address"
                                required
                                className={styles.input}
                            />
                            <Button
                                type="submit"
                                variation="primary"
                                className={styles.button}
                                isLoading={isSubmitting}
                            >
                                Subscribe
                            </Button>
                        </div>

                        <HCaptcha sitekey={HCAPTCHA_SITEKEY} size="invisible" />

                        <p className={styles.captchaDisclaimer}>
                            This site is protected by hCaptcha and its{' '}
                            <a
                                href="https://www.hcaptcha.com/privacy"
                                className={styles.disclaimerLink}
                            >
                                Privacy Policy
                            </a>{' '}
                            and{' '}
                            <a
                                href="https://www.hcaptcha.com/terms"
                                className={styles.disclaimerLink}
                            >
                                Terms of Service
                            </a>{' '}
                            apply.
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SubscribeForm;
