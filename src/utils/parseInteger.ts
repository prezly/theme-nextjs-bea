interface Parameters {
    min?: number;
    max?: number;
}

/**
 * Parse an integer number from the given string input.
 *
 * Additionally, the function validates the number against min/max boundaries.
 * If the number is outside the given range - `undefined` is returned,
 * as if it's not a valid number input.
 *
 * @see clamp
 */
export function parseInteger(
    value: string | null | undefined,
    params: Parameters = {},
): number | undefined {
    const int = value ? parse(value) : undefined;

    if (int !== undefined && params.min !== undefined && int < params.min) {
        return undefined;
    }

    if (int !== undefined && params.max !== undefined && int > params.max) {
        return undefined;
    }

    return int;
}

function parse(value: string): number | undefined {
    const number = Number.parseInt(value);
    return !Number.isNaN(number) ? number : undefined;
}
