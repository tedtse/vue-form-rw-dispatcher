import type { ExtractPropTypes } from "vue";
import { treeProps, selectProps, type TreeNodeData } from "element-plus";

export const treeSelectProps = {
  ...selectProps,
  ...treeProps,
  cacheData: {
    type: Array,
    default: () => [],
  },
};

/**
 * Explicit props type to avoid "Unresolvable type: TSTypeQuery" when using
 * ExtractPropTypes<typeof treeSelectProps>. Kept in sync with treeSelectProps.
 */
export type TreeSelectProps = {
  modelValue?: unknown;
  data?: TreeNodeData[];
  disabled?: boolean;
  multiple?: boolean;
  size?: "default" | "large" | "small";
  nodeKey?: string;
  valueKey?: string;
  props?: Record<string, unknown>;
  cacheData?: unknown[];
  placeholder?: string;
  [key: string]: unknown;
};
// export type TreeSelectProps = ExtractPropTypes<typeof treeSelectProps>;
