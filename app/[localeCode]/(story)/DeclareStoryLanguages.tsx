import type { ExtendedStory } from '@prezly/sdk';

import { DeclareLanguages } from '@/components/DeclareLanguages';

export function DeclareStoryLanguages(props: { story: ExtendedStory }) {
    const { story } = props;

    const translations = [story, ...story.translations].map((version) => ({
        code: version.culture.code,
        href: version.links.newsroom_view ?? (version.uuid === story.uuid ? '' : undefined), // make sure the current story language is always there
    }));

    return <DeclareLanguages languages={translations} />;
}
