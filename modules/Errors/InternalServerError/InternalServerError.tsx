import translations from '@prezly/themes-intl-messages';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button, Error } from '@/components';

import styles from './InternalServerError.module.scss';

function InternalServerError() {
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
}

export default InternalServerError;
