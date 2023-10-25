import { translations } from '@prezly/theme-kit-intl';

import { api, FormattedMessage } from '@/theme-kit';

interface Props {
    children: React.ReactNode;
}

export default async function LocaleLayout({ children }: Props) {
    const { contentDelivery } = api();
    const newsroom = await contentDelivery.newsroom();

    return (
        <html>
            <body>
                <h1>
                    <FormattedMessage
                        from={translations.noStories.title}
                        values={{ newsroom: newsroom.display_name }}
                    />
                </h1>
                {children}
            </body>
        </html>
    );
}
