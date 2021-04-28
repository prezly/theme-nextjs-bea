import type { FunctionComponent } from 'react';
import type { ExtendedStory } from '@prezly/sdk/dist/types';
import SlateRenderer from 'components/SlateRenderer';
import { FormatVersion } from '@prezly/sdk/dist/types/Story';
import { StorySeo } from '@/components/seo';

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
        <>
            <StorySeo story={story} />
            <article>
                <h2>{title}</h2>
                <h3>{subtitle}</h3>
                {format_version === FormatVersion.HTML && (
                    // eslint-disable-next-line react/no-danger
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                )}
                {format_version === FormatVersion.SLATEJS && (
                    <SlateRenderer nodes={JSON.parse(content as string)} />
                )}
            </article>
        </>
    );
};

export default Story;
