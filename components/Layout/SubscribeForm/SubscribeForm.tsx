import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { useNewsroom } from '@/hooks/useNewsroom';

import styles from './SubscribeForm.module.scss';

const SubscribeForm: FunctionComponent = () => {
    const newsroom = useNewsroom();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Get updates in your mailbox</h2>
            <p className={styles.subtitle}>
                Get all the updates on{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{newsroom?.display_name}</span> in your
                inbox. No spam, unsubscribe at anytime.
            </p>

            <form>
                <div className={styles.inlineForm}>
                    <FormInput
                        name="email"
                        type="email"
                        label="Your email address"
                        required
                        className={styles.input}
                    />
                    <Button type="submit" variation="primary" className={styles.button}>
                        Subscribe
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SubscribeForm;
