import type { IconComponentType } from '@prezly/icons';

export interface BaseProps {
    variation: 'primary' | 'secondary' | 'navigation';
    className?: string;
    icon?: IconComponentType;
    iconPlacement?: 'left' | 'right';
}
