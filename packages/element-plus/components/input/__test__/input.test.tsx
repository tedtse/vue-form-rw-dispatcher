import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { Calendar, Search, Hide, View } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import { Config } from "../../../config";
import ElInputDispatcher from "../";

const classNamespace = Config.namespace.replace(
  /[A-Z]/g,
  (m) => `-${m.toLowerCase()}`,
);

describe("InputDispatcher", () => {
  describe("props", () => {
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
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      const nativeInput = inputElm.element;
      expect(inputElm.exists()).toBe(true);
      expect(nativeInput.textContent).toMatchInlineSnapshot(`"input"`);

      input.value = "text";
      await nextTick();
      expect(inputElm.element.textContent).toMatchInlineSnapshot(`"text"`);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const input = ref("input");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          disabled={true}
        />
      ));

      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      const nativeInput = inputElm.element;
      expect(inputElm.exists()).toBe(true);
      expect(nativeInput.textContent).toMatchInlineSnapshot(`"input"`);
      expect(nativeInput.classList.contains("is-disabled")).toBe(true);
    });
  });

  describe("formatter", () => {
    test("read mode", async () => {
      const input = ref(123456);
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          formatter={(value: string) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value: string) => value.replace(/\$\s?|(,*)/g, "")}
        />
      ));

      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      const nativeInput = inputElm.element;
      expect(inputElm.exists()).toBe(true);
      expect(nativeInput.textContent).toMatchInlineSnapshot(`"$ 123,456"`);
      input.value = 654321;
      await nextTick();
      expect(inputElm.element.textContent).toMatchInlineSnapshot(`"$ 654,321"`);
    });
  });

  describe("password", () => {
    test("read mode", async () => {
      const input = ref(123456);
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          type={"password"}
          show-password={true}
        />
      ));

      const HideElm = mount(Hide);
      const ViewElm = mount(View);

      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      const nativeInput = inputElm.element;
      expect(inputElm.exists()).toBe(true);
      expect(nativeInput.textContent).toMatchInlineSnapshot(`"••••••"`);

      const iconElm = inputElm.find(`.el-icon`) as DOMWrapper<HTMLDivElement>;
      expect(iconElm.exists()).toBe(true);
      expect(
        iconElm.element.classList.contains(
          `${classNamespace}-el-input__password`,
        ),
      ).toBe(true);
      expect(
        iconElm.element.innerHTML.includes(HideElm.element.innerHTML),
      ).toBe(true);

      iconElm.element.click();
      await nextTick();
      expect(nativeInput.textContent).toMatchInlineSnapshot(`"123456"`);
      expect(
        iconElm.element.innerHTML.includes(ViewElm.element.innerHTML),
      ).toBe(true);
    });
  });

  describe("icon", () => {
    test("suffix-icon", () => {
      const input = ref("input");
      const CalendarElm = mount(Calendar);
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          suffix-icon={Calendar}
        />
      ));

      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(inputElm.exists()).toBe(true);
      const textElm = inputElm.find("span:first-child");
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"input"`);
      const iconElm = inputElm.find(
        `.${classNamespace}-el-text__suffix`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(iconElm.exists()).toBe(true);
      expect(
        iconElm.element.innerHTML.includes(CalendarElm.element.innerHTML),
      ).toBe(true);
    });

    test("prefix-icon", () => {
      const input = ref("input");
      const SearchElm = mount(Search);
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          prefix-icon={Search}
        />
      ));

      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(inputElm.exists()).toBe(true);
      const iconElm = inputElm.find(
        `.${classNamespace}-el-text__prefix`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(iconElm.exists()).toBe(true);
      expect(
        iconElm.element.innerHTML.includes(SearchElm.element.innerHTML),
      ).toBe(true);
      const textElm = inputElm.find("span:last-child");
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"input"`);
    });

    test("suffix-slot", () => {
      const input = ref("input");
      const CalendarElm = mount(Calendar);
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          v-slots={{
            suffix: () => (
              <ElIcon class="el-input__icon">
                <Calendar />
              </ElIcon>
            ),
          }}
        />
      ));

      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(inputElm.exists()).toBe(true);
      const textElm = inputElm.find("span:first-child");
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"input"`);
      const iconElm = inputElm.find(
        `.${classNamespace}-el-text__suffix`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(iconElm.exists()).toBe(true);
      expect(
        iconElm.element.innerHTML.includes(CalendarElm.element.innerHTML),
      ).toBe(true);
    });

    test("prefix-slot", () => {
      const input = ref("input");
      const SearchElm = mount(Search);
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          v-slots={{
            prefix: () => (
              <ElIcon class="el-input__icon">
                <Search />
              </ElIcon>
            ),
          }}
        />
      ));

      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(inputElm.exists()).toBe(true);
      const textElm = inputElm.find("span:last-child");
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"input"`);
      const iconElm = inputElm.find(
        `.${classNamespace}-el-text__prefix`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(iconElm.exists()).toBe(true);
      expect(
        iconElm.element.innerHTML.includes(SearchElm.element.innerHTML),
      ).toBe(true);
    });
  });

  describe("mixed", () => {
    test("slot prepend", () => {
      const input = ref("www.hSd.com");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          v-slots={{
            prepend: () => "Http://",
          }}
        />
      ));
      const prependElm = wrapper.find(
        `.${classNamespace}-el-text__prepend`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(prependElm.exists()).toBe(true);
      expect(prependElm.element.textContent).toMatchInlineSnapshot(`"Http://"`);
      const textElm = wrapper.find("span:last-child");
      expect(textElm.element.textContent).toMatchInlineSnapshot(
        `"www.hSd.com"`,
      );
    });

    test("slot append", () => {
      const input = ref("hSd");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          v-slots={{
            append: () => ".com",
          }}
        />
      ));
      const appendElm = wrapper.find(
        `.${classNamespace}-el-text__append`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(appendElm.exists()).toBe(true);
      expect(appendElm.element.textContent).toMatchInlineSnapshot(`".com"`);
      const textElm = wrapper.find("span:first-child");
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"hSd"`);
    });

    test("slot double", () => {
      const input = ref("hSd");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          v-slots={{
            prepend: () => "Http://",
            append: () => ".com",
          }}
        />
      ));
      const prependElm = wrapper.find(
        `.${classNamespace}-el-text__prepend`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(prependElm.exists()).toBe(true);
      expect(prependElm.element.textContent).toMatchInlineSnapshot(`"Http://"`);
      const appendElm = wrapper.find(
        `.${classNamespace}-el-text__append`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(appendElm.exists()).toBe(true);
      expect(appendElm.element.textContent).toMatchInlineSnapshot(`".com"`);
      const textElm = wrapper.find("span:nth-child(2)");
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"hSd"`);
    });
  });

  describe("size", () => {
    test("small", () => {
      const input = ref("input");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          size="small"
        />
      ));
      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(inputElm.exists()).toBe(true);
      expect(inputElm.element.classList).toContain(
        `${classNamespace}-el-text--small`,
      );
    });

    test("large", () => {
      const input = ref("input");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          size="large"
        />
      ));
      const inputElm = wrapper.find(
        `.${classNamespace}-el-input`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(inputElm.exists()).toBe(true);
      expect(inputElm.element.classList).toContain(
        `${classNamespace}-el-text--large`,
      );
    });
  });

  describe("slot", () => {
    test("slot write", () => {
      const input = ref("input");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {input.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"writer: input"`,
      );
    });

    test("slot read", () => {
      const input = ref("input");
      const wrapper = mount(() => (
        <ElInputDispatcher
          modelValue={input.value}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {input.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"reader: input"`,
      );
    });
  });
});
