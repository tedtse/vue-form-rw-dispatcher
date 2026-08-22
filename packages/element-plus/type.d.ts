import { type RWDispatcherProps } from "@vue-form-rw-dispatcher/helper";

export type SwitchConfigType = {
  activeText?: string;
  inactiveText?: string;
};

export type DispatcherConfigType = SwitchConfigType;

export type EPRWDispatcherProps = RWDispatcherProps &
  Partial<DispatcherConfigType>;
