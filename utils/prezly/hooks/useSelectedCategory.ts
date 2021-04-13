import { useContext } from 'react';
import { NewsroomContext } from '@/utils/prezly/context';

export const useSelectedCategory = () => {
    const context = useContext(NewsroomContext);

    return context.selectedCategory;
};
