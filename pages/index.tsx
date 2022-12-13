import { getHomepageServerSideProps, type HomePageProps } from '@prezly/theme-kit-nextjs';
import dynamic from 'next/dynamic';
import type { FunctionComponent } from 'react';

import { importMessages, isTrackingEnabled } from '@/utils';
import type { BasePageProps, StoryWithImage } from 'types';

const Stories = dynamic(() => import('@/modules/Stories'), { ssr: true });

type Props = BasePageProps & HomePageProps<StoryWithImage>;

const IndexPage: FunctionComponent<Props> = ({ stories, pagination }) => (
    <Stories stories={stories} pagination={pagination} />
);

export const getServerSideProps = getHomepageServerSideProps<BasePageProps, StoryWithImage>(
    async (context, { newsroomContextProps }) => ({
        isTrackingEnabled: isTrackingEnabled(context),
        translations: await importMessages(newsroomContextProps.localeCode),
    }),
    { extraStoryFields: ['thumbnail_image'], pinning: true },
);

export default IndexPage;
