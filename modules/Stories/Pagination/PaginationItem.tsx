import type { FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
    page: number;
    isDisabled?: boolean;
    isCurrent?: boolean;
}

const PaginationItem: FunctionComponent<Props> = ({
    page, isDisabled, isCurrent, children,
}) => {
    const { pathname, query } = useRouter();

    if (isDisabled || isCurrent) {
        return (
            <span
                style={{
                    margin: '0 10px',
                    ...(isDisabled && {
                        opacity: '50%',
                    }),
                    ...(isCurrent && {
                        fontWeight: 'bold',
                    }),
                }}
            >
                {children}
            </span>
        );
    }

    return (
        <Link
            href={{
                pathname,
                query: { ...query, page },
            }}
            passHref
        >
            <a style={{ margin: '0 10px' }}>
                <span>{children}</span>
            </a>
        </Link>
    );
};

export default PaginationItem;
