<template>
  <div class="flex flex-wrap items-center gap-16px">
    <el-input-number-dispatcher v-model="num1" size="large" />
    <el-input-number-dispatcher v-model="num2" />
    <el-input-number-dispatcher v-model="num3" size="small" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const num1 = ref(1)
const num2 = ref(2)
const num3 = ref(3)
</script>
