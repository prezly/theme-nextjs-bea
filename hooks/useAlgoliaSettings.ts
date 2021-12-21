import { useNewsroomContext } from '@/contexts/newsroom';

export const useAlgoliaSettings = () => {
    const context = useNewsroomContext();

    return context.algoliaSettings;
};
