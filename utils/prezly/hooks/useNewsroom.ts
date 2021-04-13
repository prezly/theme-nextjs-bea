import { useContext } from 'react';
import { NewsroomContext } from '@/utils/prezly/context';

export const useNewsroom = () => {
    const context = useContext(NewsroomContext);

    return context.newsroom;
};
