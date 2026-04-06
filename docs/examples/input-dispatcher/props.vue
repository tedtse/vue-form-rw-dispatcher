<template>
  <div>
    <el-input-dispatcher
      v-model="input"
      :rw-dispatcher-state="rwState"
      style="width: 240px"
      placeholder="Please input"
    />
    <p>
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
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { type RWDispatcherState } from "@vue-form-rw-dispatcher/helper";

const input = ref("abc");
const rwState = ref<RWDispatcherState>("write");

const handleStateToggle = () => {
  console.log(`Current stage: ${rwState.value}`);
};
</script>
