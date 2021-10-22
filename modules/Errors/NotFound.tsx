import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';

import Button from '@/components/Button';
import Error from '@/components/Error';

const NotFound: FunctionComponent = () => {
    const router = useRouter();

    return (
        <Error
            action={
                <Button onClick={() => router.push('/')} variation="primary">
                    Back to Homepage
                </Button>
            }
            statusCode={404}
            title="Oops! Something went wrong"
            description="The page you’re looking for doesn’t exist..."
        />
    );
};

export default NotFound;
