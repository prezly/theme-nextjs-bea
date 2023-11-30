import type { RequestContext } from './remix/types';

declare global {
    namespace Express {
        interface Locals extends RequestContext {}
    }
}
