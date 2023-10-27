export type IntlDictionary = Record<string, IntlMessageFormat>;
export type IntlMessageFormat = { type: 0 | 1; value: string }[];

export interface IntlMessageDescriptor {
    id: string;
    defaultMessage?: string;
}

export type IntlMessageValues<T> = Record<string, T>;
