import { Category } from '@prezly/sdk';
import type { FunctionComponent } from 'react';

import styles from './CategoryHeader.module.scss';

type Props = {
    category: Category;
};

const CategoryHeader: FunctionComponent<Props> = ({ category }) => {
    const { display_name, display_description } = category;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{display_name}</h1>
            {display_description && <p className={styles.description}>{display_description}</p>}
        </div>
    );
};

export default CategoryHeader;
