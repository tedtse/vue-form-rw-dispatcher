import { nextTick, ref } from "vue";
import { mount, type DOMWrapper } from "@vue/test-utils";
import { describe, test, expect } from "vitest";
import { ElOption, ElOptionGroup } from "element-plus";
import { Config } from "../../../config";
import ElSelectDispatcher from "../";

const classNamespace = Config.namespace.replace(
  /[A-Z]/g,
  (m) => `-${m.toLowerCase()}`,
);

type Option = { label: string; value: string };

const OPTIONS: Option[] = [
  { label: "黄金糕", value: "huangjingao" },
  { label: "双皮奶", value: "shuangpinai" },
  { label: "蚵仔煎", value: "kezaijian" },
];

describe("SelectDispatcher", () => {
  describe("props", () => {
    test("write mode", async () => {
      const model = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"write"}
        >
          {OPTIONS.map((opt) => (
            <ElOption key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </ElSelectDispatcher>
      ));

      // write 模式下透传 ElSelect,根节点使用 element-plus 自身 class: .el-select
      const selectElm = wrapper.find(".el-select");
      expect(selectElm.exists()).toBe(true);
      expect(
        (selectElm.element as HTMLElement).classList.contains("el-select"),
      ).toBe(true);
    });

    test("read mode", async () => {
      const model = ref(OPTIONS?.[1]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          options={OPTIONS}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS?.[1]?.label}"`,
      );

      model.value = OPTIONS?.[2]?.value;
      await nextTick();
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS?.[2]?.label}"`,
      );
    });

    test("read mode empty value", () => {
      const model = ref(undefined as string | undefined);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          options={OPTIONS}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toBe("");
    });

    test("read mode multiple", async () => {
      const model = ref([OPTIONS?.[0]?.value, OPTIONS?.[2]?.value]);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          multiple={true}
          options={OPTIONS}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);

      // reader.vue 中 :class="nsTag.b('bg-color')" 生成的是连字符 BEM
      // .{ns}-el-tag-bg-color,不是修饰符形式 --bg-color
      const tags = selectElm.findAll(".el-tag__content");
      expect(tags.length).toBe(2);
      expect(tags[0]?.text()).toMatchInlineSnapshot(`"${OPTIONS?.[0]?.label}"`);
      expect(tags[1]?.text()).toMatchInlineSnapshot(`"${OPTIONS?.[2]?.label}"`);
    });
  });

  describe("disabled", () => {
    test("read mode", () => {
      const model = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          disabled={true}
          options={OPTIONS}
        />
      ));

      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS?.[0]?.label}"`,
      );
      // reader.vue 使用 nsText.is('disabled'),生成的是不加前缀的原始状态 class: is-disabled
      expect(selectElm.element.classList.contains("is-disabled")).toBe(true);
    });
  });

  describe("size", () => {
    test("small", () => {
      const model = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          size="small"
          options={OPTIONS}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // nsText.m('small') 生成的是 BEM modifier: {ns}-el-text--small
      expect(selectElm.element.classList).toContain(
        `${classNamespace}-el-text--small`,
      );
    });

    test("large", () => {
      const model = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          size="large"
          options={OPTIONS}
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
    test("slot write", () => {
      const model = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"write"}
          v-slots={{
            [`${Config.namespace}Writer`]: () => (
              <span style="color: red" key="writer">
                writer: {model.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"red"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"writer: ${OPTIONS?.[0]?.value}"`,
      );
    });

    test("slot read", () => {
      const model = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          v-slots={{
            [`${Config.namespace}Reader`]: () => (
              <span style="color: green" key="reader">
                reader: {model.value}
              </span>
            ),
          }}
        />
      ));
      const spanElm = wrapper.find("span");
      expect(spanElm.exists()).toBe(true);
      expect(spanElm.element.style.color).toMatchInlineSnapshot(`"green"`);
      expect(spanElm.element.textContent).toMatchInlineSnapshot(
        `"reader: ${OPTIONS?.[0]?.value}"`,
      );
    });

    test("slot label", () => {
      const model = ref(OPTIONS?.[0]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          options={OPTIONS}
          v-slots={{
            label: (scope: { label?: string; value?: string }) => (
              <em class="custom-label">【{scope.label}】</em>
            ),
          }}
        />
      ));
      const custom = wrapper.find(".custom-label");
      expect(custom.exists()).toBe(true);
      expect(custom.element.textContent).toMatchInlineSnapshot(
        `"【${OPTIONS?.[0]?.label}】"`,
      );
    });

    test("slot tag", () => {
      const model = ref([OPTIONS?.[0]?.value]);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          multiple={true}
          options={OPTIONS}
          v-slots={{
            tag: () => <span class="custom-tag">tag-custom</span>,
          }}
        />
      ));
      // slot="tag" 优先级最高,不会额外渲染 nsSelect.b('selection') 容器
      // 自定义内容直接落到根元素内
      const custom = wrapper.find(".custom-tag");
      expect(custom.exists()).toBe(true);
      expect(custom.element.textContent).toMatchInlineSnapshot(`"tag-custom"`);
    });

    test("slot label multiple", () => {
      const model = ref([OPTIONS?.[0]?.value, OPTIONS?.[2]?.value]);
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          multiple={true}
          options={OPTIONS}
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
        `"${OPTIONS?.[0]?.label}"`,
      );
      expect(labels[1]?.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS?.[2]?.label}"`,
      );
    });
  });

  describe("object value", () => {
    test("read mode", () => {
      const model = ref({
        label: OPTIONS?.[0]?.label,
        value: OPTIONS?.[0]?.value,
      });
      const wrapper = mount(() => (
        <ElSelectDispatcher
          modelValue={model.value}
          rwDispatcherState={"read"}
          options={OPTIONS}
        />
      ));
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // modelValue 为对象时,label computed 走对象分支,直接返回 modelValue.label
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${OPTIONS?.[0]?.label}"`,
      );
    });
  });

  describe("el-option children", () => {
    test("read mode with option slots", async () => {
      const model = ref(OPTIONS?.[1]?.value);
      const wrapper = mount(() => (
        <ElSelectDispatcher modelValue={model.value} rwDispatcherState={"read"}>
          {OPTIONS.map((opt) => (
            <ElOption key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </ElSelectDispatcher>
      ));
      // watchEffect 从 shadow select 的 $slots.default() 提取 ElOption
      // vnode 是异步的,需要等微任务完成
      await nextTick();
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      // read 模式下用 ElOption 子组件时,reader.vue 的 watchEffect
      // 走 shadow slot 遍历分支(L116-130)提取 options
      expect(selectElm.element.textContent).toMatchInlineSnapshot(`"双皮奶"`);
    });
  });

  describe("el-option-group", () => {
    const model = ref("3");
    const options = [
      {
        label: "Popular cities",
        options: [
          {
            value: "1",
            label: "Shanghai",
          },
          {
            value: "2",
            label: "Beijing",
          },
        ],
      },
      {
        label: "City name",
        options: [
          {
            value: "3",
            label: "Chengdu",
          },
          {
            value: "4",
            label: "Shenzhen",
          },
          {
            value: "5",
            label: "Guangzhou",
          },
        ],
      },
    ];

    test("read mode", async () => {
      const wrapper = mount(() => (
        <ElSelectDispatcher modelValue={model.value} rwDispatcherState={"read"}>
          {options.map((group) => (
            <ElOptionGroup
              key={group.label}
              label={group.label}
              v-slots={{
                default: () =>
                  group.options.map((item) => (
                    <ElOption
                      key={item.value}
                      label={item.label}
                      value={item.value}
                    />
                  )),
              }}
            />
          ))}
        </ElSelectDispatcher>
      ));
      await nextTick();
      const selectElm = wrapper.find(
        `.${classNamespace}-el-select`,
      ) as DOMWrapper<HTMLDivElement>;
      expect(selectElm.exists()).toBe(true);
      let target: Option | undefined;
      options.some((opt) => {
        target = opt.options.find((item) => item.value === model.value);
        return target !== undefined;
      });
      expect(target).toBeDefined();
      expect(selectElm.element.textContent).toMatchInlineSnapshot(
        `"${target?.label}"`,
      );
    });
  });
});
