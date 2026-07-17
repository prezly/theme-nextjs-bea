import type { Story } from '@prezly/sdk';

/**
 * Browser-side helper — resolves the story PDF export URL through this site's
 * own `/api/stories/[uuid]/pdf` route. Must only be called from client code
 * (the relative URL has no meaning during server rendering).
 */
export async function getStoryPdfUrl(uuid: Story['uuid']): Promise<string | null> {
    const response = await fetch(`/api/stories/${uuid}/pdf`);

    if (!response.ok) {
        return null;
    }

    const data: unknown = await response.json().catch(() => null);

    if (data && typeof data === 'object' && 'url' in data && typeof data.url === 'string') {
        return data.url;
    }

    return null;
}
