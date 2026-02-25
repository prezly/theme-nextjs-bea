export function decodePreviewHash(hash: string): Record<string, string> | null {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!raw.startsWith('preview=')) return null;
    const encoded = raw.slice(8);
    try {
        let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        const parsed = JSON.parse(new TextDecoder().decode(bytes));
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            return null;
        }
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'string') {
                result[key] = value;
            }
        }
        return Object.keys(result).length > 0 ? result : null;
    } catch {
        return null;
    }
}
