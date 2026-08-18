import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { Check, Close, View, Hide } from "@element-plus/icons-vue";
import { Config, getClassNamespace } from "../../../config";
import ElSwitchDispatcher from "../";

const classNamespace = getClassNamespace();

describe("SwitchDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const value = ref(false);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          rwDispatcherState={"write"}
        />
      ));

      const switchElm = wrapper.find(".el-switch");
      expect(switchElm.exists()).toBe(true);
    });

    test("read mode boolean true", async () => {
      const value = ref(true);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"是"`);

      value.value = false;
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"否"`);
    });

    test("read mode empty modelValue (undefined/null/empty string)", () => {
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={undefined as unknown as boolean}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toBe("");
    });

    test("read mode active-text / inactive-text", async () => {
      const value = ref(true);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          active-text="Pay by month"
          inactive-text="Pay by year"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"Pay by month"`,
      );

      value.value = false;
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"Pay by year"`,
      );
    });

    test("read mode extended value types (activeValue/inactiveValue)", async () => {
      const value = ref("100");
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          active-value="100"
          inactive-value="0"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"100"`);

      value.value = "0";
      await nextTick();
      // isActive = "0" === "100" = false
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"0"`);
    });

    test("read mode activeValue number false", async () => {
      // 当 activeValue=100, modelValue=0: inactive, inactiveValue默认false
      // inactiveValue=false → (false !== false && ...) = false, 跳过
      // 最后: String(undefined) = "undefined"
      const value = ref(0);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          active-value={100}
          inactive-value={false}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // isActive = 0 === 100 = false
      // inactiveValue = false → (false !== false && ...) = false
      // String(Config.inactiveText = "否") = "否"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"否"`);
    });

    test("read mode activeValue with activeText prop", async () => {
      // activeText prop 优先级高于 activeValue fallback
      const value = ref("100");
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          active-value="100"
          inactive-value="0"
          active-text="开"
          inactive-text="关"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"开"`);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const value = ref(true);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
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
        <ElSwitchDispatcher
          modelValue={true}
          size="small"
          active-text="Open"
          inactive-text="Close"
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
        <ElSwitchDispatcher
          modelValue={true}
          size="large"
          active-text="Open"
          inactive-text="Close"
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

  describe("icons", () => {
    test("read mode with active-icon / inactive-icon", async () => {
      const value = ref(true);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          active-icon={Check}
          inactive-icon={Close}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
      expect(textElm.element.textContent).toBe("");

      value.value = false;
      await nextTick();
      // DOM 只在切换后重新查询
    });

    test("read mode inactive with inactive-icon", async () => {
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={false}
          active-icon={Check}
          inactive-icon={Close}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
    });

    test("read mode with active-action-icon / inactive-action-icon", async () => {
      const value = ref(true);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          active-action-icon={View}
          inactive-action-icon={Hide}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
    });

    test("read mode inactive with inactive-action-icon", async () => {
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={false}
          active-action-icon={View}
          inactive-action-icon={Hide}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
    });
  });

  describe("slot", () => {
    test("slot write", () => {
      const value = ref(false);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {String(value.value)}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"writer: false"`,
      );
    });

    test("slot read", () => {
      const value = ref(false);
      const wrapper = mount(() => (
        <ElSwitchDispatcher
          modelValue={value.value}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {String(value.value)}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"reader: false"`,
      );
    });
  });
});
