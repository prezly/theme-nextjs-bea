import { useMedia } from 'react-use';

const BREAKPOINT_TABLET = 414;
const BREAKPOINT_DESKTOP = 768;

export function useDevice() {
    const isMobile = useMedia(`(max-width: ${BREAKPOINT_TABLET}px)`, false);
    const isTablet = useMedia(`(max-width: ${BREAKPOINT_DESKTOP}px)`, false);

    return {
        isMobile,
        isTablet,
    };
}
