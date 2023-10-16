import type { NextRequest } from 'next/server';

import { withHttpEnv } from './env';

export function setupMiddleware() {
    return (request: NextRequest) => withHttpEnv(request);
}
