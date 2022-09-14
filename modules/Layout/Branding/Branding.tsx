import type { Newsroom } from '@prezly/sdk';
import { getNewsroomFaviconUrl } from '@prezly/theme-kit-nextjs';
import Head from 'next/head';

import { useThemeSettings } from '@/hooks';

import { getCssVariables, getGoogleFontName } from './utils';

interface Props {
    newsroom: Newsroom;
}

// TODO: Figure out if we can load the stylesheets in `_document` to make Next happy
function Branding({ newsroom }: Props) {
    const themeSettings = useThemeSettings();
    const variables = getCssVariables(themeSettings);
    const googleFontName = getGoogleFontName(themeSettings.font);
    const faviconUrl = getNewsroomFaviconUrl(newsroom, 180);

    return (
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
                href={`https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;500;600;900&display=swap`}
                rel="stylesheet"
            />
            {variables.length > 0 && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `:root {${variables.map((variable) => variable).join(';')}}`,
                    }}
                />
            )}
            {faviconUrl && (
                <>
                    <link rel="shortcut icon" href={faviconUrl} />
                    <link rel="apple-touch-icon" href={faviconUrl} />
                    <meta name="msapplication-TileImage" content={faviconUrl} />
                    <meta
                        name="msapplication-TileColor"
                        content={themeSettings.headerBackgroundColor}
                    />
                    <meta name="theme-color" content={themeSettings.headerBackgroundColor} />
                </>
            )}
        </Head>
    );
}
export default Branding;
