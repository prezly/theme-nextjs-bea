import 'server-only';

/* eslint-disable @typescript-eslint/no-use-before-define */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import parseDataUrl from 'parse-data-url';
import createServerComponentContext from 'server-only-context';
import { z, ZodError } from 'zod';

export const [getEnvironment, setEnvironment] = createServerComponentContext<
    ExpectedEnv | undefined
>(undefined);

const Schema = z
    .object({
        PREZLY_ACCESS_TOKEN: z.string(),
        PREZLY_NEWSROOM_UUID: z.string(),
        PREZLY_THEME_UUID: z.string().optional(),
        PREZLY_API_BASEURL: z.string().optional(),

        ALGOLIA_API_KEY: z.string(),
        ALGOLIA_APP_ID: z.string(),
        ALGOLIA_INDEX: z.string(),
    })
    .catchall(z.string());

type ExpectedEnv = z.infer<typeof Schema>;

export function withHttpEnv(request: NextRequest) {
    const environment = validateEnv(getEnvVariables(process.env, request.headers));

    console.log({ environment });

    setEnvironment(environment);

    return NextResponse.next();
}

export function env() {
    const environment = getEnvironment();
    if (!environment) {
        throw new Error(
            "Request environment wasn't initialized yet. Make sure you attach the `withHttpEnv()` middleware.`",
        );
    }
    return environment;
}
export function validateEnv(vars: Record<string, unknown>): ExpectedEnv {
    try {
        return Schema.parse(vars);
    } catch (error) {
        if (error instanceof ZodError) {
            error.issues.forEach((issue) => {
                throw new Error(`${issue.path.join('')}: ${issue.message}.`);
            });
        }
        throw error;
    }
}

export function getEnvVariables(
    vars: NodeJS.ProcessEnv,
    headersBag: Headers,
): Record<string, unknown> {
    const headerName = (vars.HTTP_ENV_HEADER || '').toLowerCase();
    const httpEnvHeader = headerName ? headersBag.get(headerName) : undefined;

    if (httpEnvHeader) {
        const httpEnv = decodeHttpEnvHeader(httpEnvHeader);

        return { ...vars, ...httpEnv };
    }

    return { ...vars };
}

function decodeHttpEnvHeader(header: string): Record<string, any> {
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
