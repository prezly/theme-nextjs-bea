import type { ContentDelivery } from '@prezly/theme-kit-nextjs';

export type ContentDeliveryClient = ReturnType<typeof ContentDelivery.createClient>; // TODO: Provide this type with the theme-kit package exports
