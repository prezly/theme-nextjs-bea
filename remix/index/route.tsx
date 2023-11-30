// import type { Locale } from '@prezly/theme-kit-nextjs';
// import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

// import type { RequestContext } from '@/remix/types';

// interface Props {
//     params: {
//         localeCode: Locale.Code;
//     };
//     context: RequestContext;
// }

// export async function loader({ params, context }: Props) {
//     return json({ params, locale: context.locale });
// }

export default function StoriesIndexPage() {
    const data = useLoaderData<any>();

    return (
        <>
            <h1>Stories</h1>
            <pre>{JSON.stringify(data, undefined, 4)}</pre>
        </>
    );
}
