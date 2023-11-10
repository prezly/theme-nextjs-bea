import { environment } from '@/theme/server';

export function analytics() {
    const { PREZLY_MODE } = environment();

    return {
        isTrackingEnabled: PREZLY_MODE !== 'preview',
    };
}
