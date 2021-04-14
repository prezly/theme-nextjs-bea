import { useNewsroomContext } from '@/contexts/newsroom';

export const useSelectedCategory = () => {
    const context = useNewsroomContext();

    return context.selectedCategory;
};
