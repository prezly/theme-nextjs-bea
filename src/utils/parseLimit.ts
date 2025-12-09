import { parseInteger } from './parseInteger';
import { clamp } from './clamp';

const MIN_LIMIT = 1;
const MAX_LIMIT = 1000;

export function parseLimit(limit: string | null | undefined) {
    // - `limit` below 0 is ignored
    // - `limit` above `MAX_LIMIT` is capped to `MAX_LIMIT`
    return clamp(parseInteger(limit, { min: MIN_LIMIT }), { max: MAX_LIMIT });
}
