import { useSize as useElementPlusSize } from "element-plus";
import { SIZE } from "../constants";

export const useSize = (props: Record<string, unknown>) => {
  const size = props.size as SIZE;

  return {
    size,
  };
};
