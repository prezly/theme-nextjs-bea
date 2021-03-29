import type { FunctionComponent } from 'react';
import type { ExtendedStory } from '@prezly/sdk/dist/types';
import SlateRenderer from 'components/SlateRenderer';

type Props = {
    story: ExtendedStory;
};

const Story: FunctionComponent<Props> = ({ story }) => {
    if (!story) {
        return <></>;
    }

    const {
        title, subtitle, content, format_version,
    } = story;

    return (
        <article>
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            <SlateRenderer nodes={JSON.parse(content)} />

            {format_version === 1 && (
                // @ts-expect-error
                // eslint-disable-next-line react/no-danger
                <div dangerouslySetInnerHTML={{ __html: story.htmlContent }} />
            )}
            {format_version === 3 && (
                <SlateRenderer nodes={JSON.parse(content)} />
            )}
        </article>
    );
};

export default Story;
