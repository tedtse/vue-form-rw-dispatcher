import type { SetupContext, VNodeChild } from "vue";

export type RWDispatcherState = "write" | "read";

export type RWDispatcherProps = {
  rwDispatcherState?: RWDispatcherState;
};

export type DefineRWDispatcherArgs<Props> = {
  writerFn: (
    props: Omit<Props, "rwDispatcherState">,
    context: SetupContext
  ) => VNodeChild;
  readerFn: (
    props: Omit<Props, "rwDispatcherState">,
    context: SetupContext
  ) => VNodeChild;
  name?: string;
  props?: Record<string, unknown>;
  options?: Record<string, unknown>;
};
