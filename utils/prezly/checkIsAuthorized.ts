import { IncomingMessage } from 'http';

const checkIsAuthorized = (req: IncomingMessage) => {
    if (process.browser) {
        throw new Error('"checkIsAuthorized" should only be used on back-end side.');
    }

    const secret = process.env.HTTP_ENV_SECRET;
    const { authorization } = req!.headers;

    if (!secret) {
        return true;
    }

    if (!authorization || !req) {
        return false;
    }

    const [authorizationType, credentials] = authorization.split(' ');

    if (authorizationType.toLowerCase() === 'bearer') {
        return credentials === secret;
    }

    throw new Error(`Unknown authorization type "${authorizationType}"`);
};

export default checkIsAuthorized;
