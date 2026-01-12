import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import ElInputDispatcher from "../";

describe("InputDispatcher", () => {
  describe("basic usage", () => {
    test("write mode", async () => {
      const input = ref("input");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"write"}
        />
      ));

      const inputElm = wrapper.find("input");
      const nativeInput = inputElm.element;

      expect(inputElm.exists()).toBe(true);
      expect(nativeInput.value).toMatchInlineSnapshot(`"input"`);

      input.value = "text";
      await nextTick();
      expect(inputElm.element.value).toMatchInlineSnapshot(`"text"`);
    });

    test("read mode", async () => {
      const input = ref("input");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
        />
      ));

      const inputElm = wrapper.find(
        ".rw-dispatcher-el-input"
      ) as DOMWrapper<HTMLDivElement>;
      const nativeInput = inputElm.element;
      expect(inputElm.exists()).toBe(true);
      expect(nativeInput.innerHTML).toMatchInlineSnapshot(`"input"`);

      input.value = "text";
      await nextTick();
      expect(inputElm.element.innerHTML).toMatchInlineSnapshot(`"text"`);
    });
  });
});
