import { type PaginationProps, useCompanyInformation } from '@prezly/theme-kit-nextjs';
import translations from '@prezly/themes-intl-messages';
import { useIntl } from 'react-intl';

import type { StoryWithImage } from 'types';

import InfiniteStories from '../InfiniteStories';
import Layout from '../Layout';

interface Props {
    stories: StoryWithImage[];
    pagination: PaginationProps;
}

function Stories({ stories, pagination }: Props) {
    const companyInformation = useCompanyInformation();
    const { formatMessage } = useIntl();

    return (
        <Layout
            title={`${companyInformation.name} - ${formatMessage(translations.newsroom.title)}`}
        >
            <InfiniteStories initialStories={stories} pagination={pagination} />
        </Layout>
    );
}

export default Stories;
