/* eslint-disable @typescript-eslint/naming-convention */

// TODO: Should this be translated?
const UNITS = ['bytes', 'Kb', 'Mb', 'Gb'];

// Convert byte amounts to meaningful text
export function formatBytes(bytes: number | string): string {
    let l = 0;
    let n = typeof bytes === 'number' ? bytes : parseInt(bytes, 10) || 0;

    while (n >= 1024) {
        n /= 1024;
        l += 1;
    }

    return `${n.toFixed(n >= 10 || l < 1 ? 0 : 1)} ${UNITS[l]}`;
}

/*
 * This list contains all mime types ever used in Prezly story content "file attachment" blocks.
 * Except unrecognized "octet-stream" and "x-download" fallbacks.
 *
 * ```sql
 * SELECT node->'file'->>'mime_type', COUNT(*) FROM press_release, jsonb_array_elements(slate_content_json->'children') node
 * WHERE node->>'type' = 'attachment'
 * GROUP by 1
 * ORDER by 2 DESC;
 * ```
 */
const MAPPING: Record<string, string | undefined> = {
    'application/msword': 'doc',
    'application/pdf': 'pdf',
    'application/postscript': 'ps',
    'application/vnd.adobe.illustrator': 'ai',
    'application/vnd.adobe.photoshop': 'psd',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.ms-powerpoint.presentation.macroenabled.12': 'pptm',
    'application/vnd.ms-powerpoint.slideshow.macroenabled.12': 'ppsm',
    'application/vnd.ms-word.document.macroenabled.12': 'docm',
    'application/vnd.oasis.opendocument.text': 'odt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'dotx',
    'application/x-indesign': 'indd',
    'application/x-iwork-pages-sffpages': 'pages',
    'application/x-msdownload': 'exe',
    'application/x-pdf': 'pdf',
    'application/x-rar-compressed': 'rar',
    'application/x-shockwave-flash': 'swf',
    'application/x-tar': 'tar',
    'application/x-zip-compressed': 'zip',
    'application/zip': 'zip',
    'audio/aac': 'aac',
    'audio/mp3': 'mp3',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'ogg',
    'audio/vnd.dlna.adts': 'adts',
    'audio/wav': 'wav',
    'audio/x-m4a': 'm4a',
    'audio/x-wav': 'wav',
    'image/bmp': 'bmp',
    'image/cr2': 'cr2',
    'image/gif': 'gif',
    'image/heic': 'heic',
    'image/jp2': 'jp2',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/tiff': 'tiff',
    'image/vnd.adobe.photoshop': 'psd',
    'image/vnd.fpx': 'fpx',
    'image/webp': 'webp',
    'message/rfc822': 'eml',
    'multipart/related': 'mhtml',
    'text/calendar': 'ics',
    'text/css': 'css',
    'text/csv': 'csv',
    'text/html': 'html',
    'text/plain': 'txt',
    'text/rtf': 'rtf',
    'video/avi': 'avi',
    'video/mp4': 'mp4',
    'video/mpeg': 'mpeg',
    'video/ogg': 'ogv',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
    'video/x-flv': 'flv',
    'video/x-m4v': 'm4v',
    'video/x-matroska': 'mkv',
    'video/x-ms-asf': 'asf',
    'video/x-ms-wmv': 'wmv',
    'video/x-msvideo': 'avi',
};

/*
 * This function covers the most common mime types we deal with in Prezly.
 *
 * There are NPM packages that do this better (i.e. support an exhaustive list of mime types),
 * but I don't want to significantly increase the bundle size just for this tiny job ("11KB gzipped").
 *
 * @see https://www.npmjs.com/package/mime
 * @see https://www.npmjs.com/package/mime-types
 */
export function getMimeTypeExtension(mimeType: string): string | undefined {
    const lowercaseType = mimeType.toLowerCase();
    return MAPPING[lowercaseType] ?? MAPPING[lowercaseType.split(';')[0]!];
}
