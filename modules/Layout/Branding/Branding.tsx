import { Newsroom, NewsroomThemePreset } from '@prezly/sdk';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';

import { getAssetsUrl } from '@/utils/prezly';

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
            {newsroom.icon && <link rel="shortcut icon" href={getAssetsUrl(newsroom.icon.uuid)} />}
        </Head>
    );
};
export default Branding;
