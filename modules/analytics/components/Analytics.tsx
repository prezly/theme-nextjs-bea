import { useRouter } from 'next/router';
import { FunctionComponent, useEffect } from 'react';
import { usePrevious } from 'react-use';

import { useAnalytics } from '../hooks';

const Analytics: FunctionComponent = () => {
    const { page } = useAnalytics();
    const { asPath: currentPath } = useRouter();
    const previousPath = usePrevious(currentPath);

    useEffect(() => {
        if (currentPath !== previousPath) {
            page();
        }
    }, [currentPath, page, previousPath]);

    return null;
};

export default Analytics;
