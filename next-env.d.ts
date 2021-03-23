/// <reference types="next" />
/// <reference types="next/types/global" />

import { Env } from './types';

declare global {
  export namespace NodeJS {
      export interface ProcessEnv extends Env {}
  }
}
