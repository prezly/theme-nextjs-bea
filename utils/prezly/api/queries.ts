const publishedAndPublic = [
    { $and: [{ lifecycle_status: { $in: ['published'] } }] },
    { $and: [{ visibility: { $in: ['public'] } }] },
];

export const getSlugQuery = (slug: string) => ({
    $and: [
        { slug: { $eq: slug } },
        ...publishedAndPublic,
    ],
});

export const getStoriesQuery = (newsroomId: number, categoryId?: number) => {
    const query: any = {
        $and: [
            ...publishedAndPublic,
            { 'newsroom.id': { $in: [newsroomId] } },
        ],
    };

    if (categoryId) {
        query.$and.push(
            // TODO: filter by category
        );
    }

    return query;
};

export const getSortByPublishedDate = (order: 'asc' | 'desc' = 'desc') => (order === 'desc' ? '-published_at' : 'published_at');
