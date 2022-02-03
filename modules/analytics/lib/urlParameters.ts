type ParameterPrefix = 'asset_' | 'utm_';

export function getUrlParameters(prefix: ParameterPrefix): Map<string, string> {
    const searchParams = new URLSearchParams(window.location.search);
    const map = new Map();

    searchParams.forEach((value, name) => {
        if (value && value !== 'undefined' && name.startsWith(prefix)) {
            map.set(name.replace(prefix, ''), value);
        }
    });

    return map;
}

export function stripUrlParameters(prefix: ParameterPrefix) {
    const url = new URL(window.location.href);
    const params = getUrlParameters(prefix);
    params.forEach((_, name) => url.searchParams.delete(`${prefix}${name}`));
    window.history.replaceState({}, document.title, url);
}
