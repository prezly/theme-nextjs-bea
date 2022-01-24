// TypeScript still has poor Object.keys definition. This is a workaround for that
// See https://github.com/microsoft/TypeScript/issues/24243#issuecomment-405094044
export function getTypedKeys<T extends Object>(object: T): Array<keyof T> {
    return Object.keys(object) as Array<keyof T>;
}
