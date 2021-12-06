import { useNewsroomContext } from '@/contexts/newsroom';

export const useCurrentLocale = () => {
    const context = useNewsroomContext();

    return context.locale;
};
