import type { Category as CategoryType, TranslatedCategory } from '@prezly/sdk';
import Image from '@prezly/uploadcare-image';

import { app } from '@/adapters/server';
import { PageTitle } from '@/components/PageTitle';

import { InfiniteStories } from '../InfiniteStories';

import styles from './Category.module.scss';

interface Props {
    category: CategoryType;
    pageSize: number;
    translatedCategory: TranslatedCategory;
}

export async function Category({ category, pageSize, translatedCategory }: Props) {
    const { stories, pagination } = await app().stories({
        limit: pageSize,
        category,
        locale: { code: translatedCategory.locale },
    });

    const newsroom = await app().newsroom();
    const languageSettings = await app().languageOrDefault(translatedCategory.locale);

    return (
        <>
            <div className={styles.header}>
                <PageTitle
                    className={styles.title}
                    title={translatedCategory.name}
                    subtitle={translatedCategory.description}
                />
                {category.image && (
                    <div className={styles.imageContainer}>
                        <Image
                            imageDetails={category.image}
                            alt={translatedCategory.name}
                            layout="fill"
                            objectFit="cover"
                            sizes={{ default: 180 }}
                            className={styles.image}
                        />
                    </div>
                )}
            </div>
            <InfiniteStories
                initialStories={stories}
                pageSize={pageSize}
                category={category}
                total={pagination.matched_records_number}
                newsroomName={languageSettings.company_information.name || newsroom.name}
                isCategoryList
            />
        </>
    );
}
