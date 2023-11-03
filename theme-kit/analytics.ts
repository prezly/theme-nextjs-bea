import { env } from './env';

export function analytics() {
    const { PREZLY_MODE } = env();

    return {
        isTrackingEnabled: PREZLY_MODE !== 'preview',
    };
}
