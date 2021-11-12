import { ASSETS_URL } from './constants';

export default function getUploadcareGroupUrl(uuid: string, title: string) {
    return `${ASSETS_URL}/${uuid}/archive/zip/${encodeURI(title)}.zip`;
}
