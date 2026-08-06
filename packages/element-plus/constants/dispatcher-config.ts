import type { SwitchConfigType } from "../type.d";

export const SWITCH_CONFIG_PROVIDER = Symbol("switchConfig");

export enum DispatcherTypeTag {
  Switch = "Switch",
}
export const SWITCH_CONFIG_KEYS = [
  "activeText",
  "inactiveText",
] as const satisfies readonly (keyof SwitchConfigType)[];

export const TypeProvideMap = {
  [DispatcherTypeTag.Switch]: {
    provider: SWITCH_CONFIG_PROVIDER,
    keys: SWITCH_CONFIG_KEYS,
  },
} as const;
