import type { ComponentType } from 'react';

export function makeComposableComponent<
    // biome-ignore lint/suspicious/noExplicitAny: We're accepting any component type here
    ParentComponent extends ComponentType<any>,
    // biome-ignore lint/suspicious/noExplicitAny: We're accepting any component type here
    SubComponents extends Record<string, ComponentType<any>>,
>(component: ParentComponent, subComponents: SubComponents): ParentComponent & SubComponents {
    return Object.assign(component, subComponents);
}
