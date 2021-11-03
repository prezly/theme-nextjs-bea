import { useNewsroomContext } from '@/contexts/newsroom';

export const useSelectedStory = () => {
    const context = useNewsroomContext();

    return context.selectedStory;
};
