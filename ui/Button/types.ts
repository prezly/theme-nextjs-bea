import type { Icon } from './Icon';

export interface CommonButtonProps {
    variation: 'primary' | 'secondary' | 'navigation';
    className?: string;
    icon?: Icon.Props['icon'];
    iconPlacement?: 'left' | 'right';
}
