import { useNewsroomContext } from '@/contexts/newsroom';

export const useCategories = () => {
    const context = useNewsroomContext();

    return context.categories;
};
