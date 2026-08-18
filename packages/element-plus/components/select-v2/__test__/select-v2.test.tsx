import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { Config, getClassNamespace } from "../../../config";
import ElSelectV2Dispatcher from "../";

const classNamespace = getClassNamespace();

type Option = { label: string; value: string };

const OPTIONS: Option[] = [
  { label: "黄金糕", value: "huangjingao" },
  { label: "双皮奶", value: "shuangpinai" },
  { label: "蚵仔煎", value: "kezaijian" },
  { label: "龙须面", value: "longxumian" },
  { label: "北京烤鸭", value: "beijingkaoya" },
];

describe("SelectV2Dispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const value = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"write"}
        />
      ));

      // write 模式下根节点渲染为 element-plus 原生 ElSelectV2
      // ElSelectV2 根 class 是 .el-select(非 .el-select-v2)
      const selectElm = wrapper.find(".el-select");
      expect(selectElm.exists()).toBe(true);

      value.value = OPTIONS?.[1]?.value;
      await nextTick();
      expect(selectElm.exists()).toBe(true);
    });

    test("read mode", async () => {
      const value = ref(OPTIONS?.[0]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[0]?.label}"`,
      );

      value.value = OPTIONS?.[1]?.value!;
      await nextTick();
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[1]?.label}"`,
      );
    });

    test("read mode empty value", () => {
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={undefined as unknown as string}
          options={OPTIONS}
          rwDispatcherState={"read"}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // modelValue 为 undefined 时,label computed 返回 undefined → 渲染为空
      expect(selectElm.element.textContent).toBe("");
    });

    test("read mode multiple", () => {
      const value = ref([OPTIONS?.[0]?.value!, OPTIONS?.[2]?.value!]);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
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
        `"${OPTIONS[0]?.label}"`,
      );
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[2]?.label}"`,
      );
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const value = ref(OPTIONS?.[0]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
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
      const value = ref(OPTIONS?.[0]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
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
      const value = ref(OPTIONS?.[0]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
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

  describe("allow-create", () => {
    test("read mode single", () => {
      // allowCreate + 单选 + modelValue 不在 options 中
      const value = ref("custom-value");
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          allow-create={true}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // allowCreate 时,不匹配的 modelValue 直接作为 label 返回
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"custom-value"`,
      );
    });

    test("read mode multiple", () => {
      // allowCreate + 多选 + 部分值不在 options 中
      const value = ref([OPTIONS?.[0]?.value!, "custom-value"]);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          multiple={true}
          allow-create={true}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      const tags = selectElm.findAll(".el-tag");
      expect(tags.length).toBe(2);
      expect(tags[0]?.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[0]?.label}"`,
      );
      // 不在 options 中的值,用 value 作为 label
      expect(tags[1]?.element.textContent).toMatchInlineSnapshot(
        `"custom-value"`,
      );
    });
  });

  describe("value-key", () => {
    test("read mode", () => {
      // modelValue 为对象,通过 valueKey 匹配
      const options = OPTIONS.map((opt) => ({
        value: { name: opt.value },
        label: opt.label,
      }));
      const value = ref({ name: OPTIONS?.[1]?.value! });
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={options}
          rwDispatcherState={"read"}
          value-key="name"
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // modelValue 为对象时,label computed 走对象分支
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[1]?.label}"`,
      );
    });

    test("read mode multiple with object modelValue", () => {
      const options = OPTIONS.map((opt) => ({
        value: { name: opt.value },
        label: opt.label,
      }));
      const value = ref({ name: OPTIONS?.[1]?.value! });
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={options}
          rwDispatcherState={"read"}
          multiple={true}
          value-key="name"
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
    });
  });

  describe("customized-option", () => {
    test("read mode", () => {
      // 通过 props 自定义 label/value key
      const customOptions = OPTIONS.map((opt) => ({
        id: opt.value,
        name: opt.label,
      }));
      const value = ref(OPTIONS?.[1]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={customOptions}
          rwDispatcherState={"read"}
          props={{ label: "name", value: "id" }}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[1]?.label}"`,
      );
    });
  });

  describe("slot", () => {
    test("slot label", () => {
      const value = ref(OPTIONS?.[0]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          v-slots={{
            label: (scope: { label?: string; value?: string }) => (
              <em class="custom-label">{scope.label}</em>
            ),
          }}
        />
      ));
      const custom = wrapper.find(".custom-label");
      expect(custom.exists()).toBe(true);
      expect(custom.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[0]?.label}"`,
      );
    });

    test("slot label multiple", () => {
      const value = ref([OPTIONS[0]?.value, OPTIONS[2]?.value]);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          multiple={true}
          v-slots={{
            label: (scope: { label?: string; value?: string }) => (
              <em class="custom-label">{scope.label}</em>
            ),
          }}
        />
      ));
      const labels = wrapper.findAll(".custom-label");
      expect(labels.length).toBe(2);
      expect(labels[0]?.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[0]?.label}"`,
      );
      expect(labels[1]?.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS[2]?.label}"`,
      );
    });

    test("slot label no match", () => {
      const value = ref("non-existent-value");
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
          rwDispatcherState={"read"}
          v-slots={{
            label: (scope: { label?: string; value?: string }) => (
              <em class="custom-label">{scope.label}</em>
            ),
          }}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // 无匹配选项时,不渲染 label slot
      expect(selectElm.element.textContent).toBe("");
    });

    test("slot tag", () => {
      const value = ref([OPTIONS[0]?.value, OPTIONS[2]?.value]);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
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
      const value = ref(OPTIONS?.[0]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
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
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"writer: ${OPTIONS[0]?.value}"`,
      );
    });

    test("slot read", () => {
      const value = ref(OPTIONS?.[0]?.value!);
      const wrapper = mount(() => (
        <ElSelectV2Dispatcher
          modelValue={value.value}
          options={OPTIONS}
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
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"reader: ${OPTIONS[0]?.value}"`,
      );
    });
  });
});
