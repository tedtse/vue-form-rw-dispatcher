import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { Config, getClassNamespace } from "../../../config";
import ElTreeSelectDispatcher from "..";

const classNamespace = getClassNamespace();

type TreeNode = {
  value?: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  id?: number;
};

const DATA: TreeNode[] = [
  {
    value: "1",
    label: "Level one 1",
    children: [
      {
        value: "1-1",
        label: "Level two 1-1",
        children: [{ value: "1-1-1", label: "Level three 1-1-1" }],
      },
    ],
  },
  {
    value: "2",
    label: "Level one 2",
    children: [
      {
        value: "2-1",
        label: "Level two 2-1",
        children: [{ value: "2-1-1", label: "Level three 2-1-1" }],
      },
      {
        value: "2-2",
        label: "Level two 2-2",
        children: [{ value: "2-2-1", label: "Level three 2-2-1" }],
      },
    ],
  },
  {
    value: "3",
    label: "Level one 3",
    children: [
      {
        value: "3-1",
        label: "Level two 3-1",
        children: [{ value: "3-1-1", label: "Level three 3-1-1" }],
      },
      {
        value: "3-2",
        label: "Level two 3-2",
        children: [{ value: "3-2-1", label: "Level three 3-2-1" }],
      },
    ],
  },
];

describe("TreeSelectDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const value = ref("1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"write"}
        />
      ));

      // write 模式下根节点渲染为 element-plus 原生 ElTreeSelect
      // ElTreeSelect 根 class 是 .el-select(与 ElSelect 共用)
      const selectElm = wrapper.find(".el-select");
      expect(selectElm.exists()).toBe(true);
    });

    test("read mode", async () => {
      const value = ref("1-1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // modelValue="1-1" 命中嵌套节点 "Level two 1-1"
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Level two 1-1"`,
      );

      value.value = "2-2-1";
      await nextTick();
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Level three 2-2-1"`,
      );
    });

    test("read mode empty value", () => {
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={undefined as unknown as string}
          data={DATA}
          rwDispatcherState={"read"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // modelValue 为 undefined,displayText computed 走空分支,渲染为空
      expect(selectElm.element.textContent).toBe("");
    });

    test("read mode no match value", () => {
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={"non-existent-value"}
          data={DATA}
          rwDispatcherState={"read"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // modelValue 找不到匹配节点时,displayLabels 返回空数组,displayText 返回 ""
      expect(selectElm.element.textContent).toBe("");
    });

    test("read mode multiple", async () => {
      const value = ref(["1-1", "2-2-1"]);
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
          multiple={true}
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
        `"Level two 1-1"`,
      );
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(
        `"Level three 2-2-1"`,
      );
    });

    test("read mode multiple with non-existent value", () => {
      // multiple 模式下 modelValue 包含不存在值,跳过不渲染 tag
      const value = ref(["1-1", "no-exist"]);
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
          multiple={true}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      const tags = selectElm.findAll(".el-tag");
      expect(tags.length).toBe(1);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(
        `"Level two 1-1"`,
      );
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const value = ref("1-1-1");
      const disabledData: TreeNode[] = [
        {
          value: "1",
          label: "Level one 1",
          disabled: true,
          children: [
            {
              value: "1-1",
              label: "Level two 1-1",
              disabled: true,
              children: [
                { value: "1-1-1", label: "Level three 1-1-1", disabled: true },
              ],
            },
          ],
        },
        ...DATA.slice(1),
      ];
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={disabledData}
          rwDispatcherState={"read"}
          disabled={true}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Level three 1-1-1"`,
      );
      // reader.vue 使用 nsText.is('disabled') 生成原始状态 class: is-disabled
      expect(selectElm.element.classList.contains("is-disabled")).toBe(true);
    });
  });

  describe("size", () => {
    test("small", () => {
      const value = ref("1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
          size="small"
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // nsText.m('small') 生成 BEM modifier: {ns}-el-text--small
      expect(selectElm.element.classList).toContain(
        `${classNamespace}-el-text--small`,
      );
    });

    test("large", () => {
      const value = ref("1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
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

  describe("node-key", () => {
    test("read mode multiple with nodeKey", () => {
      const data = [
        {
          id: 1,
          label: "Level one 1",
          children: [
            { id: 2, label: "Level two 1-1" },
            { id: 3, label: "Level two 1-2" },
          ],
        },
      ];
      const value = ref([2]);
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={data}
          rwDispatcherState={"read"}
          multiple={true}
          node-key={"id"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      const tags = selectElm.findAll(".el-tag");
      expect(tags.length).toBe(1);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(
        `"Level two 1-1"`,
      );
    });

    test("read mode single with nodeKey", () => {
      const data = [
        {
          id: 1,
          label: "Level one 1",
          children: [
            { id: 2, label: "Level two 1-1" },
            { id: 3, label: "Level two 1-2" },
          ],
        },
      ];
      const value = ref(3);
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={data}
          rwDispatcherState={"read"}
          node-key={"id"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Level two 1-2"`,
      );
    });
  });

  describe("customized-option", () => {
    // 通过 props 自定义 label/children key
    test("read mode with custom props", () => {
      const customData = [
        {
          key: "1",
          name: "Level one 1",
          sub: [
            {
              key: "1-1",
              name: "Level two 1-1",
              sub: [{ key: "1-1-1", name: "Level three 1-1-1" }],
            },
          ],
        },
      ];
      const value = ref("1-1-1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={customData}
          rwDispatcherState={"read"}
          value-key={"key"}
          props={{ label: "name", children: "sub" }}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // 通过自定义 props 的 label/children 找到嵌套节点
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Level three 1-1-1"`,
      );
    });

    test("read mode multiple with custom props", () => {
      const customData = [
        {
          key: "1",
          name: "Level one 1",
          sub: [
            { key: "1-1", name: "Level two 1-1" },
            { key: "1-2", name: "Level two 1-2" },
          ],
        },
      ];
      const value = ref(["1-1", "1-2"]);
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={customData}
          rwDispatcherState={"read"}
          multiple={true}
          value-key={"key"}
          props={{ label: "name", children: "sub" }}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      const tags = selectElm.findAll(".el-tag");
      expect(tags.length).toBe(2);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(
        `"Level two 1-1"`,
      );
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(
        `"Level two 1-2"`,
      );
    });
  });

  describe("slot", () => {
    test("slot tag", () => {
      // $slots.tag 优先级最高,直接渲染自定义内容
      const value = ref(["1-1", "2-2-1"]);
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
          multiple={true}
          v-slots={{
            tag: () => <span class="custom-tag">tag-custom</span>,
          }}
        />
      ));
      const custom = wrapper.find(".custom-tag");
      expect(custom.exists()).toBe(true);
      expect(custom.element.textContent).toMatchInlineSnapshot(`"tag-custom"`);
    });

    test("slot write", () => {
      const value = ref("1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {value.value}
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
      const value = ref("1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {value.value}
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

  describe("nested node traversal", () => {
    // 覆盖 reader.vue findNodeByValue 递归遍历子节点
    test("deeply nested node level 3", () => {
      const value = ref("3-2-1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Level three 3-2-1"`,
      );
    });

    test("root level node", () => {
      const value = ref("2");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"Level one 2"`,
      );
    });

    test("multiple with mixed depth values", () => {
      // 同时匹配根节点和三级节点,覆盖递归查找不同层级
      const value = ref(["1", "1-1-1", "3-2"]);
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={DATA}
          rwDispatcherState={"read"}
          multiple={true}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      const tags = selectElm.findAll(".el-tag");
      expect(tags.length).toBe(3);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(
        `"Level one 1"`,
      );
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(
        `"Level three 1-1-1"`,
      );
      expect(tags[2]?.element.textContent).toMatchInlineSnapshot(
        `"Level two 3-2"`,
      );
    });
  });

  describe("data variations", () => {
    test("empty data array", () => {
      const value = ref("1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={[]}
          rwDispatcherState={"read"}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // 数据为空时,找不到节点,displayText 返回空
      expect(selectElm.element.textContent).toBe("");
    });

    test("undefined data", () => {
      // findNodeByValue 接收 undefined,返回 null,displayText 为空
      const value = ref("1");
      const wrapper = mount(() => (
        <ElTreeSelectDispatcher
          modelValue={value.value}
          data={undefined as unknown as TreeNode[]}
          rwDispatcherState={"read"}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toBe("");
    });
  });
});
