<template>
  <el-switch-dispatcher v-model="value" active-text="On" inactive-text="Off" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(false)
</script>
