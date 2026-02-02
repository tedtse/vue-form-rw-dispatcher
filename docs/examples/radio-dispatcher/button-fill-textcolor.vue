<template>
  <div>
    <el-radio-group-dispatcher v-model="radio1" size="large" fill="#6cf">
      <el-radio-button label="New York" value="1" />
      <el-radio-button label="Washington" value="2" />
      <el-radio-button label="Los Angeles" value="3" />
      <el-radio-button label="Chicago" value="4" />
    </el-radio-group-dispatcher>
  </div>
  <div style="margin-top: 20px">
    <el-radio-group-dispatcher
      v-model="radio2"
      text-color="#626aef"
      fill="rgb(239, 240, 253)"
    >
      <el-radio-button label="New York" value="1" />
      <el-radio-button label="Washington" value="2" />
      <el-radio-button label="Los Angeles" value="3" />
      <el-radio-button label="Chicago" value="4" />
    </el-radio-group-dispatcher>
  </div>
  <div style="margin-top: 20px">
    <el-radio-group-dispatcher v-model="radio3" size="small">
      <el-radio-button label="New York" value="1" />
      <el-radio-button label="Washington" value="2" disabled />
      <el-radio-button label="Los Angeles" value="3" />
      <el-radio-button label="Chicago" value="4" />
    </el-radio-group-dispatcher>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const radio1 = ref("1");
const radio2 = ref("1");
const radio3 = ref("1");
</script>
