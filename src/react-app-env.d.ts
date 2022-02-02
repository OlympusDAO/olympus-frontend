/// <reference types="react-scripts" />

/**
 * Utility type to get the prop types of any component.
 */
type PropsOf<TComponent> = TComponent extends React.ComponentType<infer TProps> ? TProps : never;
