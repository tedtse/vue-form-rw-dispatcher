<template>
  <div>
    <el-form-dispatcher
      :inline="true"
      :model="formInline"
      :rw-dispatcher-state="rwState"
      class="demo-form-inline"
    >
      <el-form-item label="Approved by">
        <el-input-dispatcher
          v-model="formInline.user"
          placeholder="Approved by"
          clearable
        />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select-dispatcher
          v-model="formInline.region"
          placeholder="Activity zone"
          clearable
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select-dispatcher>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-date-picker-dispatcher
          v-model="formInline.date"
          type="date"
          placeholder="Pick a date"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Query</el-button>
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
import { type RWDispatcherState } from "@vue-form-rw-dispatcher/helper";

const rwState = ref<RWDispatcherState>("write");

const formInline = reactive({
  user: "",
  region: "",
  date: "",
});

const handleStateToggle = () => {
  console.log(`Current stage: ${rwState.value}`);
};

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style>
.demo-form-inline .el-input {
  --el-input-width: 200px;
}

.demo-form-inline .el-select {
  --el-select-width: 200px;
}

.demo-form-inline .rw-dispatcher-el-text {
  width: 200px;
}
</style>
