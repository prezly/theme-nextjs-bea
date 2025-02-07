import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, FunctionComponent, RefAttributes, SVGProps } from 'react';

export type LucideComponentType = ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

export type IconComponentType = LucideComponentType | FunctionComponent<SVGProps<SVGSVGElement>>;
