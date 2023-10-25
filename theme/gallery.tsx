import type { Culture } from '@prezly/sdk';

interface Props {
    locale?: Culture['code'];
}

export default function Page({ locale }: Props) {
    return <>Gallery for {locale ?? 'default locale'}</>;
}
