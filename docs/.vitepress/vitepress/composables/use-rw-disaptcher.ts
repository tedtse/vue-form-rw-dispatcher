import { ref, provide } from "vue";
import { Config, type RWDispatcherState } from "@vue-form-rw-dispatcher/helper";

export const useRWDispatcher = () => {
  const rwDispatcherState = ref<RWDispatcherState>("write");
  provide(`${Config.namespace}State`, rwDispatcherState);

  const toggleRWDispatcherState = () => {
    if (rwDispatcherState.value === "write") {
      rwDispatcherState.value = "read";
    } else {
      rwDispatcherState.value = "write";
    }
  };

  return { rwDispatcherState, toggleRWDispatcherState };
};
