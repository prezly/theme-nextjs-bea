interface Parameters {
    min?: number;
    max?: number;
}

export function clamp(value: number, params: Parameters): number;

export function clamp(value: number | undefined, params: Parameters): number | undefined;

/**
 * Constrain a number between optional min/max boundaries.
 *
 * - When the number is below `min` -- the `min` boundary is returned.
 * - When the number is above `max` -- the `max` boundary is returned.
 * - When the number is undefined -- `undefined` is returned.
 */
export function clamp(value: number | undefined, params: Parameters) {
    if (value === undefined) {
        return undefined;
    }
    if (params.min !== undefined && value < params.min) {
        return params.min;
    }
    if (params.max !== undefined && value > params.max) {
        return params.max;
    }

    return value;
}
