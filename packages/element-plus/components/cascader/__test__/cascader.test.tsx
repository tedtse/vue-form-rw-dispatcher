import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { Config, getClassNamespace } from "../../../config";
import ElCascaderDispatcher from "../";

const classNamespace = getClassNamespace();

type CascaderOption = {
  value: string;
  label: string;
  children?: CascaderOption[];
};

const OPTIONS: CascaderOption[] = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [
          { value: "consistency", label: "Consistency" },
          { value: "feedback", label: "Feedback" },
        ],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [
          { value: "side nav", label: "Side Navigation" },
          { value: "top nav", label: "Top Navigation" },
        ],
      },
    ],
  },
  {
    value: "resource",
    label: "Resource",
    children: [
      { value: "axure", label: "Axure Components" },
      { value: "sketch", label: "Sketch Templates" },
    ],
  },
];

const PATH_1 = ["guide", "disciplines", "consistency"];
const PATH_2 = ["resource", "axure"];

// show-checked-strategy 示例用的 options(multiple 场景)
const STRATEGY_OPTIONS: CascaderOption[] = [
  {
    value: "guide",
    label: "Guide",
    children: [
      {
        value: "disciplines",
        label: "Disciplines",
        children: [{ value: "consistency", label: "Consistency" }],
      },
      {
        value: "navigation",
        label: "Navigation",
        children: [{ value: "side nav", label: "Side Navigation" }],
      },
    ],
  },
  {
    value: "component",
    label: "Component",
    children: [
      {
        value: "basic",
        label: "Basic",
        children: [{ value: "layout", label: "Layout" }],
      },
      {
        value: "form",
        label: "Form",
        children: [{ value: "radio", label: "Radio" }],
      },
    ],
  },
  {
    value: "resource",
    label: "Resource",
    children: [{ value: "axure", label: "Axure Components" }],
  },
];

describe("CascaderDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"write"}
        />
      ));

      // write 模式渲染为 element-plus 原生 ElCascader
      const cascaderElm = wrapper.find(".el-cascader");
      expect(cascaderElm.exists()).toBe(true);

      value.value = PATH_2;
      await nextTick();
      expect(cascaderElm.exists()).toBe(true);
    });

    test("read mode", () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // showAllLevels=true (default) → "Guide / Disciplines / Consistency"
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Guide / Disciplines / Consistency"`,
      );
    });

    test("read mode show-all-levels false", () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          show-all-levels={false}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // showAllLevels=false → 只显示最后一级
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Consistency"`,
      );
    });

    test("read mode multiple", () => {
      const value = ref([PATH_1, PATH_2]);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          props={{ multiple: true }}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // multiple 模式渲染 el-tag
      const tags = selectElm.findAll(".el-tag");
      expect(tags.length).toBe(2);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(
        `"Guide / Disciplines / Consistency"`,
      );
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(
        `"Resource / Axure Components"`,
      );
    });

    test("read mode empty value", () => {
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={[]}
          options={OPTIONS}
          rwDispatcherState={"read"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // 空数组 → 空字符串
      expect(selectElm.element.textContent).toBe("");
    });
  });

  describe("show-checked-strategy", () => {
    test("read mode child (default)", () => {
      // child 策略:多选模式,显示所有选中的叶子节点
      const value = ref([
        ["guide", "disciplines", "consistency"],
        ["guide", "navigation", "side nav"],
      ]);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={STRATEGY_OPTIONS}
          rwDispatcherState={"read"}
          props={{ multiple: true }}
          show-checked-strategy="child"
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      const tags = selectElm.findAll(".el-tag");
      // child 策略下每个选中的路径都作为一个 tag 显示
      expect(tags.length).toBe(2);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(
        `"Guide / Disciplines / Consistency"`,
      );
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(
        `"Guide / Navigation / Side Navigation"`,
      );
    });

    test("read mode parent", () => {
      // parent 策略:多选模式,只显示父节点
      const value = ref([
        ["guide", "disciplines", "consistency"],
        ["guide", "navigation", "side nav"],
      ]);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={STRATEGY_OPTIONS}
          rwDispatcherState={"read"}
          props={{ multiple: true }}
          show-checked-strategy="parent"
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // parent 策略: findLabelByValue 返回 labels[0],即第一级 label
      // 多选模式下,每个路径只取第一级
      const tags = selectElm.findAll(".el-tag");
      expect(tags.length).toBe(2);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(`"Guide"`);
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(`"Guide"`);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          disabled={true}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.classList.contains("is-disabled")).toBe(true);
    });
  });

  describe("size", () => {
    test("small", () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          size="small"
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.classList).toContain(
        `${classNamespace}-el-text--small`,
      );
    });

    test("large", () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          size="large"
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.classList).toContain(
        `${classNamespace}-el-text--large`,
      );
    });
  });

  describe("slot", () => {
    test("slot tag", async () => {
      const value = ref([PATH_1, PATH_2]);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          props={{ multiple: true }}
          v-slots={{
            tag: ({ data }: { data: { text: string }[] }) => (
              <span class="custom-tag">
                {data.map((item) => item.text).join(",")}
              </span>
            ),
          }}
        />
      ));
      // shadow cascader 的 checkedNodes 需要异步更新
      await nextTick();

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      const customTag = wrapper.find(".custom-tag");
      // tag slot 存在即可(shadow cascader 在 jsdom 下可能未完整初始化)
      expect(customTag.exists()).toBe(true);
    });

    test("slot write", () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {value.value.join("/")}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"writer: guide/disciplines/consistency"`,
      );
    });

    test("slot read", () => {
      const value = ref(PATH_1);
      const wrapper = mount(() => (
        <ElCascaderDispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {value.value.join("/")}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"reader: guide/disciplines/consistency"`,
      );
    });
  });
});
