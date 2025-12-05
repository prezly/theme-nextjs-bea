import { MAX_SAFE_INT } from '@/constants';

import { parseInteger } from './parseInteger';

export function parseId(id: string | null | undefined) {
    // - `id` outside the safe range is ignored
    return parseInteger(id, { min: 1, max: MAX_SAFE_INT });
}
