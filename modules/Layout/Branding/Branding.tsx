import type { Newsroom, NewsroomThemePreset } from '@prezly/sdk';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';

import { getNewsroomLogoUrl } from '@/utils/prezly';

import { getCssVariables } from './utils';

interface Props {
    newsroom: Newsroom;
    themePreset: NewsroomThemePreset;
}

const Branding: FunctionComponent<Props> = ({ newsroom, themePreset }) => {
    const variables = getCssVariables(themePreset);

    return (
        <Head>
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
                    <link rel="shortcut icon" href={getNewsroomLogoUrl(newsroom, 32)} />
                    <link rel="apple-touch-icon" href={getNewsroomLogoUrl(newsroom, 180)} />
                    <meta
                        name="msapplication-TileImage"
                        content={getNewsroomLogoUrl(newsroom, 144)}
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
