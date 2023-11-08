/* eslint-disable @typescript-eslint/no-use-before-define */

'use client';

import type { Locale } from '@prezly/theme-kit-intl';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Href = string;
type Unregister = () => void;
export type LanguageVersions = {
    [localeCode in Locale.Code]?: Href;
};
type LanguageVersionsContext = {
    versions: LanguageVersions;
    register(versions: LanguageVersions): Unregister;
};
type Entry = { versions: LanguageVersions };

const context = createContext<LanguageVersionsContext>({
    versions: {},
    register() {
        throw new Error(
            'It is required to have <LanguageVersionsContextProvider> component up the tree in order to rely on this functionality.',
        );
    },
});

export function LanguageVersionsContextProvider(props: { children: ReactNode }) {
    const [entries, setEntries] = useState<Entry[]>([]);

    const combined = useMemo(() => combineEntries(entries), [entries]);

    const register = useCallback((versions: LanguageVersions) => {
        const entry = { versions };
        setEntries((prev) => [...prev, entry]);

        return () => {
            setEntries((prev) => prev.filter((existing) => existing !== entry));
        };
    }, []);

    return (
        <context.Provider value={{ versions: combined, register }}>
            {props.children}
        </context.Provider>
    );
}

export function useLanguageVersions(): LanguageVersions {
    const { versions } = useContext(context);

    return versions;
}

export function useRegisterLanguageVersions(versions: LanguageVersions) {
    const { register } = useContext(context);
    const versionsString = JSON.stringify(versions);
    useEffect(() => register(JSON.parse(versionsString)), [versionsString, register]);
}

export function RegisterLanguageVersions(props: { versions: LanguageVersions }) {
    useRegisterLanguageVersions(props.versions);

    return null;
}

function combineEntries(entries: Entry[]): LanguageVersions {
    return entries.reduce(
        (combined, entry) => ({
            ...combined,
            ...normalize(entry.versions),
        }),
        {},
    );
}

function normalize(languageVersions: LanguageVersions) {
    return Object.fromEntries(
        Object.entries(languageVersions).filter(([, href]) => typeof href !== 'undefined'),
    );
}
