import { serializeJsonLd, type JsonLdSchema } from '@/utils';

interface Props {
    schema: JsonLdSchema | JsonLdSchema[];
}

export function JsonLd({ schema }: Props) {
    return (
        <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be injected as a raw <script> tag; serializeJsonLd escapes `<` to prevent breaking out of it.
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
    );
}
