import {
  getCurrentInstance,
  computed,
  inject,
  type Ref,
  type ComputedRef,
} from "vue";
import { DispatcherTypeTag, TypeProvideMap } from "../constants";
import { Config } from "../config";
import type { DispatcherConfigType } from "../type.d";

export const useDispatcherConfig = <T extends DispatcherConfigType>(
  type: DispatcherTypeTag,
) => {
  const vm = getCurrentInstance();
  const injectConfig = inject<ComputedRef<T> | Ref<T>>(
    TypeProvideMap[type].provider,
  );

  return computed(() => {
    const props = vm?.proxy?.$props as Partial<T> | undefined;
    const merged: Partial<T> = {};
    for (const key of TypeProvideMap[DispatcherTypeTag[type]].keys) {
      merged[key] = props?.[key] || injectConfig?.value?.[key] || Config[key];
    }
    return merged;
  });
};
