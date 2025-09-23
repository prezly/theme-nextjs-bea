import type { Category, TranslatedCategory } from '@prezly/sdk';

import type { ListStory } from '@/types';

// Mock data for development when Prezly API is not available
export const mockCategories: Category[] = [
    {
        id: 1,
        name: 'Getting Started',
        slug: 'getting-started',
        description: 'Learn the basics of using our platform',
        image: null,
        is_featured: true,
        i18n: {
            en: {
                name: 'Getting Started',
                slug: 'getting-started',
                description: 'Learn the basics of using our platform',
                public_stories_number: 5,
            },
        },
    },
    {
        id: 2,
        name: 'Account Management',
        slug: 'account-management',
        description: 'Manage your account settings and preferences',
        image: null,
        is_featured: true,
        i18n: {
            en: {
                name: 'Account Management',
                slug: 'account-management',
                description: 'Manage your account settings and preferences',
                public_stories_number: 8,
            },
        },
    },
    {
        id: 3,
        name: 'Troubleshooting',
        slug: 'troubleshooting',
        description: 'Common issues and how to resolve them',
        image: null,
        is_featured: false,
        i18n: {
            en: {
                name: 'Troubleshooting',
                slug: 'troubleshooting',
                description: 'Common issues and how to resolve them',
                public_stories_number: 12,
            },
        },
    },
    {
        id: 4,
        name: 'API Documentation',
        slug: 'api-documentation',
        description: 'Developer resources and API guides',
        image: null,
        is_featured: false,
        i18n: {
            en: {
                name: 'API Documentation',
                slug: 'api-documentation',
                description: 'Developer resources and API guides',
                public_stories_number: 15,
            },
        },
    },
] as any;

export const mockTranslatedCategories: TranslatedCategory[] = [
    {
        id: 1,
        name: 'Getting Started',
        slug: 'getting-started',
        description: 'Learn the basics of using our platform',
    },
    {
        id: 2,
        name: 'Account Management',
        slug: 'account-management',
        description: 'Manage your account settings and preferences',
    },
    {
        id: 3,
        name: 'Troubleshooting',
        slug: 'troubleshooting',
        description: 'Common issues and how to resolve them',
    },
    {
        id: 4,
        name: 'API Documentation',
        slug: 'api-documentation',
        description: 'Developer resources and API guides',
    },
] as any;

export const mockStories: ListStory[] = [
    {
        uuid: '1',
        title: 'How to Create Your First Account',
        slug: 'how-to-create-your-first-account',
        subtitle: 'A step-by-step guide to getting started',
        published_at: '2024-01-15T10:00:00Z',
        thumbnail_image: null,
        tags: ['#2'],
        content: JSON.stringify([
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Welcome to our Help Center! This guide will walk you through creating your first account and getting started with our platform.',
                    },
                ],
            },
            {
                type: 'heading-two',
                children: [{ text: 'Step 1: Sign Up' }],
            },
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Visit our sign-up page and enter your email address and desired password.',
                    },
                ],
            },
            {
                type: 'heading-two',
                children: [{ text: 'Step 2: Verify Your Email' }],
            },
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Check your email for a verification link and click it to activate your account.',
                    },
                ],
            },
        ]),
        links: {
            short: 'https://example.com/1',
            newsroom_view: 'https://example.com/how-to-create-your-first-account',
        },
        categories: [mockCategories[0]],
        newsroom: {
            uuid: 'newsroom-1',
            name: 'Help Center',
            newsroom_logo: null,
        } as any,
    },
    {
        uuid: '2',
        title: 'Setting Up Your Profile',
        slug: 'setting-up-your-profile',
        subtitle: 'Customize your profile to get the most out of our platform',
        published_at: '2024-01-14T14:30:00Z',
        thumbnail_image: null,
        tags: ['#1'],
        content: JSON.stringify([
            {
                type: 'paragraph',
                children: [
                    {
                        text: 'Learn how to customize your profile settings for the best experience.',
                    },
                ],
            },
        ]),
        links: {
            short: 'https://example.com/2',
            newsroom_view: 'https://example.com/setting-up-your-profile',
        },
        categories: [mockCategories[1]],
        newsroom: {
            uuid: 'newsroom-1',
            name: 'Help Center',
            newsroom_logo: null,
        } as any,
    },
    {
        uuid: '3',
        title: 'Understanding Dashboard Features',
        slug: 'understanding-dashboard-features',
        subtitle: 'Explore all the powerful features available in your dashboard',
        published_at: '2024-01-13T09:15:00Z',
        thumbnail_image: null,
        tags: ['#3'],
        content: JSON.stringify([
            {
                type: 'paragraph',
                children: [{ text: 'Explore the powerful features available in your dashboard.' }],
            },
        ]),
        links: {
            short: 'https://example.com/3',
            newsroom_view: 'https://example.com/understanding-dashboard-features',
        },
        categories: [mockCategories[0]],
        newsroom: {
            uuid: 'newsroom-1',
            name: 'Help Center',
            newsroom_logo: null,
        } as any,
    },
    {
        uuid: '4',
        title: 'Troubleshooting Login Issues',
        slug: 'troubleshooting-login-issues',
        subtitle: 'Common login problems and their solutions',
        published_at: '2024-01-12T16:45:00Z',
        thumbnail_image: null,
        tags: ['#5'],
        content: JSON.stringify([
            {
                type: 'paragraph',
                children: [{ text: 'Common login problems and their solutions.' }],
            },
        ]),
        links: {
            short: 'https://example.com/4',
            newsroom_view: 'https://example.com/troubleshooting-login-issues',
        },
        categories: [mockCategories[2]],
        newsroom: {
            uuid: 'newsroom-1',
            name: 'Help Center',
            newsroom_logo: null,
        } as any,
    },
    {
        uuid: '5',
        title: 'API Authentication Guide',
        slug: 'api-authentication-guide',
        subtitle: 'Learn how to authenticate with our API',
        published_at: '2024-01-11T11:20:00Z',
        thumbnail_image: null,
        tags: ['#6'],
        content: JSON.stringify([
            {
                type: 'paragraph',
                children: [{ text: 'Learn how to authenticate with our API.' }],
            },
        ]),
        links: {
            short: 'https://example.com/5',
            newsroom_view: 'https://example.com/api-authentication-guide',
        },
        categories: [mockCategories[3]],
        newsroom: {
            uuid: 'newsroom-1',
            name: 'Help Center',
            newsroom_logo: null,
        } as any,
    },
    {
        uuid: '6',
        title: 'Managing Your Subscription',
        slug: 'managing-your-subscription',
        subtitle: 'How to upgrade, downgrade, or cancel your subscription',
        published_at: '2024-01-10T13:10:00Z',
        thumbnail_image: null,
        tags: ['#4'],
        content: JSON.stringify([
            {
                type: 'paragraph',
                children: [{ text: 'How to upgrade, downgrade, or cancel your subscription.' }],
            },
        ]),
        links: {
            short: 'https://example.com/6',
            newsroom_view: 'https://example.com/managing-your-subscription',
        },
        categories: [mockCategories[1]],
        newsroom: {
            uuid: 'newsroom-1',
            name: 'Help Center',
            newsroom_logo: null,
        } as any,
    },
] as any;

export function getMockStoriesForCategory(categorySlug: string): ListStory[] {
    return mockStories.filter((story) =>
        story.categories.some((cat) => (cat as any).slug === categorySlug),
    );
}
