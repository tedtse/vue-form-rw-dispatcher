import { Config } from "./config";
import type { SetupContext, VNodeChild, ComponentPropsOptions } from "vue";

export type RWDispatcherState = "write" | "read";

// 定义必须以'State'结尾的键名类型
export type StateKey = `${Exclude<string, "">}State`;

export type RWDispatcherProps = {
  [K: StateKey]: RWDispatcherState;
};

const stateKey = `${Config.namespace}State`;
export type DefineRWDispatcherArgs<
  Props extends Record<string, unknown> & RWDispatcherProps = {
    [stateKey]: "write";
  },
> = {
  writerFn: (props: Omit<Props, StateKey>, context: SetupContext) => VNodeChild;
  readerFn: (props: Omit<Props, StateKey>, context: SetupContext) => VNodeChild;
  props: ComponentPropsOptions<Record<string, unknown> & RWDispatcherProps>;
  name?: string;
  options?: Record<string, unknown>;
};
