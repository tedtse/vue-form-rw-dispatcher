import { defineComponent, h, nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { ElRadio, ElRadioButton } from "element-plus";
import { Config, getClassNamespace } from "../../../config";
import { ElRadioDispatcher, ElRadioGroupDispatcher } from "../";

const classNamespace = getClassNamespace();

// 简单的 slot 转发组件,用于触发 group-reader.vue watchEffect 中
const SlotWrapper = defineComponent({
  name: "SlotWrapper",
  setup(_, { slots }) {
    return () => slots.default?.();
  },
});

describe("RadioDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue={radio.value}
          value="1"
          rwDispatcherState={"write"}
        >
          Option 1
        </ElRadioDispatcher>
      ));

      // write 模式下渲染为 element-plus 原生 ElRadio
      const radioElm = wrapper.find(".el-radio");
      expect(radioElm.exists()).toBe(true);
    });

    test("read mode with matching value (slot rendered)", async () => {
      // radio-reader.vue: value === modelValue 时渲染 default slot
      const radio = ref("selected");
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue={radio.value}
          value="selected"
          rwDispatcherState={"read"}
        >
          <span class="matched-slot">Option A</span>
        </ElRadioDispatcher>
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // value === modelValue,渲染 default slot
      const slot = wrapper.find(".matched-slot");
      expect(slot.exists()).toBe(true);
      expect(slot.element.textContent).toMatchInlineSnapshot(`"Option A"`);

      // 切换为不匹配的值,slot 不再渲染
      radio.value = "other";
      await nextTick();
      expect(wrapper.find(".matched-slot").exists()).toBe(false);
    });

    test("read mode with non-matching value (empty)", () => {
      // radio-reader.vue: value !== modelValue 且有 slot 时,不渲染任何内容
      const radio = ref("selected");
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue={radio.value}
          value="other"
          rwDispatcherState={"read"}
        >
          <span class="matched-slot">Option A</span>
        </ElRadioDispatcher>
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // value !== modelValue,slot 不渲染,内容为空
      expect(textElm.element.textContent).toBe("");
    });

    test("read mode without slot (label rendered)", () => {
      // radio-reader.vue: 无 default slot 时,渲染 <span>{{ props.label }}</span>
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue="1"
          value="1"
          label="Option A"
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // 无 slot,走 v-else 渲染 label
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toMatchInlineSnapshot(`"Option A"`);
    });

    test("read mode without slot and label", () => {
      // 无 slot 且无 label,<span></span> 渲染为空
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue="1"
          value="1"
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
  });

  describe("disabled", () => {
    test("read mode", () => {
      const radio = ref("selected and disabled");
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue={radio.value}
          value="selected and disabled"
          disabled={true}
          rwDispatcherState={"read"}
        >
          Option B
        </ElRadioDispatcher>
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
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue="1"
          value="1"
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
        <ElRadioDispatcher
          modelValue="1"
          value="1"
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
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue={radio.value}
          value="1"
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {radio.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(`"writer: 1"`);
    });

    test("slot read", () => {
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioDispatcher
          modelValue={radio.value}
          value="1"
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {radio.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(`"reader: 1"`);
    });
  });
});

describe("RadioGroupDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"write"}
        >
          <ElRadio value="1">Option 1</ElRadio>
          <ElRadio value="2">Option 2</ElRadio>
        </ElRadioGroupDispatcher>
      ));

      // write 模式下渲染为 element-plus 原生 ElRadioGroup
      const groupElm = wrapper.find(".el-radio-group");
      expect(groupElm.exists()).toBe(true);
    });

    test("read mode with matched radio slot", async () => {
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"read"}
        >
          <ElRadio value="1">Option 1</ElRadio>
          <ElRadio value="2">Option 2</ElRadio>
        </ElRadioGroupDispatcher>
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // watchEffect 从 shadow radio-group 提取 ElRadio vnode
      // modelValue="1" 匹配第一个 radio,渲染其 default slot "Option 1"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option 1"`);

      radio.value = "2";
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option 2"`);
    });

    test("read mode with no match value", async () => {
      // group-reader.vue: targetRadio 不存在,label computed 返回 modelValue
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue="non-existent"
          rwDispatcherState={"read"}
        >
          <ElRadio value="1">Option 1</ElRadio>
          <ElRadio value="2">Option 2</ElRadio>
        </ElRadioGroupDispatcher>
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // 无匹配 radio,targetRadio 为空,label 走 modelValue ?? null
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toMatchInlineSnapshot(`"non-existent"`);
    });

    test("read mode with radio button", async () => {
      // 使用 ElRadioButton
      const radio = ref("2");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"read"}
        >
          <ElRadioButton label="New York" value="1" />
          <ElRadioButton label="Washington" value="2" />
          <ElRadioButton label="Los Angeles" value="3" />
        </ElRadioGroupDispatcher>
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // ElRadioButton 无 default slot,targetRadioSlot 为 null
      // 走 label computed: targetRadio.props.label = "Washington"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Washington"`);
    });

    test("read mode with options", async () => {
      // 通过 options prop 配置
      const radio = ref(3);
      const options = [
        { id: 3, name: "Option A" },
        { id: 6, name: "Option B" },
        { id: 9, name: "Option C", unable: true },
      ];
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          options={options}
          props={{ value: "id", label: "name", disabled: "unable" }}
          rwDispatcherState={"read"}
        />
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // options 中匹配 id=3,label="Option A"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option A"`);
    });

    test("read mode with options no match", async () => {
      const radio = ref(99);
      const options = [
        { id: 3, name: "Option A" },
        { id: 6, name: "Option B" },
      ];
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          options={options}
          props={{ value: "id", label: "name" }}
          rwDispatcherState={"read"}
        />
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // options 无匹配,且无 targetRadio,label 走 modelValue ?? null
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toMatchInlineSnapshot(`"99"`);
    });

    test("read mode with empty modelValue", async () => {
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={undefined as unknown as string}
          rwDispatcherState={"read"}
        >
          <ElRadio value="1">Option 1</ElRadio>
          <ElRadio value="2">Option 2</ElRadio>
        </ElRadioGroupDispatcher>
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // modelValue undefined,无匹配,targetRadio 为空,label 为 null
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toBe("");
    });

    test("read mode radio without explicit label", async () => {
      // 有 value 但无 label 时,
      // label computed 走 targetRadio.props.value 分支
      const radio = ref("2");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"read"}
        >
          {/* 无 default slot,无 label prop,仅有 value */}
          <ElRadio value="1" />
          <ElRadio value="2" />
        </ElRadioGroupDispatcher>
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // targetRadio.props.label 为 null,走 value 分支返回 "2"
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toMatchInlineSnapshot(`"2"`);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          disabled={true}
          rwDispatcherState={"read"}
        >
          <ElRadio value="1">Option 1</ElRadio>
        </ElRadioGroupDispatcher>
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
        <ElRadioGroupDispatcher
          modelValue="1"
          size="small"
          rwDispatcherState={"read"}
        >
          <ElRadio value="1">Option 1</ElRadio>
        </ElRadioGroupDispatcher>
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
        <ElRadioGroupDispatcher
          modelValue="1"
          size="large"
          rwDispatcherState={"read"}
        >
          <ElRadio value="1">Option 1</ElRadio>
        </ElRadioGroupDispatcher>
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
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {radio.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(`"writer: 1"`);
    });

    test("slot read", () => {
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {radio.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(`"reader: 1"`);
    });
  });

  // watchEffect 中 traverse 遇到非 ElRadio/ElRadioButton 但有 children.default
  // 的 vnode 时,递归进入其 default slot 提取内部的 ElRadio
  describe("watchEffect branch coverage", () => {
    test("read mode with slot wrapper around radio", async () => {
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"read"}
        >
          <SlotWrapper>
            <ElRadio value="1">Option 1</ElRadio>
            <ElRadio value="2">Option 2</ElRadio>
          </SlotWrapper>
        </ElRadioGroupDispatcher>
      ));
      await nextTick();

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // SlotWrapper 的 vnode 不匹配 ElRadio/ElRadioButton,
      // 但其 children.default 存在, 递归进入 slot 提取 ElRadio
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option 1"`);

      radio.value = "2";
      await nextTick();
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option 2"`);
    });
  });

  // `properties?.value ?? "value"` 的 `?? "value"` fallback
  // `option[...] ?? modelValue` 的 `?? modelValue` fallback
  // `targetRadio.props?.[...] ?? modelValue ?? null` 的 `?? modelValue` / `?? null` fallback
  // `traverse((node.children as VNode[]) || [])` 的 `|| []` fallback
  // `<slot :name="name" v-bind="scope || {}">` 的 `|| {}` fallback
  describe("label computed branch coverage", () => {
    test("options without props prop uses default value key", async () => {
      // 不传 props,properties?.value 为 undefined,触发 `?? "value"`
      const options = [
        { value: "1", label: "Option A" },
        { value: "2", label: "Option B" },
      ];
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue="1"
          options={options}
          rwDispatcherState={"read"}
        />
      ));
      await nextTick();
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option A"`);
    });

    test("option found but without label falls back to modelValue", async () => {
      // option 有 value 但无 label,触发 `option[label] ?? modelValue`
      const options = [{ value: "1" }];
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue="1"
          options={options}
          rwDispatcherState={"read"}
        />
      ));
      await nextTick();
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // option 无 label,`?? modelValue` 返回 "1"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"1"`);
    });

    test("option without label and undefined modelValue falls back to null", async () => {
      // option 无 value 无 label,modelValue=undefined
      // opt["value"] === undefined === modelValue → 匹配
      // option["label"] undefined → ?? modelValue(undefined) → ?? null
      const options = [{}];
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={undefined as unknown as string}
          options={options}
          rwDispatcherState={"read"}
        />
      ));
      await nextTick();
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // label 为 null,渲染为空
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toBe("");
    });

    test("matched radio without label/value props falls back to null", async () => {
      // modelValue=undefined + <ElRadio />(无 value/label prop)
      // targetRadio 匹配(undefined === undefined),无 label 无 value
      // targetRadio.props?.["value"] ?? modelValue ?? null → null
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={undefined as unknown as string}
          rwDispatcherState={"read"}
        >
          <ElRadio />
        </ElRadioGroupDispatcher>
      ));
      await nextTick();
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // label 为 null,渲染为空
      const span = textElm.find("span");
      expect(span.exists()).toBe(true);
      expect(span.element.textContent).toBe("");
    });
  });

  describe("watchEffect traverse else branch", () => {
    test("non-radio vnode without children triggers || [] fallback", async () => {
      // h("div", "") 创建 children 为空字符串 "" 的 vnode
      // ("".default) → undefined → falsy → 进入 else 分支
      // ("" || []) → [] → 触发 || [] fallback
      const radio = ref("1");
      const wrapper = mount(() => (
        <ElRadioGroupDispatcher
          modelValue={radio.value}
          rwDispatcherState={"read"}
        >
          {h("div", "")}
          <ElRadio value="1">Option 1</ElRadio>
        </ElRadioGroupDispatcher>
      ));
      await nextTick();
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // div vnode 走 else + || [] 后继续遍历,最终找到 ElRadio
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option 1"`);
    });
  });

  describe("slot scope fallback", () => {
    test("slot forwarded with undefined scope triggers || {}", async () => {
      // 传入 default slot,ElRadioGroup 调用时 scope 为 undefined
      // 触发 v-bind="scope || {}" 的 || {} fallback
      const radio = ref("1");
      const wrapper = mount(
        () => (
          <ElRadioGroupDispatcher
            modelValue={radio.value}
            rwDispatcherState={"read"}
            v-slots={{
              default: () => <ElRadio value="1">Option 1</ElRadio>,
            }}
          />
        ),
        { attrs: { "data-test": "scope-fallback" } },
      );
      await nextTick();
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option 1"`);
    });
  });
});
