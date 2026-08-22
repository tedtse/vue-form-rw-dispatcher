<template>
  <div class="flex items-center">
    <el-radio-group v-model="size" aria-label="size control">
      <el-radio-button value="large">large</el-radio-button>
      <el-radio-button value="default">default</el-radio-button>
      <el-radio-button value="small">small</el-radio-button>
    </el-radio-group>
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
  <br />
  <el-dispatcher-provider
    style="max-width: 600px"
    :size="size"
    :rw-dispatcher-state="rwState"
  >
    <el-form-item label="Activity name">
      <el-input-dispatcher v-model="sizeForm.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select-dispatcher
        v-model="sizeForm.region"
        placeholder="please select your zone"
      >
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select-dispatcher>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker-dispatcher
          v-model="sizeForm.date1"
          type="date"
          aria-label="Pick a date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
      <el-col :span="11">
        <el-time-picker-dispatcher
          v-model="sizeForm.date2"
          aria-label="Pick a time"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group-dispatcher v-model="sizeForm.type">
        <el-checkbox-button value="Online activities" name="type">
          Online activities
        </el-checkbox-button>
        <el-checkbox-button value="Promotion activities" name="type">
          Promotion activities
        </el-checkbox-button>
      </el-checkbox-group-dispatcher>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group-dispatcher v-model="sizeForm.resource">
        <el-radio border value="Sponsor">Sponsor</el-radio>
        <el-radio border value="Venue">Venue</el-radio>
      </el-radio-group-dispatcher>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-dispatcher-provider>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { ComponentSize, FormProps } from "element-plus";
import { type RWDispatcherState } from "@vue-form-rw-dispatcher/helper";

const size = ref<ComponentSize>("default");
const rwState = ref<RWDispatcherState>("write");

const sizeForm = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

function onSubmit() {
  console.log("submit!");
}

const handleStateToggle = () => {
  console.log(`Current stage: ${rwState.value}`);
};
</script>

<style>
.el-radio-group {
  margin-right: 12px;
}
</style>
