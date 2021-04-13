import { useContext } from 'react';
import { NewsroomContext } from '@/utils/prezly/context';

export const useCategories = () => {
    const context = useContext(NewsroomContext);

    return context.categories;
};
