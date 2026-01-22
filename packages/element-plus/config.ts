import {
  DEFAULT_NAMESPACE,
  configKeys as helperConfigKeys,
  setConfig as setHelperConfig,
  type ConfigType as HelperConfigType,
} from "@vue-form-rw-dispatcher/helper";

export { DEFAULT_NAMESPACE } from "@vue-form-rw-dispatcher/helper";

export type ConfigType = HelperConfigType & {
  activeText?: string;
  inactiveText?: string;
  locale?: string;
};

export const Config: ConfigType = {
  namespace: DEFAULT_NAMESPACE,
  activeText: '是',
  inactiveText: '否'
};

export const setConfig = (conf: Partial<ConfigType>) => {
  const helperConf = {}
  Object.entries(conf).forEach(([key, value]) => {
    if (helperConfigKeys.includes(key)) {
      Reflect.set(helperConf, key, value)
    }
  })
  setHelperConfig(helperConf as Partial<HelperConfigType>)
  Object.assign(Config, conf);
};
