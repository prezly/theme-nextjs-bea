export function stringify(...args: Array<any>) {
    return args.map((value) => JSON.stringify(value)).join(', ');
}
