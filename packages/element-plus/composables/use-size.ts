import {
  getCurrentInstance,
  computed,
  inject,
  ref,
  type Ref,
  type ComputedRef,
} from "vue";
import { useSize as useElementPlusSize } from "element-plus";
import { SIZE_CONTEXT_PROVIDER, SIZE, PROPS_SIZE } from "../constants";

export const useSize = () => {
  const vm = getCurrentInstance();

  const elSize = useElementPlusSize();

  const injectSize = inject<ComputedRef<SIZE> | Ref<SIZE>>(
    SIZE_CONTEXT_PROVIDER,
    ref(SIZE.EMPTY),
  );

  return computed(
    () =>
      (vm?.proxy?.$props as any)?.[PROPS_SIZE] ||
      elSize.value ||
      injectSize.value,
  );
};
