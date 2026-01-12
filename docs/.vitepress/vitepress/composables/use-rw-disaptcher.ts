import { ref, provide } from "vue";
import type { RWDispatcherState } from "@vue-form-rw-dispatcher/helper";

export const useRWDispatcher = () => {
  const rwDispatcherState = ref<RWDispatcherState>("write");
  provide("rwDispatcherState", rwDispatcherState);

  const toggleRWDispatcherState = () => {
    if (rwDispatcherState.value === "write") {
      rwDispatcherState.value = "read";
    } else {
      rwDispatcherState.value = "write";
    }
  };

  return { rwDispatcherState, toggleRWDispatcherState };
};
