import { ElCheckboxGroup } from "element-plus";

export const CHECKBOX_GROUP_KEY = Symbol("ElCheckboxGroup");

export type CheckboxGroupType = {
  instance: null | InstanceType<typeof ElCheckboxGroup>;
};
