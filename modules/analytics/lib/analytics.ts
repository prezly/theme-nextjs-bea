const page = (): Promise<void> => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(
            `page(${JSON.stringify({ title: document.title, href: document.location.href })});`,
        );
    }

    return new Promise((resolve) => {
        // resolve after timeout even if analytics doesn't resolve
        // do it first to ignore eventual errors from analytics lib
        setTimeout(resolve, 500);
        window.analytics.page(resolve);
    });
};

const track = (event: string, meta: object = {}): Promise<void> => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`track("${event}", ${JSON.stringify(meta)});`);
    }

    return new Promise((resolve) => {
        // resolve after timeout even if analytics doesn't resolve
        // do it first to ignore eventual errors from analytics lib
        setTimeout(resolve, 500);
        window.analytics.track(event, meta, { integrations: undefined }, resolve);
    });
};

const trackLink = (element: HTMLLinkElement, event: string, meta: object = {}): void => {
    window.analytics.trackLink(element, event, meta);
};

/**
 * Calling reset resets the id, including anonymousId, and clear traits for the currently identified user and group.
 *
 * Note: The reset method only clears the cookies and localStorage set by Segment,
 *       not the those of integrated end-tools, as their native libraries might set their own cookies
 *       to manage user tracking, sessions, and manage state. To completely clear out the user session,
 *       check the documentation provided by those tools.
 *
 * @see https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#reset--logout
 */
const reset = (): void => {
    window.analytics.reset();
};

export { page, reset, track, trackLink };
