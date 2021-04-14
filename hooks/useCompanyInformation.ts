import { useNewsroomContext } from '@/contexts/newsroom';

export const useCompanyInformation = () => {
    const context = useNewsroomContext();

    return context.companyInformation;
};
