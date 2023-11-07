import type { Category } from '@prezly/sdk';

export interface CategoryDisplayProps {
    id: Category['id'];
    name: string;
    href: string;
    description: string | null;
}
