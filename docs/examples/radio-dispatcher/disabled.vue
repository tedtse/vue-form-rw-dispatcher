<template>
  <el-radio-dispatcher v-model="radio" disabled value="disabled"
    >Option A</el-radio-dispatcher
  >
  <el-radio-dispatcher v-model="radio" disabled value="selected and disabled">
    Option B
  </el-radio-dispatcher>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const radio = ref("selected and disabled");
</script>
