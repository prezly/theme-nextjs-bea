import { useContext } from 'react';
import { NewsroomContext } from '@/contexts/newsroom';

export const useSelectedCategory = () => {
    const context = useContext(NewsroomContext);

    return context.selectedCategory;
};
