import translations from '@prezly/themes-intl-messages';
import { useIntl } from 'react-intl';

import { PageTitle } from '@/components';

import { useAlgoliaState } from './AlgoliaStateContext';

function Title() {
    const { formatMessage } = useIntl();
    const { searchState } = useAlgoliaState();

    const { query: searchQuery } = searchState;

    return (
        <PageTitle
            title={
                searchQuery
                    ? formatMessage(translations.search.fullResultsTitle)
                    : formatMessage(translations.search.title)
            }
        />
    );
}

export default Title;
