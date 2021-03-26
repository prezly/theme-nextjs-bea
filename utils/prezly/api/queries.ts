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

export const getStoriesQuery = () => ({
    $and: [
        ...publishedAndPublic,
    ],
});

export const getSortByPublishedDate = (order: 'asc' | 'desc' = 'desc') => (order === 'desc' ? '-published_at' : 'published_at');
