import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import Error from '@/components/Error';

import styles from './InternalServerError.module.scss';

const InternalServerError: FunctionComponent = () => {
    const router = useRouter();

    return (
        <Error
            className={styles.error}
            action={
                <Button onClick={() => router.reload()} variation="primary">
                    Reload
                </Button>
            }
            statusCode={500}
            title="This page isn’t working!"
            description="Try refreshing the page or coming back a bit later."
        />
    );
};

export default InternalServerError;
