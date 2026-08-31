<template>
  <div class="css-vars-container">
    <el-form-item label="命名空间:" prop="namespace">
      <el-input v-model="namespace" placeholder="请输入命名空间" />
    </el-form-item>
    <p>点击变量名称复制到剪贴板</p>
    <h4>Light</h4>
    <dl class="css-vars">
      <template v-for="group in lightVars" :key="group.name">
        <dt>
          {{ group.name }}
        </dt>
        <dd
          v-for="item in group.vars"
          :key="item.name"
          @click="copyVarName(item.name)"
        >
          {{ item.name }}: {{ item.value }}
          <ColorTag v-if="item.isColor" :color="item.value" />
        </dd>
      </template>
    </dl>
    <h4>Dark</h4>
    <dl class="css-vars">
      <template v-for="group in darkVars" :key="group.name">
        <dt>
          {{ group.name }}
        </dt>
        <dd
          v-for="item in group.vars"
          :key="item.name"
          @click="copyVarName(item.name)"
        >
          {{ item.name }}: {{ item.value }}
          <ColorTag v-if="item.isColor" :color="item.value" />
        </dd>
      </template>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, defineComponent } from "vue";
import { ElMessage } from "element-plus";
import { useClipboard } from "@vueuse/core";
import themeVars from "@vue-form-rw-dispatcher/element-plus-theme/dist/theme-vars.json";

const ColorTag = defineComponent({
  props: {
    color: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    return () =>
      h("div", { class: "color-tag", style: { backgroundColor: props.color } });
  },
});

const namespace = ref("--rw-dispatcher");

const { copy, isSupported } = useClipboard({ legacy: true });

const copyVarName = async (name: string) => {
  if (!isSupported.value) {
    ElMessage.error("当前环境不支持复制");
    return;
  }
  await copy(name);
  ElMessage.success(`已复制 ${name}`);
};

const isColor = (value: string) => {
  // #hex | rgb()/rgba() 逗号或空格分隔，通道可为小数/百分比
  const channel = String.raw`\d*\.?\d+%?`;
  return new RegExp(
    `^(#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|rgba?\\(\\s*${channel}[\\s,]+${channel}[\\s,]+${channel}\\s*(,[\\s]*${channel})?\\s*\\))$`,
  ).test(value);
};

const groupedVars = (vars: Record<string, string>) => {
  const varsList = Object.keys(vars);
  const sizeVars = varsList.filter(
    (key) =>
      key.includes("size-") ||
      key.includes("height-") ||
      key.includes("width-"),
  );
  const textColorVars = varsList.filter((key) => key.includes("text-color"));
  const primaryColorVars = varsList.filter(
    (key) => key.includes("color-primary") && !key.includes("text-color"),
  );
  const successColorVars = varsList.filter(
    (key) => key.includes("color-success") && !key.includes("text-color"),
  );
  const warningColorVars = varsList.filter(
    (key) => key.includes("color-warning") && !key.includes("text-color"),
  );
  const dangerColorVars = varsList.filter(
    (key) => key.includes("color-danger") && !key.includes("text-color"),
  );
  const errorColorVars = varsList.filter(
    (key) => key.includes("color-error") && !key.includes("text-color"),
  );
  const infoColorVars = varsList.filter(
    (key) => key.includes("color-info") && !key.includes("text-color"),
  );

  const colorItemWrapper = (list: string[]) => {
    return list.map((key) => ({
      name: key.replace("--rw-dispatcher", namespace.value),
      value: vars[key],
      isColor: isColor(vars[key]),
    }));
  };

  return [
    { name: "Size", vars: colorItemWrapper(sizeVars) },
    { name: "Text Color", vars: colorItemWrapper(textColorVars) },
    { name: "Primary Color", vars: colorItemWrapper(primaryColorVars) },
    { name: "Success Color", vars: colorItemWrapper(successColorVars) },
    { name: "Warning Color", vars: colorItemWrapper(warningColorVars) },
    { name: "Danger Color", vars: colorItemWrapper(dangerColorVars) },
    { name: "Error Color", vars: colorItemWrapper(errorColorVars) },
    { name: "Info Color", vars: colorItemWrapper(infoColorVars) },
  ];
};

const lightVars = computed(() => {
  return groupedVars(themeVars.light);
});

const darkVars = computed(() => {
  return groupedVars(themeVars.dark);
});
</script>

<style scoped lang="scss">
.css-vars {
  list-style-type: none;
  padding: 0 20px;
  dd {
    margin: 8px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
.color-tag {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
