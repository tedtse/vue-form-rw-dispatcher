import type { ExtractPropTypes } from "vue";
import { ElSelect } from "element-plus";

export const selectProps = ElSelect.props;
export type SelectProps = ExtractPropTypes<typeof selectProps>;
