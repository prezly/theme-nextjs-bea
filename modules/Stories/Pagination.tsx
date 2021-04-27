import type { FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PaginationProps } from 'types';

const Pagination: FunctionComponent<PaginationProps> = ({ itemsTotal, currentPage, pageSize }) => {
    const { pathname, query } = useRouter();
    const totalPages = Math.ceil(itemsTotal / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

    function getPageUrl(page: number) {
        return {
            pathname,
            query: { ...query, page },
        };
    }

    return (
        <div>
            {currentPage > 1 ? (
                <Link href={getPageUrl(currentPage - 1)} passHref>
                    <a style={{ margin: '0 10px' }}>
                        <span>Previous</span>
                    </a>
                </Link>
            ) : (
                <span style={{ margin: '0 10px', opacity: '50%' }}>Previous</span>
            )}

            {pagesArray.map((page) => (
                page === currentPage ? (
                    <span key={`page-${page}`} style={{ margin: '0 10px', fontWeight: 'bold' }}>{page}</span>
                ) : (
                    <Link key={`page-${page}`} href={getPageUrl(page)} passHref>
                        <a style={{ margin: '0 10px' }}>
                            <span>{page}</span>
                        </a>
                    </Link>
                )
            ))}

            {currentPage < totalPages ? (
                <Link href={getPageUrl(currentPage)} passHref>
                    <a style={{ margin: '0 10px' }}>
                        <span>Next</span>
                    </a>
                </Link>
            ) : (
                <span style={{ margin: '0 10px', opacity: '50%' }}>Next</span>
            )}
        </div>
    );
};

export default Pagination;
