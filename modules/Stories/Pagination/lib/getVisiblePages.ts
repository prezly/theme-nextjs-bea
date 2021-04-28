const EXTRA_PAGES_COUNT = 2;

export default function getVisiblePages(pageIndex: number, pagesCount: number) {
    const firstVisibleIndexCandidate = Math.max(pageIndex - EXTRA_PAGES_COUNT, 1);
    const lastVisibleIndexCandidate = Math.min(pageIndex + EXTRA_PAGES_COUNT, pagesCount);
    const extraPagesCountLeft = pageIndex - firstVisibleIndexCandidate;
    const extraPagesCountRight = lastVisibleIndexCandidate - pageIndex;
    const firstVisibleIndex = Math.max(
        1,
        firstVisibleIndexCandidate - EXTRA_PAGES_COUNT + extraPagesCountRight,
    );
    const lastVisibleIndex = Math.min(
        lastVisibleIndexCandidate + EXTRA_PAGES_COUNT - extraPagesCountLeft,
        pagesCount,
    );
    return Array.from({ length: pagesCount })
        .map((_, index) => index)
        .slice(firstVisibleIndex, lastVisibleIndex + 1);
}
