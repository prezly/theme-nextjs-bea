import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import Button from '@/components/Button';
import Error from '@/components/Error';

import styles from './InternalServerError.module.scss';

const messages = defineMessages({
    actionReload: {
        defaultMessage: 'Reload',
    },
    serverErrorTitle: {
        defaultMessage: 'This page isn’t working!',
    },
    serverErrorSubtitle: {
        defaultMessage: 'Try refreshing the page or coming back a bit later.',
    },
});

const InternalServerError: FunctionComponent = () => {
    const router = useRouter();
    const { formatMessage } = useIntl();

    return (
        <Error
            className={styles.error}
            action={
                <Button onClick={() => router.reload()} variation="primary">
                    <FormattedMessage {...messages.actionReload} />
                </Button>
            }
            statusCode={500}
            title={formatMessage(messages.serverErrorTitle)}
            description={formatMessage(messages.serverErrorSubtitle)}
        />
    );
};

export default InternalServerError;
