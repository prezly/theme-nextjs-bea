export type { Route, Router, RoutesMap, UrlGenerator, UrlGeneratorParams } from './lib/types';

export { createRouter as router } from './lib/createRouter.server';
export { createRoute as route } from './lib/createRoute.server';

export { integrateRouting } from './lib/integrateRouting.server';
