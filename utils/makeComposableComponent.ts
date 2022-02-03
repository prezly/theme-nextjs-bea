import type { ComponentType } from 'react';

export function makeComposableComponent<
    ParentComponent extends ComponentType<any>,
    SubComponents extends Record<string, ComponentType<any>>,
>(Component: ParentComponent, subComponents: SubComponents): ParentComponent & SubComponents {
    return Object.assign(Component, subComponents);
}
