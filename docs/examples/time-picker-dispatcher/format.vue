<template>
  <el-time-picker-dispatcher v-model="time" format="HH:mm" />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const time = ref("12:00");
</script>
