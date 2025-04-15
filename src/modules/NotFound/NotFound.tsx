import { type Locale, translations } from '@prezly/theme-kit-nextjs';

import { FormattedMessage } from '@/adapters/server';
import { ButtonLink } from '@/components/Button';
import { Error } from '@/components/Error';

import styles from './NotFound.module.scss';

interface Props {
    localeCode: Locale.Code;
}

export async function NotFound({ localeCode }: Props) {
    return (
        <Error
            className={styles.error}
            action={
                <ButtonLink
                    href={{ routeName: 'index', params: { localeCode } }}
                    variation="primary"
                >
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
