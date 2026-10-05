<template>
  <div class="container">
    <el-form-item label="Activity name">
      <el-input-dispatcher v-model="form.name" :ns-state="rwState" />
    </el-form-item>
    <el-form-item label="Instant delivery">
      <el-switch-dispatcher v-model="form.delivery" :ns-state="rwState" />
    </el-form-item>
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
import { type RWDispatcherState } from "element-plus-form-dispatcher/helper";

const rwState = ref<RWDispatcherState>("read");

// do not use same name with ref
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const handleStateToggle = (val: RWDispatcherState) => {
  // v-model 已自动更新 rwState，这里无需再手动翻转
  console.log(`Current stage: ${val}`);
};

const onSubmit = () => {
  console.log("submit!", form);
};
</script>

<style lang="css" scoped>
.container {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: left;
}
</style>
