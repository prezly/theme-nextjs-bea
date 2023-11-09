import { translations } from '@prezly/theme-kit-intl';

import { Error } from '@/components/Error';
import { FormattedMessage } from '@/theme-kit/intl/server';
import { ButtonLink } from '@/ui';

import styles from './NotFound.module.scss';

export function NotFound() {
    return (
        <Error
            className={styles.error}
            action={
                <ButtonLink href={{ routeName: 'index' }} variation="primary">
                    <FormattedMessage for={translations.actions.backToHomePage} />
                </ButtonLink>
            }
            statusCode={404}
            title={<FormattedMessage for={translations.notFound.title} />}
            description={<FormattedMessage for={translations.notFound.subtitle} />}
        />
    );
}
