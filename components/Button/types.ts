import type { FunctionComponent, SVGProps } from 'react';

export interface BaseProps {
    variation: 'primary' | 'secondary' | 'navigation';
    className?: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    iconPlacement?: 'left' | 'right';
}
