import { h, type Component, type SetupContext } from "vue";

export const extendComponentJSX = <Props extends Record<string, unknown>>(
  widget: Component,
  props: Props,
  { attrs, slots }: SetupContext,
) => {
  return <widget {...attrs} {...props} v-slots={slots} />;
};

export const extendComponentRender = <Props extends Record<string, unknown>>(
  widget: Component,
  props: Props,
  { attrs, slots }: SetupContext,
) => {
  return h(widget, { ...attrs, ...props }, slots);
};
