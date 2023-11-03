export type Awaitable<T> = T | Promise<T> | PromiseLike<T>;

export type ExtractPathParams<T extends string> =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends `${infer _Start}(/:${infer Param})/${infer Rest}`
        ? { [k in Param]?: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(:${infer Param})/${infer Rest}`
        ? { [k in Param]?: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}:${infer Param}/${infer Rest}`
        ? { [k in Param]: string } & ExtractPathParams<Rest>
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(/:${infer Param})`
        ? { [k in Param]?: string }
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}(:${infer Param})`
        ? { [k in Param]?: string }
        : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        T extends `${infer _Start}:${infer Param}`
        ? { [k in Param]: string }
        : unknown;
