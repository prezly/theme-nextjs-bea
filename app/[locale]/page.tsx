import type { Locale } from '@prezly/theme-kit-intl';

interface Params {
    locale: Locale.Code;
}

export default async function StoriesIndexPage(props: { params: Params }) {
    const { locale } = props.params;
    return <div>Stories index in {locale}</div>;
}
