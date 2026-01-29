<template>
  <el-switch-dispatcher
    v-model="value1"
    :active-icon="Check"
    :inactive-icon="Close"
  />
  <br />
  <el-switch-dispatcher
    v-model="value2"
    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    inline-prompt
    :active-icon="Check"
    :inactive-icon="Close"
  />
  <br />
  <el-switch-dispatcher
    v-model="value3"
    :active-action-icon="View"
    :inactive-action-icon="Hide"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Check, Close, View, Hide } from "@element-plus/icons-vue";

const value1 = ref(true);
const value2 = ref(true);
const value3 = ref(false);
</script>
