const pino = require('pino');

/**
 * The Prezly SDK attaches the full API response headers (including a multi-KB
 * CSP policy) to every `ApiError` it throws. They carry no diagnostic signal
 * but multiply the size of every logged error, so strip them before the error
 * is serialized. Scoped to HTTP-response-shaped errors (`status` + `headers`)
 * so headers carried by unrelated error types are left untouched.
 */
function serializeError(error) {
    const serialized = pino.stdSerializers.err(error);

    if (
        serialized &&
        typeof serialized === 'object' &&
        'headers' in serialized &&
        'status' in serialized
    ) {
        const { headers, ...rest } = serialized;
        return rest;
    }

    return serialized;
}

const logger = (defaultConfig) =>
    pino({
        ...defaultConfig,
        serializers: {
            err: serializeError,
        },
    });

module.exports = { logger };
