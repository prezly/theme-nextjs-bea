import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import Error from '@/components/Error';

import styles from './NotFound.module.scss';

const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });

const NotFound: FunctionComponent = () => {
    const router = useRouter();

    return (
        <Layout>
            <Error
                className={styles.error}
                action={
                    <Button onClick={() => router.push('/')} variation="primary">
                        Back to Homepage
                    </Button>
                }
                statusCode={404}
                title="Oops! Something went wrong"
                description="The page you’re looking for doesn’t exist..."
            />
        </Layout>
    );
};

export default NotFound;
