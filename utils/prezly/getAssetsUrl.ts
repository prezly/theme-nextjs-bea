import { ASSETS_URL } from './constants';

export default function getAssetsUrl(uuid: string) {
    return `${ASSETS_URL}/${uuid}/`;
}
