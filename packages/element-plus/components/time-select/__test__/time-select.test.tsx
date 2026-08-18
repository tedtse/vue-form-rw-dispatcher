import { nextTick, h, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { Config, getClassNamespace } from "../../../config";
import ElTimeSelectDispatcher from "../";

const classNamespace = getClassNamespace();

describe("TimeSelectDispatcher", () => {
  describe("props", () => {
    test("write mode", () => {
      const value = ref("");
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue={value.value}
          rwDispatcherState={"write"}
        />
      ));
      const selectElm = wrapper.find(".el-select");
      expect(selectElm.exists()).toBe(true);
    });

    test("read mode with value", async () => {
      const value = ref("09:00");
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue={value.value}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"09:00"`);

      value.value = "18:30";
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"18:30"`);
    });

    test("read mode empty modelValue", () => {
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher modelValue={""} rwDispatcherState={"read"} />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toBe("");
    });

    test("read mode format prop", () => {
      // reader.vue 直接输出 modelValue,不做 format 转换
      // (time-select 组件会在内部转换 format 但展示的值已经是转换后)
      const value = ref("09:00 AM");
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue={value.value}
          format="hh:mm A"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"09:00 AM"`);
    });

    test("read mode prefixIcon", () => {
      const CustomComp = {
        render() {
          return h("span", "T");
        },
      };
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue="09:00"
          prefix-icon={CustomComp as any}
          rwDispatcherState={"read"}
        />
      ));
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
      expect(prefixElm.element.textContent).toMatchInlineSnapshot(`"T"`);
    });

    test("read mode no prefixIcon by default", () => {
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher modelValue="09:00" rwDispatcherState={"read"} />
      ));
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(false);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const value = ref("09:00");
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue={value.value}
          disabled={true}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.classList.contains("is-disabled")).toBe(true);
    });
  });

  describe("size", () => {
    test("small", () => {
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue="09:00"
          size="small"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.classList).toContain(
        `${classNamespace}-el-text--small`,
      );
    });

    test("large", () => {
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue="09:00"
          size="large"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.classList).toContain(
        `${classNamespace}-el-text--large`,
      );
    });
  });

  describe("slot", () => {
    test("slot write", () => {
      const value = ref("08:30");
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue={value.value}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: custom
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
    });

    test("slot read", () => {
      const value = ref("08:30");
      const wrapper = mount(() => (
        <ElTimeSelectDispatcher
          modelValue={value.value}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: custom
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
    });
  });
});
