/* eslint-disable @typescript-eslint/no-use-before-define */
import parseDataUrl from 'parse-data-url';

export function collectEnvVariables(
    vars: NodeJS.ProcessEnv,
    headersBag: Headers,
): Record<string, unknown> {
    const headerName = (vars.HTTP_ENV_HEADER || '').toLowerCase();
    const httpEnvHeader = headerName ? headersBag.get(headerName) : undefined;

    if (httpEnvHeader) {
        const httpEnv = decodeHttpEnv(httpEnvHeader);

        return { ...vars, ...httpEnv };
    }

    return { ...vars };
}

function decodeHttpEnv(header: string): Record<string, any> {
    if (header.startsWith('data:')) {
        const parsed = parseDataUrl(header);
        if (parsed && parsed.contentType === 'application/json') {
            const data = parsed.toBuffer().toString('utf-8');
            return decodeJson(data);
        }
        return {}; // unsupported data-uri
    }
    return decodeJson(header);
}

function decodeJson(json: string): Record<string, any> {
    try {
        const decoded = JSON.parse(json);
        if (decoded && typeof decoded === 'object') {
            return decoded;
        }
    } catch {
        // passthru
    }
    return {};
}
