import { ComponentType } from 'react';

export default function makeComposableComponent<
    ParentComponent extends ComponentType<any>,
    SubComponents extends Record<string, ComponentType<any>>,
>(Component: ParentComponent, subComponents: SubComponents): ParentComponent & SubComponents {
    return Object.assign(Component, subComponents);
}
