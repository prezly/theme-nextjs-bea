import type { Story } from '@prezly/sdk';
import Link from 'next/link';
import type { FunctionComponent } from 'react';

type Props = {
    stories: Story[];
};

const StoriesList: FunctionComponent<Props> = ({ stories }) => (
    <>
        {stories.map((story) => (
            <Link key={story.id} href={`/${story.slug}`} passHref>
                <a style={{ display: 'block', marginBottom: 20 }}>
                    <img src={story.thumbnail_url} alt="" />
                    <span>{story.title}</span>
                </a>
            </Link>
        ))}
    </>
);

export default StoriesList;
