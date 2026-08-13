import {
  DEFAULT_NAMESPACE,
  configKeys as helperConfigKeys,
  setConfig as setHelperConfig,
  type ConfigType as HelperConfigType,
} from "@vue-form-rw-dispatcher/helper";
import type { SwitchConfigType } from "./type";

export { DEFAULT_NAMESPACE } from "@vue-form-rw-dispatcher/helper";

export type ConfigType = HelperConfigType &
  SwitchConfigType & {
    locale?: string;
  };

export const Config: ConfigType = {
  namespace: DEFAULT_NAMESPACE,
  activeText: "是",
  inactiveText: "否",
};

export const getClassNamespace = () =>
  Config.namespace.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export const getConfig = () => Config;

export const setConfig = (conf: Partial<ConfigType>) => {
  const helperConf = {};
  Object.entries(conf).forEach(([key, value]) => {
    if (helperConfigKeys.includes(key)) {
      Reflect.set(helperConf, key, value);
    }
  });
  setHelperConfig(helperConf as Partial<HelperConfigType>);
  Object.assign(Config, conf);
};
