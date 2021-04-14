import { useContext } from 'react';
import { NewsroomContext } from '@/contexts/newsroom';

export const useCategories = () => {
    const context = useContext(NewsroomContext);

    return context.categories;
};
