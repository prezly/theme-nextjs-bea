import translations from '@prezly/themes-intl-messages';
import dynamic from 'next/dynamic';
import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@/components/Button';
import Error from '@/components/Error';
import { useGetLinkLocale } from '@/hooks/useGetLinkLocale';

import styles from './NotFound.module.scss';

const Layout = dynamic(() => import('@/modules/Layout'), { ssr: true });

const NotFound: FunctionComponent = () => {
    const { formatMessage } = useIntl();
    const getLinkLocale = useGetLinkLocale();

    return (
        <Layout>
            <Error
                className={styles.error}
                action={
                    <Button.Link href="/" localeCode={getLinkLocale()} variation="primary">
                        <FormattedMessage {...translations.actions.backToHomePage} />
                    </Button.Link>
                }
                statusCode={404}
                title={formatMessage(translations.notFound.title)}
                description={formatMessage(translations.notFound.subtitle)}
            />
        </Layout>
    );
};

export default NotFound;
