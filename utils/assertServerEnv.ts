export function assertServerEnv(functionName: string) {
    if (typeof window !== 'undefined') {
        throw new Error(`"${functionName}" should only be used on server side.`);
    }
}
