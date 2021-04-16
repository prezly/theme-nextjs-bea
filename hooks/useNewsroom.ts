import { useNewsroomContext } from '@/contexts/newsroom';

export const useNewsroom = () => {
    const context = useNewsroomContext();

    return context.newsroom;
};
