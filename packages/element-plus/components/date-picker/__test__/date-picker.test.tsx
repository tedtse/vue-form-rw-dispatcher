import { nextTick, h, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { dayjs } from "element-plus";
import { Config, getClassNamespace } from "../../../config";
import ElDatePickerDispatcher from "../";

const classNamespace = getClassNamespace();

const d = (s: string) => dayjs(s).toDate();

describe("DatePickerDispatcher", () => {
  describe("props", () => {
    test("write mode", () => {
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="date"
          rwDispatcherState={"write"}
        />
      ));
      const pickerElm = wrapper.find(".el-date-editor");
      expect(pickerElm.exists()).toBe(true);
    });

    test("read mode type=date", async () => {
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="date"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"2024-05-20"`);

      value.value = d("2023-12-31");
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"2023-12-31"`);
    });

    test("read mode empty modelValue", () => {
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={undefined as unknown as Date}
          type="date"
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

    test("read mode with custom format", () => {
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="date"
          format="DD/MM/YYYY"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"20/05/2024"`);
    });

    test("read mode type=datetime (Clock icon)", () => {
      const value = ref(dayjs("2024-05-20 10:30:45").toDate());
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="datetime"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
      // DEFAULT_FORMATS_DATEPICKER.datetime = "YYYY-MM-DD HH:mm:ss"
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"2024-05-20 10:30:45"`,
      );
    });

    test("read mode type=year / month / week", () => {
      const yearValue = ref(d("2024-06-15"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={yearValue.value}
          type="year"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // DEFAULT_FORMATS_DATEPICKER.year = "YYYY"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"2024"`);
    });

    test("read mode type=month", () => {
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={d("2024-06-15")}
          type="month"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // DEFAULT_FORMATS_DATEPICKER.month = "YYYY-MM"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"2024-06"`);
    });

    test("read mode type=daterange with empty array in filter (not range type)", () => {
      const value = ref([d("2024-01-01"), d("2024-02-02")]);
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="dates"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"2024-01-01, 2024-02-02"`,
      );
    });

    test("read mode type=daterange with RangeRender", () => {
      const value = ref([d("2024-01-01"), d("2024-02-02")]);
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="daterange"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // props.rangeSeparator 默认 undefined → separator.text = undefined → ""
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"2024-01-012024-02-02"`,
      );
      // 直接包含 4 span: 1 个 prefix span(Calendar icon) + 2 个日期 span + 1 个 separator span
      const allSpans = textElm.findAll("span");
      expect(allSpans.length).toBe(4);
      const sepElm = textElm.find(`.${classNamespace}-el-range-separator`);
      expect(sepElm.exists()).toBe(true);
    });

    test("read mode type=monthrange with custom range-separator", () => {
      const value = ref([d("2024-01-01"), d("2024-06-01")]);
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="monthrange"
          range-separator="To"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // DEFAULT_FORMATS_DATEPICKER.monthrange = "YYYY-MM"
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"2024-01To2024-06"`,
      );
    });

    test("read mode type=yearrange", () => {
      const value = ref([d("2020-01-01"), d("2024-01-01")]);
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="yearrange"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // DEFAULT_FORMATS_DATEPICKER.yearrange = "YYYY"
      // 默认 rangeSeparator undefined → ""
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"20202024"`);
    });

    test("read mode type=datetimerange (Clock prefix icon)", () => {
      const value = ref([d("2024-01-01 09:00:00"), d("2024-01-02 18:00:00")]);
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="datetimerange"
          rwDispatcherState={"read"}
        />
      ));
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
      // DEFAULT_FORMATS_DATEPICKER.datetimerange = "YYYY-MM-DD HH:mm:ss"
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"2024-01-01 09:00:002024-01-02 18:00:00"`,
      );
    });

    test("read mode range array with falsy elements (filter)", () => {
      const value = ref([null, undefined]);
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value as unknown as Date[]}
          type="daterange"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`", "`);
    });

    test("read mode prefixIcon prop", () => {
      const CustomComp = {
        render() {
          return h("span", "PRE");
        },
      };
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="date"
          prefix-icon={CustomComp}
          rwDispatcherState={"read"}
        />
      ));
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
      expect(prefixElm.element.textContent).toMatchInlineSnapshot(`"PRE"`);
    });

    test("read mode default Calendar icon (not datetime type)", () => {
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="month"
          rwDispatcherState={"read"}
        />
      ));
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="date"
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
        <ElDatePickerDispatcher
          modelValue={d("2024-05-20")}
          type="date"
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
        <ElDatePickerDispatcher
          modelValue={d("2024-05-20")}
          type="date"
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
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="date"
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
      const value = ref(d("2024-05-20"));
      const wrapper = mount(() => (
        <ElDatePickerDispatcher
          modelValue={value.value}
          type="date"
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
