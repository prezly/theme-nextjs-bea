const publishedAndAccessible = [
    { lifecycle_status: { $in: ['published'] } },
    { visibility: { $in: ['public', 'private'] } },
];

const publishedAndPublic = [
    { lifecycle_status: { $in: ['published'] } },
    { visibility: { $in: ['public'] } },
];

export const getSlugQuery = (newsroomUuid: string, slug: string) => ({
    $and: [
        { 'newsroom.uuid': { $in: [newsroomUuid] } },
        { slug: { $eq: slug } },
        ...publishedAndAccessible,
    ],
});

export const getStoriesQuery = (newsroomUuid: string, categoryId?: number, localeCode?: string) => {
    const query: any = {
        $and: [...publishedAndPublic, { 'newsroom.uuid': { $in: [newsroomUuid] } }],
    };

    if (categoryId) {
        query.$and.push({ 'category.id': { $any: [categoryId] } });
    }

    if (localeCode) {
        query.$and.push({ locale: { $in: [localeCode] } });
    }

    return query;
};

export const getSortByPublishedDate = (order: 'asc' | 'desc') =>
    order === 'desc' ? '-published_at' : 'published_at';

export const getGalleriesQuery = () => ({
    $and: [{ status: { $eq: 'public' } }, { images_number: { $gt: 0 } }],
});
