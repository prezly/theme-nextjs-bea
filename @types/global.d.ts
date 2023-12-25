import type { PrezlyEnv } from '@prezly/theme-kit-nextjs';

declare global {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    export namespace NodeJS {
        export interface ProcessEnv extends PrezlyEnv {
            // biome-ignore lint/style/useNamingConvention: <explanation>
            NEXT_PUBLIC_HCAPTCHA_SITEKEY: string;
        }
    }
}
