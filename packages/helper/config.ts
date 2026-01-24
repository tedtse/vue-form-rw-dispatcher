export const DEFAULT_NAMESPACE = "rwDispatcher";

export const configKeys: string[] = ['namespace']

export type ConfigType = {
  namespace: string;
};

export const Config: ConfigType = {
  namespace: DEFAULT_NAMESPACE,
};

export const setConfig = (conf: Partial<ConfigType>) => {
  Object.assign(Config, conf);
};
