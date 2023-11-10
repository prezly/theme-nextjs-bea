import { headers } from 'next/headers';

import { collectEnvVariables } from './lib';

export function integrateEnvironment<T>(validate: (vars: Record<string, unknown>) => T) {
    function useEnvironment(): T {
        const variables = collectEnvVariables(process.env, headers());
        return validate(variables);
    }

    return { useEnvironment };
}
