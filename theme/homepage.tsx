import type { Culture } from '@prezly/sdk';

interface Match {
    locale: Culture['code'];
}

export default async function Page({ locale }: Match) {
    return <div>Homepage for {locale}</div>;
}
