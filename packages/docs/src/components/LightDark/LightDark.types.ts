/* eslint-disable @typescript-eslint/ban-types */
// Copied from Mantine, since it's not exported.
// @mantine/core/lib/core/factory/create-polymorphic-component.d.ts

type ExtendedProps<Props = {}, OverrideProps = {}> = OverrideProps &
    Omit<Props, keyof OverrideProps>;
type ElementType =
    | keyof JSX.IntrinsicElements
    | React.JSXElementConstructor<any>;
type PropsOf<C extends ElementType> = JSX.LibraryManagedAttributes<
    C,
    React.ComponentPropsWithoutRef<C>
>;
type ComponentProp<C> = {
    component?: C;
};
type InheritedProps<C extends ElementType, Props = {}> = ExtendedProps<
    PropsOf<C>,
    Props
>;
type PolymorphicRef<C> = C extends React.ElementType
    ? React.ComponentPropsWithRef<C>["ref"]
    : never;

export type PolymorphicComponentProps<
    C,
    Props = {},
> = C extends React.ElementType
    ? InheritedProps<C, Props & ComponentProp<C>> & {
          ref?: PolymorphicRef<C>;
      }
    : Props & {
          component: React.ElementType;
      };
