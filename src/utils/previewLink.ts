export function decodePreviewHash(hash: string): Record<string, string> | null {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!raw.startsWith('p1=')) return null;
    const encoded = raw.slice(3);
    try {
        let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
        return null;
    }
}
