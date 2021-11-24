import translations from '@prezly/themes-intl-messages';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@/components/Button';
import Error from '@/components/Error';

import styles from './InternalServerError.module.scss';

const InternalServerError: FunctionComponent = () => {
    const router = useRouter();
    const { formatMessage } = useIntl();

    return (
        <Error
            className={styles.error}
            action={
                <Button onClick={() => router.reload()} variation="primary">
                    <FormattedMessage {...translations.actions.reload} />
                </Button>
            }
            statusCode={500}
            title={formatMessage(translations.serverError.title)}
            description={formatMessage(translations.serverError.subtitle)}
        />
    );
};

export default InternalServerError;
