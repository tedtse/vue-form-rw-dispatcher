<template>
  <el-form v-bind="{ ...props, ...attrs }">
    <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope || {}"></slot>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { computed, provide, useAttrs } from "vue";
import {
  Config,
  type RWDispatcherProps,
  type RWDispatcherState,
} from "@vue-form-rw-dispatcher/helper";
import { ElForm, type FormProps } from "element-plus";

defineOptions({ name: "ElFormDispatcher" });
const StateKey = `${Config.namespace}State`;
const props = defineProps<FormProps>();
const attrs = useAttrs();
const state = computed(() => attrs[StateKey] || "write");
provide(`${Config.namespace}State`, state);
</script>
