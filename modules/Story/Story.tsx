import type { FunctionComponent } from 'react';
import type { ExtendedStory } from '@prezly/sdk/dist/types';
import SlateRenderer from 'components/SlateRenderer';

type Props = {
    story: ExtendedStory;
};

const Story: FunctionComponent<Props> = ({ story }) => (
    <article>
        <h2>{story.title}</h2>
        <h3>{story.subtitle}</h3>
        <SlateRenderer nodes={JSON.parse(story.content)} />
    </article>
);

export default Story;
