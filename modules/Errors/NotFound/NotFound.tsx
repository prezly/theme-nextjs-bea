import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Button from '@/components/Button';
import Error from '@/components/Error';
import Layout from '@/components/Layout';

import styles from './NotFound.module.scss';

const messages = defineMessages({
    actionBackToHomepage: {
        defaultMessage: 'Back to Homepage',
    },
    notFoundTitle: {
        defaultMessage: 'Oops! Something went wrong',
    },
    notFoundSubtitle: {
        defaultMessage: 'The page you’re looking for doesn’t exist...',
    },
});

const NotFound: FunctionComponent = () => {
    const router = useRouter();
    const { formatMessage } = useIntl();

    return (
        <Layout>
            <Error
                className={styles.error}
                action={
                    <Button onClick={() => router.push('/')} variation="primary">
                        <FormattedMessage {...messages.actionBackToHomepage} />
                    </Button>
                }
                statusCode={404}
                title={formatMessage(messages.notFoundTitle)}
                description={formatMessage(messages.notFoundSubtitle)}
            />
        </Layout>
    );
};

export default NotFound;
