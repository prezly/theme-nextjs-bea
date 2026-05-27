'use client';

import type { ReactNode } from 'react';

import { usePreviewSettings } from '@/hooks';

interface Props {
    children: ReactNode;
    placement: 'top' | 'bottom';
    serverVisible: boolean;
}

export function SharingPlacementGuard({ children, placement, serverVisible }: Props) {
    const previewSettings = usePreviewSettings();

    const visible = previewSettings
        ? (previewSettings.sharing_placement ?? '').split(',').includes(placement)
        : serverVisible;

    if (!visible) return null;

    return children;
}
