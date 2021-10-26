import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { IconLoading } from 'icons';

import { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props {
    icon?: BaseProps['icon'];
    isLoading?: boolean;
}

const LeftIcon: FunctionComponent<Props> = ({ icon: IconComponent, isLoading }) => {
    if (isLoading) {
        return <IconLoading className={classNames(styles.icon, styles.loading, styles.left)} />;
    }

    if (IconComponent) {
        return <IconComponent className={classNames(styles.icon, styles.left)} />;
    }

    return null;
};

export default LeftIcon;
