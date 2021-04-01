const publishedAndPublic = [
    { $and: [{ lifecycle_status: { $in: ['published'] } }] },
    { $and: [{ visibility: { $in: ['public'] } }] },
];

export const getSlugQuery = (slug: string) => ({
    $and: [{ slug: { $eq: slug } }, ...publishedAndPublic],
});

export const getStoriesQuery = (newsroomUuid: string, categoryId?: number) => {
    const query: any = {
        $and: [...publishedAndPublic, { 'newsroom.uuid': { $in: [newsroomUuid] } }],
    };

    if (categoryId) {
        query.$and.push({ 'category.id': { $any: [categoryId] } });
    }

    return query;
};

export const getSortByPublishedDate = (order: 'asc' | 'desc') => (order === 'desc' ? '-published_at' : 'published_at');
