import {
  getCurrentInstance,
  computed,
  inject,
  ref,
  type Ref,
  type ComputedRef,
} from "vue";
import { useSize as useElementPlusSize } from "element-plus";
import { SIZE_CONTEXT_KEY, SIZE } from "../constants";

const PROPS_SIZE = "size";

export const useSize = () => {
  const vm = getCurrentInstance();

  const elSize = useElementPlusSize();

  const injectSize = inject<ComputedRef<SIZE> | Ref<SIZE>>(
    SIZE_CONTEXT_KEY,
    ref(SIZE.EMPTY),
  );

  return computed(
    () =>
      (vm?.proxy?.$props as any)?.[PROPS_SIZE] ||
      elSize.value ||
      injectSize.value,
  );
};
