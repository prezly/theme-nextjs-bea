import type { IconComponentType } from '@/icons';

export interface BaseProps {
    variation: 'primary' | 'secondary' | 'navigation';
    className?: string;
    icon?: IconComponentType;
    iconPlacement?: 'left' | 'right';
}
