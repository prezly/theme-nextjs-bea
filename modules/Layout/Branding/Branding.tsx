import type { Newsroom, NewsroomThemePreset } from '@prezly/sdk';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';

import { getNewsroomFaviconUrl } from '@/utils/prezly';

import { getCssVariables, getGoogleFontName } from './utils';

interface Props {
    newsroom: Newsroom;
    themePreset: NewsroomThemePreset;
}

const Branding: FunctionComponent<Props> = ({ newsroom, themePreset }) => {
    const variables = getCssVariables(themePreset);
    const googleFontName = getGoogleFontName(themePreset.settings.font);

    return (
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link
                href={`https://fonts.googleapis.com/css2?family=${googleFontName}:wght@400;500;600&display=swap`}
                rel="stylesheet"
            />
            {variables.length > 0 && (
                <style
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: `:root {${variables.map((variable) => variable).join(';')}}`,
                    }}
                />
            )}
            {newsroom.icon && (
                <>
                    <link rel="shortcut icon" href={getNewsroomFaviconUrl(newsroom, 32)} />
                    <link rel="apple-touch-icon" href={getNewsroomFaviconUrl(newsroom, 180)} />
                    <meta
                        name="msapplication-TileImage"
                        content={getNewsroomFaviconUrl(newsroom, 144)}
                    />
                    {/* TODO: Use the page background color / header color when it is supported */}
                    <meta name="msapplication-TileColor" content="#ffffff" />
                    <meta name="theme-color" content="#ffffff" />
                </>
            )}
        </Head>
    );
};
export default Branding;
