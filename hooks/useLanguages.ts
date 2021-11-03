import { useNewsroomContext } from '@/contexts/newsroom';

export const useLanguages = () => {
    const context = useNewsroomContext();

    return context.languages;
};
