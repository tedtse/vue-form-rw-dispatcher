<template>
  <el-form v-bind="{ ...props, ...$attrs }">
    <template v-for="(_, name) in $slots" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope || {}"></slot>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { ref, provide, computed } from "vue";
import {
  Config,
  type RWDispatcherState,
  type RWDispatcherProps,
} from "@vue-form-rw-dispatcher/helper";
import { ElForm, type FormProps } from "element-plus";

const props = defineProps<FormProps & RWDispatcherProps>();
const state =
  computed(() => props[`${Config.namespace}State`] as RWDispatcherState) ||
  "write";
const rwDispatcherState = ref<RWDispatcherState>(state.value);
provide(`${Config.namespace}State`, rwDispatcherState);
</script>
