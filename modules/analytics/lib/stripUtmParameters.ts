const UTM_PARAMETERS = ['utm_id', 'utm_source', 'utm_medium'];

export function stripUtmParameters() {
    const url = new URL(window.location.href);
    UTM_PARAMETERS.forEach((name) => url.searchParams.delete(name));
    window.history.replaceState({}, document.title, url);
}
