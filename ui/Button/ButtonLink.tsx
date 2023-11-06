import classNames from 'classnames';

import { Link } from '@/components/Link';

import { Icon } from './Icon';
import type { BaseProps } from './types';

import styles from './Button.module.scss';

export function ButtonLink({
    children,
    className,
    href,
    icon,
    iconPlacement = 'left',
    variation,
    ...attributes
}: ButtonLink.Props) {
    return (
        <Link
            href={href}
            className={classNames(styles.button, className, {
                [styles.primary]: variation === 'primary',
                [styles.secondary]: variation === 'secondary',
                [styles.navigation]: variation === 'navigation',
                [styles.iconOnly]: Boolean(icon) && !children,
            })}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...attributes}
        >
            {iconPlacement === 'left' && <Icon icon={icon} placement="left" />}
            {children && <span className={styles.label}>{children}</span>}
            {iconPlacement === 'right' && <Icon icon={icon} placement="right" />}
        </Link>
    );
}

export namespace ButtonLink {
    export type Props = BaseProps & Omit<Link.Props, 'onResize' | 'onResizeCapture'>;
}
