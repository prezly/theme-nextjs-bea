import type { Story } from '@prezly/sdk';
import { format } from 'date-fns';
import Link from 'next/link';

interface Props {
    stories?: Story[] | null;
}

export function RelatedStories({ stories }: Props) {
    if (!stories) {
        return null;
    }

    return (
        <div className="mt-20">
            <h2 className="text-2xl font-semibold mb-8">Other articles in the series</h2>

            <ul>
                {stories.map((story) => (
                    <li key={story.uuid} className="mb-4">
                        <Link href={`/${story.slug}`}>
                            <a className="flex items-center flex-nowrap group">
                                <p className="w-24 text-sm text-gray-500">
                                    {format(new Date(story.published_at!), 'dd/MM/yyyy')}
                                </p>
                                <p className="text-lg font-medium group-hover:text-primary">
                                    {story.title}
                                </p>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
