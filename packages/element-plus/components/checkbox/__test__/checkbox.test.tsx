import { defineComponent, h, nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { ElCheckbox, ElCheckboxButton } from "element-plus";
import { Config, getClassNamespace } from "../../../config";
import { ElCheckboxDispatcher, ElCheckboxGroupDispatcher } from "../";

const classNamespace = getClassNamespace();

// 简单的 slot 转发组件,用于触发 group-reader.vue watchEffect 中
// `traverse((node.children as { default(): VNode[] }).default())` 分支
const SlotWrapper = defineComponent({
  name: "SlotWrapper",
  setup(_, { slots }) {
    return () => slots.default?.();
  },
});

describe("CheckboxDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const checked = ref(true);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Option 1"
          rwDispatcherState={"write"}
        />
      ));

      // write 模式下渲染为 element-plus 原生 ElCheckbox
      const checkboxElm = wrapper.find(".el-checkbox");
      expect(checkboxElm.exists()).toBe(true);
    });

    test("read mode checked (label rendered)", async () => {
      // checkbox-reader.vue: isTrue=true 时渲染 <span>{{ text }}</span>
      const checked = ref(true);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Option 1"
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Option 1"`);

      // 切换为 false,不渲染内容
      checked.value = false;
      await nextTick();
      expect(textElm.element.textContent).toBe("");
    });

    test("read mode unchecked (empty)", () => {
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={false}
          label="Option 1"
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // isTrue=false,渲染空 span
      expect(textElm.element.textContent).toBe("");
    });

    test("read mode checked with slot (slot rendered)", () => {
      // checkbox-reader.vue: isTrue=true 且 checkboxSlot 存在时渲染 slot
      const checked = ref(true);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Option 1"
          rwDispatcherState={"read"}
        >
          <span class="matched-slot">Custom content</span>
        </ElCheckboxDispatcher>
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      const slot = wrapper.find(".matched-slot");
      expect(slot.exists()).toBe(true);
      expect(slot.element.textContent).toMatchInlineSnapshot(
        `"Custom content"`,
      );
    });

    test("read mode unchecked with slot (empty)", () => {
      // isTrue=false,即使有 slot 也不渲染
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={false}
          label="Option 1"
          rwDispatcherState={"read"}
        >
          <span class="matched-slot">Custom content</span>
        </ElCheckboxDispatcher>
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(wrapper.find(".matched-slot").exists()).toBe(false);
      expect(textElm.element.textContent).toBe("");
    });

    test("read mode with value prop (matched value)", async () => {
      // checkbox-reader.vue: 有 value prop 时,_text=value (优先于 label),
      // text 渲染为 value;isTrue = modelValue === _text
      const checked = ref("apple");
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Apple"
          value="apple"
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // text.value = label ?? _text = "Apple" ?? "apple" = "Apple"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Apple"`);

      checked.value = "other";
      await nextTick();
      expect(textElm.element.textContent).toBe("");
    });

    test("read mode with trueValue prop", async () => {
      // checkbox-reader.vue: 有 trueValue 时,isTrue = modelValue === trueValue
      const checked = ref("yes");
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Confirm"
          true-value="yes"
          false-value="no"
          rwDispatcherState={"read"}
        />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Confirm"`);

      checked.value = "no";
      await nextTick();
      expect(textElm.element.textContent).toBe("");
    });

    test("read mode without label (empty)", () => {
      // 无 label 无 value,text 为 undefined,渲染为空
      const wrapper = mount(() => (
        <ElCheckboxDispatcher modelValue={true} rwDispatcherState={"read"} />
      ));

      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      expect(textElm.element.textContent).toBe("");
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const checked = ref(false);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          disabled={true}
          rwDispatcherState={"read"}
        >
          Disabled
        </ElCheckboxDispatcher>
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
        <ElCheckboxDispatcher
          modelValue={true}
          label="Option 1"
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
        <ElCheckboxDispatcher
          modelValue={true}
          label="Option 1"
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
      const checked = ref(true);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Option 1"
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {String(checked.value)}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"writer: true"`,
      );
    });

    test("slot read", () => {
      const checked = ref(true);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Option 1"
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {String(checked.value)}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"reader: true"`,
      );
    });
  });
});

describe("CheckboxGroupDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"write"}
        >
          <ElCheckbox label="Option A" value="Value A" />
          <ElCheckbox label="Option B" value="Value B" />
        </ElCheckboxGroupDispatcher>
      ));

      // write 模式下渲染为 element-plus 原生 ElCheckboxGroup
      const groupElm = wrapper.find(".el-checkbox-group");
      expect(groupElm.exists()).toBe(true);
    });

    test("read mode with matched checkboxes", async () => {
      const checkList = ref(["Value selected and disabled", "Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"read"}
        >
          <ElCheckbox label="Option A" value="Value A" />
          <ElCheckbox label="Option B" value="Value B" />
          <ElCheckbox
            label="selected and disabled"
            value="Value selected and disabled"
            disabled
          />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();

      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // targetCheckboxes 匹配两个,渲染两个 checkbox-reader
      const items = containerElm.findAll(`.${classNamespace}-el-text-item`);
      expect(items.length).toBe(2);
      // checkbox-reader 的 text.value = label ?? value, 优先 label
      expect(items[0]?.element.textContent).toMatchInlineSnapshot(`"Option A"`);
      expect(items[1]?.element.textContent).toMatchInlineSnapshot(
        `"selected and disabled"`,
      );
    });

    test("read mode with options", async () => {
      const checkList = ref(["Value selected and disabled", "Value A"]);
      const options = [
        { name: "Option A", id: "Value A" },
        { name: "Option B", id: "Value B" },
        { name: "Option C", id: "Value C" },
        { name: "disabled", id: "Value disabled", unable: true },
        {
          name: "selected and disabled",
          id: "Value selected and disabled",
          unable: true,
        },
      ];
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          options={options}
          props={{ label: "name", value: "id", disabled: "unable" }}
          rwDispatcherState={"read"}
        />
      ));
      await nextTick();

      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // targetOptions 匹配两个
      const items = containerElm.findAll(`.${classNamespace}-el-text-item`);
      expect(items.length).toBe(2);
      // properties.label = "name", text.value = option[name]
      expect(items[0]?.element.textContent).toMatchInlineSnapshot(`"Option A"`);
      expect(items[1]?.element.textContent).toMatchInlineSnapshot(
        `"selected and disabled"`,
      );
    });

    test("read mode with no match", async () => {
      const checkList = ref(["non-existent"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"read"}
        >
          <ElCheckbox label="Option A" value="Value A" />
          <ElCheckbox label="Option B" value="Value B" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();

      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // 无匹配,不渲染任何 item
      const items = containerElm.findAll(`.${classNamespace}-el-text-item`);
      expect(items.length).toBe(0);
    });

    test("read mode with empty modelValue", async () => {
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher modelValue={[]} rwDispatcherState={"read"}>
          <ElCheckbox label="Option A" value="Value A" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();

      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      const items = containerElm.findAll(`.${classNamespace}-el-text-item`);
      expect(items.length).toBe(0);
    });

    test("read mode with checkbox button", async () => {
      // 使用 ElCheckboxButton
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"read"}
        >
          <ElCheckboxButton label="Option A" value="Value A" />
          <ElCheckboxButton label="Option B" value="Value B" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();

      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // ElCheckboxButton 也被 watchEffect 提取
      const items = containerElm.findAll(`.${classNamespace}-el-text-item`);
      expect(items.length).toBe(1);
      // checkbox-reader text 优先 label: "Option A"
      expect(items[0]?.element.textContent).toMatchInlineSnapshot(`"Option A"`);
    });
  });

  describe("disabled", () => {
    test("read mode", async () => {
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          disabled={true}
          rwDispatcherState={"read"}
        >
          <ElCheckbox label="Option A" value="Value A" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();
      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // group-reader.vue disabled 应用到内部 div
      const innerElm = containerElm.find("div");
      expect(innerElm.element.classList.contains("is-disabled")).toBe(true);
    });
  });

  describe("size", () => {
    test("small", async () => {
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          size="small"
          rwDispatcherState={"read"}
        >
          <ElCheckbox label="Option A" value="Value A" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();
      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // size 应用到内部 div
      const innerElm = containerElm.find("div");
      expect(innerElm.element.classList).toContain(
        `${classNamespace}-el-text--small`,
      );
    });

    test("large", async () => {
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          size="large"
          rwDispatcherState={"read"}
        >
          <ElCheckbox label="Option A" value="Value A" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();
      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      const innerElm = containerElm.find("div");
      expect(innerElm.element.classList).toContain(
        `${classNamespace}-el-text--large`,
      );
    });
  });

  describe("slot", () => {
    test("slot write", () => {
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {checkList.value.join(",")}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"writer: Value A"`,
      );
    });

    test("slot read", () => {
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {checkList.value.join(",")}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"reader: Value A"`,
      );
    });
  });

  // 补全 group-reader.vue watchEffect 防御性分支:
  // `traverse((node.children as { default(): VNode[] }).default())`
  // `traverse((node.children as VNode[]) || [])`
  describe("watchEffect branch coverage", () => {
    test("slot wrapper around checkbox triggers default slot recursion", async () => {
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"read"}
        >
          <SlotWrapper>
            <ElCheckbox label="Option A" value="Value A" />
            <ElCheckbox label="Option B" value="Value B" />
          </SlotWrapper>
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();
      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // SlotWrapper 的 vnode 触发 default slot 递归提取 ElCheckbox
      const items = containerElm.findAll(`.${classNamespace}-el-text-item`);
      expect(items.length).toBe(1);
      // checkbox-reader text 优先 label: "Option A"
      expect(items[0]?.element.textContent).toMatchInlineSnapshot(`"Option A"`);
    });

    test("non-checkbox vnode without default slot triggers || [] fallback", async () => {
      // h("div", "") 创建 children 为空字符串的 vnode
      // ("".default) → undefined → falsy → 进入 else
      // ("" || []) → [] → 触发 || [] fallback
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"read"}
        >
          {h("div", "")}
          <ElCheckbox label="Option A" value="Value A" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();
      const containerElm = wrapper.find(
        `.${classNamespace}-el-text-container`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(containerElm.exists()).toBe(true);
      // div vnode 走 else + || [] 后继续遍历,最终找到 ElCheckbox
      const items = containerElm.findAll(`.${classNamespace}-el-text-item`);
      expect(items.length).toBe(1);
      expect(items[0]?.element.textContent).toMatchInlineSnapshot(`"Option A"`);
    });
  });

  // 补全 checkbox-reader.vue 分支
  describe("checkbox-reader branch coverage", () => {
    test("trueValue branch: modelValue equals true", async () => {
      // 有 trueValue,modelValue === true (而不是 trueValue)
      // checkbox-reader.vue: modelValue === trueValue || modelValue === true
      const checked = ref(true);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Confirm"
          true-value="yes"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // modelValue === true → isTrue=true
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Confirm"`);
    });

    test("value branch: modelValue equals true", async () => {
      // 有 value,modelValue === true (而不是 value)
      // checkbox-reader.vue: modelValue === _text || modelValue === true
      const checked = ref(true);
      const wrapper = mount(() => (
        <ElCheckboxDispatcher
          modelValue={checked.value}
          label="Apple"
          value="apple"
          rwDispatcherState={"read"}
        />
      ));
      const textElm = wrapper.find(
        `.${classNamespace}-el-text`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(textElm.exists()).toBe(true);
      // text.value = label ?? _text = "Apple"
      expect(textElm.element.textContent).toMatchInlineSnapshot(`"Apple"`);
    });

    test("nsType item (rendered in group)", async () => {
      // group-reader.vue 渲染 checkbox-reader 时传入 rwDispatcherType="item"
      const checkList = ref(["Value A"]);
      const wrapper = mount(() => (
        <ElCheckboxGroupDispatcher
          modelValue={checkList.value}
          rwDispatcherState={"read"}
        >
          <ElCheckbox label="Option A" value="Value A" />
        </ElCheckboxGroupDispatcher>
      ));
      await nextTick();
      // item 类型使用 nsText.b('item') → {ns}-el-text-item
      const itemElm = wrapper.find(
        `.${classNamespace}-el-text-item`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(itemElm.exists()).toBe(true);
    });
  });
});
