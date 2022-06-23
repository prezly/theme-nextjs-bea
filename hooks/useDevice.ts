import { useMediaQuery } from '@react-hookz/web';

const BREAKPOINT_TABLET = 414;
const BREAKPOINT_DESKTOP = 768;

export function useDevice() {
    const isMobile = useMediaQuery(`(max-width: ${BREAKPOINT_TABLET}px)`, true);
    const isTablet = useMediaQuery(`(max-width: ${BREAKPOINT_DESKTOP}px)`, true);

    return {
        isMobile,
        isTablet,
    };
}
