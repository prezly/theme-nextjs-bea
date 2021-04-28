import type { FunctionComponent } from 'react';
import { PaginationProps } from 'types';
import getVisiblePages from './lib/getVisiblePages';
import PaginationItem from './PaginationItem';

const Pagination: FunctionComponent<PaginationProps> = ({ itemsTotal, currentPage, pageSize }) => {
    const totalPages = Math.ceil(itemsTotal / pageSize);

    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisiblePages(currentPage, totalPages);
    const shouldRenderFirstPage = !visiblePages.includes(1);
    const shouldRenderLeftGap = shouldRenderFirstPage && !visiblePages.includes(2);
    const shouldRenderLastPage = !visiblePages.includes(totalPages);
    const shouldRenderRightGap = shouldRenderLastPage && !visiblePages.includes(totalPages - 1);

    return (
        <div>
            <PaginationItem page={currentPage - 1} isDisabled={currentPage === 1}>
                Previous
            </PaginationItem>

            {shouldRenderFirstPage && (
                <PaginationItem page={1}>
                    1
                </PaginationItem>
            )}

            {shouldRenderLeftGap && (
                <span style={{ opacity: '50%' }}>...</span>
            )}

            {visiblePages.map((page) => (
                <PaginationItem key={`page-${page}`} page={page} isCurrent={currentPage === page}>
                    {page}
                </PaginationItem>
            ))}

            {shouldRenderRightGap && (
                <span style={{ opacity: '50%' }}>...</span>
            )}

            {shouldRenderLastPage && (
                <PaginationItem page={totalPages}>
                    {totalPages}
                </PaginationItem>
            )}

            <PaginationItem page={currentPage + 1} isDisabled={currentPage === totalPages}>
                Next
            </PaginationItem>
        </div>
    );
};

export default Pagination;
