import { translations } from '@prezly/theme-kit-nextjs';

import {
    FormattedMessage,
    getLocaleFromHeaderOptingInForDynamicRenderingWithoutCache,
} from '@/adapters/server';
import { ButtonLink } from '@/components/Button';
import { Error } from '@/components/Error';

import styles from './NotFound.module.scss';

export function NotFound() {
    const localeCode = getLocaleFromHeaderOptingInForDynamicRenderingWithoutCache();
    return (
        <Error
            className={styles.error}
            action={
                <ButtonLink href={{ routeName: 'index' }} variation="primary">
                    <FormattedMessage
                        locale={localeCode}
                        for={translations.actions.backToHomePage}
                    />
                </ButtonLink>
            }
            statusCode={404}
            title={<FormattedMessage locale={localeCode} for={translations.notFound.title} />}
            description={
                <FormattedMessage locale={localeCode} for={translations.notFound.subtitle} />
            }
        />
    );
}
