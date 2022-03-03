import { useNewsroomContext } from '@prezly/theme-kit-nextjs';

export function useThemeSettings() {
    const { themePreset } = useNewsroomContext();

    return {
        showDate: Boolean(themePreset?.settings.show_date),
        showSubtitle: Boolean(themePreset?.settings.show_subtitle),
    };
}
