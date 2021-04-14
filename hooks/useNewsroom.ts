import { useContext } from 'react';
import { NewsroomContext } from '@/contexts/newsroom';

export const useNewsroom = () => {
    const context = useContext(NewsroomContext);

    return context.newsroom;
};
