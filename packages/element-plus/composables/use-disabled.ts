import {
  getCurrentInstance,
  computed,
  inject,
  ref,
  type Ref,
  type ComputedRef,
} from "vue";
import { useDisabled as useElementPlusDisabled } from "element-plus";
import { DISABLED_CONTEXT_KEY, PROPS_DISABLED } from "../constants";

export const useDisabled = () => {
  const vm = getCurrentInstance();

  const elDisabled = useElementPlusDisabled();

  const injectSize = inject<ComputedRef<boolean> | Ref<boolean>>(
    DISABLED_CONTEXT_KEY,
    ref(false),
  );

  return computed(
    () =>
      (vm?.proxy?.$props as any)?.[PROPS_DISABLED] ||
      elDisabled.value ||
      injectSize.value,
  );
};
