import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import { IconLoading } from 'icons';

import { BaseProps } from './types';

import styles from './Button.module.scss';

interface Props {
    icon?: BaseProps['icon'];
    isLoading?: boolean;
}

const RightIcon: FunctionComponent<Props> = ({ icon: IconComponent, isLoading }) => {
    if (isLoading) {
        return <IconLoading className={classNames(styles.icon, styles.loading, styles.right)} />;
    }

    if (IconComponent) {
        return <IconComponent className={classNames(styles.icon, styles.right)} />;
    }

    return null;
};

export default RightIcon;
