import Link, { LinkProps } from 'next/link';
import React, { FunctionComponent, PropsWithChildren } from 'react';

type Props = PropsWithChildren<LinkProps> & {
    className?: string;
};

// Implementation taken from https://headlessui.dev/react/menu#integrating-with-next-js
const CategoryLink: FunctionComponent<Props> = (props) => {
    const { href, children, ...rest } = props;

    return (
        <Link href={href}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <a {...rest}>{children}</a>
        </Link>
    );
};

export default CategoryLink;
