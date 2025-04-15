'use client';

import type { Locale } from '@prezly/theme-kit-nextjs';
import type { ComponentProps, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useIntl, useRouting } from '@/adapters/client';
import type { AppUrlGeneratorParams } from '@/adapters/server';
import { withoutUndefined } from '@/utils';

type Revoke = () => void;

interface TranslationsMap {
    [localeCode: Locale.Code]: string | undefined;
}

interface Translation {
    code: Locale.Code;
    href: string | undefined;
}

interface Context {
    translations: TranslationsMap;
    broadcast: (translations: Translation[]) => Revoke;
}

const context = createContext<Context>({
    translations: {},
    broadcast() {
        throw new Error(
            'This functionality requires `BroadcastTranslationsProvider` mounted up the components tree.',
        );
    },
});

interface Entry {
    translations: Translation[];
}

export function BroadcastTranslationsProvider(props: { children: ReactNode }) {
    const [entries, setEntries] = useState<Entry[]>([]);

    const broadcast = useCallback(
        (translations: Translation[]) => {
            const entry: Entry = { translations };

            setEntries((prev) => [...prev, entry]);

            return () => setEntries((prev) => prev.filter((existing) => existing !== entry));
        },
        [setEntries],
    );

    const value = useMemo(() => {
        const translations = entries.reduce<TranslationsMap>((agg, entry) => {
            const partial = Object.fromEntries(
                entry.translations.map(({ code, href }) => [code, href]),
            );
            return { ...agg, ...withoutUndefined(partial) };
        }, {});

        return { translations, broadcast };
    }, [entries, broadcast]);

    return <context.Provider value={value}>{props.children}</context.Provider>;
}

type Props =
    | ComponentProps<typeof BroadcastTranslationsList>
    | ComponentProps<typeof BroadcastTranslationsGenerator>;

export function BroadcastTranslations(props: Props) {
    if ('translations' in props) {
        return <BroadcastTranslationsList translations={props.translations} />;
    }

    return <BroadcastTranslationsGenerator {...props} />;
}

function BroadcastTranslationsGenerator(
    props: AppUrlGeneratorParams & { locales?: Locale.Code[] },
) {
    const { locales: enabledLocales } = useIntl();
    const { generateUrl } = useRouting();

    const locales = props.locales ?? enabledLocales;
    const translations = locales.map((localeCode) => ({
        code: localeCode,
        href: generateUrl(props.routeName, { ...props.params, localeCode }),
    }));

    useBroadcastTranslations(translations);
    return null;
}

function BroadcastTranslationsList(props: { translations: Translation[] }) {
    useBroadcastTranslations(props.translations);
    return null;
}

export function useBroadcastTranslations(translations: Translation[]) {
    const { broadcast } = useContext(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => broadcast(translations), [JSON.stringify(translations)]);
}

export function useBroadcastedTranslations(): TranslationsMap {
    return useContext(context).translations;
}
