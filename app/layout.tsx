import { locale } from '@/theme-kit';

interface Props {
    children: React.ReactNode;
}

export default function LocaleLayout({ children }: Props) {
    const localeCode = locale();
    return (
        <html>
            <body>
                <h1>{localeCode} locale layout</h1>
                {children}
            </body>
        </html>
    );
}
