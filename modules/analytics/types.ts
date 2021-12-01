export interface AnalyticsJs {
    page: (resolve: Function) => void;
    reset: () => void;
    track: (
        event: string,
        meta: object,
        integrations: { integrations: { All: boolean; Mixpanel: boolean } | undefined },
        resolve: Function,
    ) => void;
    trackLink: (element: HTMLLinkElement, event: string, meta: object) => void;
}
