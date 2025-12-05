import { MAX_SAFE_INT } from '@/constants';

import { parseInteger } from './parseInteger';

export function parseOffset(offset: string | null | undefined) {
    // - `offset` outside the safe range is ignored
    return parseInteger(offset, { min: 0, max: MAX_SAFE_INT });
}
