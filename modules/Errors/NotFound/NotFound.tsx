import { useGetLinkLocaleSlug } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { Button } from '@prezly/themes-ui-components';
import { FormattedMessage, useIntl } from 'react-intl';

import { Error } from '@/components';
import Layout from '@/modules/Layout';

import styles from './NotFound.module.scss';

function NotFound() {
    const { formatMessage } = useIntl();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <Layout hasError>
            <Error
                className={styles.error}
                action={
                    <Button.Link href="/" localeCode={getLinkLocaleSlug()} variation="primary">
                        <FormattedMessage {...translations.actions.backToHomePage} />
                    </Button.Link>
                }
                statusCode={404}
                title={formatMessage(translations.notFound.title)}
                description={formatMessage(translations.notFound.subtitle)}
            />
        </Layout>
    );
}

export default NotFound;
