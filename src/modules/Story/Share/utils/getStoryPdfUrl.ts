import type { Story } from '@prezly/sdk';

export async function getStoryPdfUrl(uuid: Story['uuid']): Promise<string | null> {
    const response = await fetch(`/api/stories/${uuid}/pdf`);

    if (!response.ok) {
        return null;
    }

    const { url } = (await response.json()) as { url: string | null };

    return url;
}
