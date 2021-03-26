import type { FunctionComponent } from 'react';
import Link from 'next/link';
import type { Story } from '@prezly/sdk';

type Props = {
    stories: Story[];
};

const Stories: FunctionComponent<Props> = ({ stories }) => (
    <div>
        {stories.map((story) => (
            <Link key={story.id} href={story.slug} passHref>
                <a style={{ display: 'block', marginBottom: 20 }}>
                    <img src={story.thumbnail_url} alt="" />
                    <span>{story.title}</span>
                </a>
            </Link>
        ))}
    </div>
);

export default Stories;
