/// <reference types="react-scripts" />
declare module "@multifarm/widget";

/**
 * Utility type to get the prop types of any component.
 */
type PropsOf<TComponent> = TComponent extends React.ComponentType<infer TProps> ? TProps : never;
