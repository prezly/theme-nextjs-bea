import type { FunctionComponent } from 'react';
import type { ExtendedStory } from '@prezly/sdk/dist/types';
import SlateRenderer from 'components/SlateRenderer';
import { FormatVersion } from '@prezly/sdk/dist/types/Story';

type Props = {
    story: ExtendedStory;
};

const Story: FunctionComponent<Props> = ({ story }) => {
    if (!story) {
        return null;
    }

    const {
        title, subtitle, content, format_version,
    } = story;

    return (
        <article>
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            {format_version === FormatVersion.HTML && (
                // @ts-expect-error
                // eslint-disable-next-line react/no-danger
                <div dangerouslySetInnerHTML={{ __html: story.htmlContent }} />
            )}
            {format_version === FormatVersion.SLATEJS && (
                <SlateRenderer nodes={JSON.parse(content as string)} />
            )}
        </article>
    );
};

export default Story;
