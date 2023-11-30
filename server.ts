/* eslint-disable import/order,@typescript-eslint/no-shadow */

// native node modules
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

// npm dependencies
import { Story } from '@prezly/sdk';
import type { GetLoadContextFunction } from '@remix-run/express';
import { createRequestHandler } from '@remix-run/express';
import type { ServerBuild } from '@remix-run/node';
import { broadcastDevReady, installGlobals } from '@remix-run/node';
import compression from 'compression';
import dotenv from 'dotenv';
import type { RequestHandler } from 'express';
import express from 'express';
import morgan from 'morgan';
import sourceMapSupport from 'source-map-support';

import { validateEnvironment } from './remix/environment';
import {
    defineAppEnvironment,
    defineAppRouting,
    defineContentDeliveryClient,
    defineNewsroomContext,
    handleIntlRouting,
} from './remix/middleware';

sourceMapSupport.install();
installGlobals();

dotenv.config({ path: './.env.local' });

const getLoadContext: GetLoadContextFunction = (_, res) => res.locals;

const BUILD_PATH = path.resolve('build/index.js');
const VERSION_PATH = path.resolve('build/version.txt');

const initialBuild = await reimportServer();

const app = express();

const remixHandler =
    process.env.NODE_ENV === 'development'
        ? await createDevRequestHandler(initialBuild)
        : createRequestHandler({
              build: initialBuild,
              mode: initialBuild.mode,
              getLoadContext,
          });

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

app.use(morgan('tiny'));

app.use(defineAppEnvironment(validateEnvironment));
app.use(defineContentDeliveryClient({ formats: [Story.FormatVersion.SLATEJS_V5] }));
app.use(defineNewsroomContext());
app.use(defineAppRouting());
app.use(handleIntlRouting());

app.all('*', remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    console.log(`Express server listening at http://localhost:${port}/`);

    if (process.env.NODE_ENV === 'development') {
        broadcastDevReady(initialBuild);
    }
});

async function reimportServer(): Promise<ServerBuild> {
    const stat = fs.statSync(BUILD_PATH);

    // convert build path to URL for Windows compatibility with dynamic `import`
    const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

    // use a timestamp query parameter to bust the import cache
    return import(`${BUILD_URL}?t=${stat.mtimeMs}`);
}

async function createDevRequestHandler(initialBuild: ServerBuild): Promise<RequestHandler> {
    let build = initialBuild;
    async function handleServerUpdate() {
        // 1. re-import the server build
        build = await reimportServer();
        // 2. tell Remix that this app server is now up-to-date and ready
        broadcastDevReady(build);
    }
    const chokidar = await import('chokidar');
    chokidar
        .watch(VERSION_PATH, { ignoreInitial: true })
        .on('add', handleServerUpdate)
        .on('change', handleServerUpdate);

    // wrap request handler to make sure its recreated with the latest build for every request
    return async (req, res, next) => {
        try {
            return await createRequestHandler({
                build,
                mode: 'development',
                getLoadContext,
            })(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}
