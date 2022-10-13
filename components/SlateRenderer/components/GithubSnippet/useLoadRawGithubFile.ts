import { useEffect, useState } from 'react';

export function useLoadRawGithubFile(rawFileUrl: string) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [textContent, setTextContent] = useState<string>();

    useEffect(() => {
        async function processRawGithubFile(fileUrl: string) {
            setIsLoading(true);
            setError(undefined);
            setTextContent(undefined);

            try {
                const fileContent = await fetch(fileUrl).then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error(`${response.status} ${response.statusText}`);
                });

                setIsLoading(false);
                setTextContent(fileContent);
            } catch (caughtError: unknown) {
                if (caughtError instanceof Error) {
                    setError(caughtError.message);
                } else {
                    setError('Unkown error occured.');
                    // eslint-disable-next-line no-console
                    console.error(caughtError);
                }
            }
        }

        processRawGithubFile(rawFileUrl);
    }, [rawFileUrl]);

    return { textContent, isLoading, error };
}
