import { Environment } from '@prezly/theme-kit-nextjs';
import type { Event } from '@sentry/nextjs';

const ENV_HEADER = 'x-prezly-env';
const ENV_HEADER_SPAN_ATTRIBUTE = 'http.request.header.x_prezly_env';

type Bag = Record<string, unknown>;

/**
 * Sentry attaches the request headers to server events, and `X-Prezly-Env`
 * carries the newsroom's API credentials. Keep the newsroom it names as a tag,
 * and never let the header itself leave the process.
 */
export function replaceEnvHeaderWithNewsroomTag(event: Event): Event {
    const headers = event.request?.headers;
    const name = headers && Object.keys(headers).find((key) => key.toLowerCase() === ENV_HEADER);
    const env = Environment.combine(process.env, name ? headers[name] : undefined);

    if (name) {
        delete headers[name];
    }
    removeSpanAttribute(event.contexts?.trace?.data);
    for (const span of event.spans ?? []) {
        removeSpanAttribute(span.data);
    }

    const newsroom = env.PREZLY_NEWSROOM_UUID;
    if (typeof newsroom === 'string' && newsroom) {
        event.tags = { ...event.tags, prezly_newsroom: newsroom };
    }

    return event;
}

function removeSpanAttribute(data: Bag | undefined) {
    if (data) {
        delete data[ENV_HEADER_SPAN_ATTRIBUTE];
    }
}
