import { DEFAULT_NAMESPACE } from "./config";
import type { SetupContext, VNodeChild, ComponentPropsOptions } from "vue";

export type RWDispatcherState = "write" | "read";

// 定义必须以'State'结尾的键名类型
export type StateKey = `${Exclude<string, "">}State`;

export type RWDispatcherProps = {
  [K: StateKey]: RWDispatcherState;
};

const nsStateKey = `${DEFAULT_NAMESPACE}State`;
export type DefineRWDispatcherArgs<
  Props extends Record<string, unknown> & RWDispatcherProps = {
    [nsStateKey]: "write";
  },
> = {
  writerFn: (props: Omit<Props, StateKey>, context: SetupContext) => VNodeChild;
  readerFn: (props: Omit<Props, StateKey>, context: SetupContext) => VNodeChild;
  props: ComponentPropsOptions<Record<string, unknown> & RWDispatcherProps>;
  name?: string;
  options?: Record<string, unknown>;
};
