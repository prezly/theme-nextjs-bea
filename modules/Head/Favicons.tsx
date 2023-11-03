interface Props {
    faviconUrl: string | undefined;
    headerBackgroundColor: string;
}

export function Favicons({ faviconUrl, headerBackgroundColor }: Props) {
    if (!faviconUrl) {
        return null;
    }

    return (
        <>
            <link rel="shortcut icon" href={faviconUrl} />
            <link rel="apple-touch-icon" href={faviconUrl} />
            <meta name="msapplication-TileImage" content={faviconUrl} />

            <meta name="msapplication-TileColor" content={headerBackgroundColor} />
            <meta name="theme-color" content={headerBackgroundColor} />
        </>
    );
}
