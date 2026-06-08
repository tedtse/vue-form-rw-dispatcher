<template>
  <div>
    <el-form-dispatcher
      :label-position="labelPosition"
      label-width="auto"
      :model="formLabelAlign"
      :rw-dispatcher-state="rwState"
      style="max-width: 600px"
    >
      <el-form-item label="Form Align" label-position="right">
        <el-radio-group v-model="labelPosition" aria-label="label position">
          <el-radio-button value="left">Left</el-radio-button>
          <el-radio-button value="right">Right</el-radio-button>
          <el-radio-button value="top">Top</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Form Item Align" label-position="right">
        <el-radio-group
          v-model="itemLabelPosition"
          aria-label="item label position"
        >
          <el-radio-button value="">Empty</el-radio-button>
          <el-radio-button value="left">Left</el-radio-button>
          <el-radio-button value="right">Right</el-radio-button>
          <el-radio-button value="top">Top</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Name" :label-position="itemLabelPosition">
        <el-input-dispatcher v-model="formLabelAlign.name" />
      </el-form-item>
      <el-form-item label="Activity zone" :label-position="itemLabelPosition">
        <el-input-dispatcher v-model="formLabelAlign.region" />
      </el-form-item>
      <el-form-item label="Activity form" :label-position="itemLabelPosition">
        <el-input-dispatcher v-model="formLabelAlign.type" />
      </el-form-item>
    </el-form-dispatcher>
    <el-switch
      v-model="rwState"
      active-value="write"
      inactive-value="read"
      active-text="Write"
      inactive-text="Read"
      @change="handleStateToggle"
    >
      Toggle State
    </el-switch>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormItemProps, FormProps } from "element-plus";
import { type RWDispatcherState } from "@vue-form-rw-dispatcher/helper";

const rwState = ref<RWDispatcherState>("write");

const labelPosition = ref<FormProps["labelPosition"]>("right");
const itemLabelPosition = ref<FormItemProps["labelPosition"]>("");
const formLabelAlign = reactive({
  name: "",
  region: "",
  type: "",
});

const handleStateToggle = () => {
  console.log(`Current stage: ${rwState.value}`);
};
</script>
