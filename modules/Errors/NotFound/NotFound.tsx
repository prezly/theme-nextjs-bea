import { translations } from '@prezly/theme-kit-intl';
import { useGetLinkLocaleSlug } from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import { FormattedMessage, useIntl } from 'react-intl';

import { Error as ErrorComponent } from '@/components';
import { ButtonLink } from '@/ui';

import styles from './NotFound.module.scss';

const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });

function NotFound() {
    const { formatMessage } = useIntl();
    const getLinkLocaleSlug = useGetLinkLocaleSlug();

    return (
        <Layout hasError>
            <ErrorComponent
                className={styles.error}
                action={
                    <ButtonLink href="/" localeCode={getLinkLocaleSlug()} variation="primary">
                        <FormattedMessage {...translations.actions.backToHomePage} />
                    </ButtonLink>
                }
                statusCode={404}
                title={formatMessage(translations.notFound.title)}
                description={formatMessage(translations.notFound.subtitle)}
            />
        </Layout>
    );
}

export default NotFound;
