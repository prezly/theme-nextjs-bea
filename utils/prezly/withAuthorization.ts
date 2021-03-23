import type { GetServerSideProps } from 'next';
import checkIsAuthorized from './checkIsAuthorized';

const withAuthorization = <P>(getServerSideProps: GetServerSideProps<P>): GetServerSideProps<P> => {
    return async (context) => {
        const isAuthorized = checkIsAuthorized(context.req);

        if (isAuthorized) {
            return await getServerSideProps(context);
        }

        context.res.writeHead(403, 'Forbidden');
        context.res.end();

        return { notFound: true };
    };
};

export default withAuthorization;
