import { nextTick, h, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { dayjs } from "element-plus";
import { Config, getClassNamespace } from "../../../config";
import { ElTimePickerDispatcher } from "../";

const classNamespace = getClassNamespace();

const t = (s: string) => dayjs(`2024-01-01 ${s}`).toDate();

describe("TimePickerDispatcher", () => {
  describe("props", () => {
    test("write mode", () => {
      const value = ref(t("10:30:00"));
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={value.value}
          rwDispatcherState={"write"}
        />
      ));
      // write 模式下使用 element-plus 原生 ElTimePicker
      const pickerElm = wrapper.find(".el-date-editor");
      expect(pickerElm.exists()).toBe(true);
    });

    test("read mode single value with default format", async () => {
      // DEFAULT_FORMATS_TIME = "HH:mm:ss"
      const value = ref(t("10:30:00"));
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={value.value}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"10:30:00"`);

      value.value = t("23:59:59");
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"23:59:59"`);
    });

    test("read mode empty modelValue", () => {
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={undefined as unknown as Date}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toBe("");
    });

    test("read mode custom format", () => {
      // format = "HH:mm"
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={t("12:00:30")}
          format="HH:mm"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"12:00"`);
    });

    test("read mode single value with prefix icon (Clock default)", () => {
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={t("09:00:00")}
          rwDispatcherState={"read"}
        />
      ));
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
    });

    test("read mode custom prefixIcon", () => {
      const CustomComp = {
        render() {
          return h("p", "CLOCK");
        },
      };
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={t("09:00:00")}
          prefix-icon={CustomComp as any}
          rwDispatcherState={"read"}
        />
      ));
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
      expect(prefixElm.element.textContent).toMatchInlineSnapshot(`"CLOCK"`);
    });

    test("read mode is-range=false with array modelValue (not isRange)", () => {
      const value = ref([t("08:00:00"), t("09:00:00")]);
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={value.value as any}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"08:00:00, 09:00:00"`,
      );
    });

    test("read mode is-range with RangeRender + separator", () => {
      const value = ref([t("08:40:00"), t("09:40:00")]) as any;
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={value.value}
          is-range={true}
          range-separator="To"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"08:40:00To09:40:00"`,
      );
      const sepElm = textElm.find(`.${classNamespace}-el-text-separator`);
      expect(sepElm.exists()).toBe(true);
    });

    test("read mode is-range with default separator (undefined)", () => {
      const value = ref([t("08:00:00"), t("09:00:00")]) as any;
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={value.value}
          is-range={true}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // 默认 rangeSeparator undefined → ""
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"08:00:0009:00:00"`,
      );
    });

    test("read mode is-range with falsy elements (isRange false)", () => {
      const value = ref([null, undefined]) as any;
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
          modelValue={value.value}
          is-range={true}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // isRange=false → array.join: [null,undefined].map(x => x||x).join(", ")
      expect(textElm.element.textContent).toMatchInlineSnapshot(`", "`);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const value = ref(t("10:30:00"));
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
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
        <ElTimePickerDispatcher
          modelValue={t("10:00:00")}
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
        <ElTimePickerDispatcher
          modelValue={t("10:00:00")}
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
      const value = ref(t("18:30:00"));
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
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
      const value = ref(t("18:30:00"));
      const wrapper = mount(() => (
        <ElTimePickerDispatcher
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
