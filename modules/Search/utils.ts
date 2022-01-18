import { ParsedUrlQuery } from 'querystring';

export interface SearchState extends Record<string, any> {
    query: string;
    page: number;
}

export function searchStateToQuery(state?: SearchState): string {
    if (!state) {
        return '';
    }

    const { configure, page, ...rest } = state;

    return new URLSearchParams(rest).toString();
}

export function queryToSearchState(urlQuery: ParsedUrlQuery): SearchState {
    const { query } = urlQuery;

    return {
        query: typeof query === 'string' ? query : '',
        page: 1,
    };
}

export const createUrl = (state?: SearchState) => `?${searchStateToQuery(state)}`;
