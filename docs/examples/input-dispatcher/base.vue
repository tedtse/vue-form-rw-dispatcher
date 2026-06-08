<template>
  <el-input-dispatcher
    ref="inputRef"
    v-model="input"
    style="width: 240px"
    placeholder="Please input"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
const input = ref("abc");
</script>
