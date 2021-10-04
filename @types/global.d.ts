import { Env } from '../types';

declare global {
    export namespace NodeJS {
        export interface ProcessEnv extends Env {}
    }
}
