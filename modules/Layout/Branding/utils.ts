import { NewsroomThemePreset } from '@prezly/sdk';

export const getCssVariables = (themePreset: NewsroomThemePreset) => {
    // TODO: Get values from themePreset when API returns them correctly
    const { editable_settings } = themePreset;

    // return ['--prezly-accent-color: #2563eb'];
    return [
        '--prezly-accent-color: #ff0000',
        '--prezly-accent-color-tint: #ff0000',
        '--prezly-accent-color-shade: #ff0000',
    ];
};
