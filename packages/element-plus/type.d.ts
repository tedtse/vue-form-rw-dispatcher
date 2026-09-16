import { type RWDispatcherProps } from "element-plus-form-dispatcher/helper";

export type SwitchConfigType = {
  activeText?: string;
  inactiveText?: string;
};

export type DispatcherConfigType = SwitchConfigType;

export type EPRWDispatcherProps = RWDispatcherProps &
  Partial<DispatcherConfigType>;
