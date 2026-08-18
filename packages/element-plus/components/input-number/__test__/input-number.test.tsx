import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { Config, getClassNamespace } from "../../../config";
import ElInputNumberDispatcher from "../";

const classNamespace = getClassNamespace();

describe("InputNumberDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const num = ref(1);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          min={1}
          max={10}
          rwDispatcherState={"write"}
        />
      ));

      // write 模式下渲染为 element-plus 原生 ElInputNumber
      const inputElm = wrapper.find(".el-input-number");
      expect(inputElm.exists()).toBe(true);
    });

    test("read mode with value", async () => {
      const num = ref(1);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          min={1}
          max={10}
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"1"`);

      num.value = 2;
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"2"`);
    });

    test("read mode empty value", async () => {
      // modelValue 为 undefined 时, reader.vue value computed 返回 undefined
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={undefined as unknown as number}
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

    test("read mode with precision", async () => {
      const num = ref(1);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          precision={2}
          step={0.1}
          max={10}
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // parseFloat(1).toFixed(2) = "1.00"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"1.00"`);

      num.value = 2.345;
      await nextTick();
      // parseFloat(2.345).toFixed(2) = "2.35"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"2.35"`);
    });

    test("read mode with precision 0", () => {
      // precision 为 0 (falsy),不走 precision 分支,直接返回 modelValue
      const num = ref(5.678);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          precision={0}
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // precision 0 是 falsy,直接返回 5.678
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"5.678"`);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const num = ref(1);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          disabled={true}
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // nsText.is('disabled') 生成 is-disabled
      expect(textElm.element.classList.contains("is-disabled")).toBe(true);
    });
  });

  describe("size", () => {
    test("small", () => {
      const num = ref(3);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
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
      const num = ref(1);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
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

  describe("prefix/suffix", () => {
    test("read mode with prefix slot", () => {
      const num = ref(1);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          min={1}
          max={10}
          rwDispatcherState={"read"}
          v-slots={{
            prefix: () => <span class="prefix-slot">￥</span>,
          }}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const prefixElm = wrapper.find(`.${classNamespace}-el-text__prefix`);
      expect(prefixElm.exists()).toBe(true);
      const prefixSlot = wrapper.find(".prefix-slot");
      expect(prefixSlot.exists()).toBe(true);
      expect(prefixSlot.element.textContent).toMatchInlineSnapshot(`"￥"`);
    });

    test("read mode with suffix slot", () => {
      const num = ref(1);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          min={1}
          max={10}
          rwDispatcherState={"read"}
          v-slots={{
            suffix: () => <span class="suffix-slot">RMB</span>,
          }}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const suffixElm = wrapper.find(`.${classNamespace}-el-text__suffix`);
      expect(suffixElm.exists()).toBe(true);
      const suffixSlot = wrapper.find(".suffix-slot");
      expect(suffixSlot.exists()).toBe(true);
      expect(suffixSlot.element.textContent).toMatchInlineSnapshot(`"RMB"`);
    });

    test("read mode with both prefix and suffix", () => {
      const num = ref(5);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
          modelValue={num.value}
          rwDispatcherState={"read"}
          v-slots={{
            prefix: () => <span class="prefix-slot">￥</span>,
            suffix: () => <span class="suffix-slot">RMB</span>,
          }}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // textContent 顺序: prefix + value + suffix
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"￥5RMB"`);
    });
  });

  describe("slot", () => {
    test("slot write", () => {
      const input = ref(23);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
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
      expect(spanElm.element.textContent).toMatchInlineSnapshot(`"writer: 23"`);
    });

    test("slot read", () => {
      const input = ref(23);
      const wrapper = mount(() => (
        <ElInputNumberDispatcher
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
      expect(spanElm.element.textContent).toMatchInlineSnapshot(`"reader: 23"`);
    });
  });
});
