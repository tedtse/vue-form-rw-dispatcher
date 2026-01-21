import { DEFAULT_NAMESPACE } from "@vue-form-rw-dispatcher/helper";

export type ConfigType = {
  namespace: string;
  activeText?: string;
  inactiveText?: string;
  locale?: string;
};

export const Config: ConfigType = {
  namespace: DEFAULT_NAMESPACE,
};

export const setConfig = (conf: Partial<ConfigType>) => {
  Object.assign(Config, conf);
};
