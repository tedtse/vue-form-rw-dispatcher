<template>
  <div>
    <el-dispatcher-provider
      disabled
      :rw-dispatcher-state="rwState"
      style="max-width: 600px"
    >
      <el-form-item label="Activity name">
        <el-input-dispatcher v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select-dispatcher
          v-model="form.region"
          placeholder="please select your zone"
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select-dispatcher>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker-dispatcher
            v-model="form.date1"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker-dispatcher
            v-model="form.date2"
            placeholder="Pick a time"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch-dispatcher v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group-dispatcher v-model="form.type">
          <el-checkbox value="Online activities" name="type">
            Online activities text
          </el-checkbox>
          <el-checkbox value="Promotion activities" name="type">
            Promotion activities text
          </el-checkbox>
          <el-checkbox value="Offline activities" name="type">
            Offline activities text
          </el-checkbox>
          <el-checkbox value="Simple brand exposure" name="type">
            Simple brand exposure text
          </el-checkbox>
        </el-checkbox-group-dispatcher>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group-dispatcher v-model="form.resource">
          <el-radio value="Sponsor">Sponsor text</el-radio>
          <el-radio value="Venue">Venue text</el-radio>
        </el-radio-group-dispatcher>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input-dispatcher v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-dispatcher-provider>
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

// do not use same name with ref
const form = reactive({
  name: "张三",
  region: "shanghai",
  delivery: false,
  desc: "xxxxxxxxxx",
  date1: "2026-08-24",
  date2: "2026-08-24 20:21:15",
  resource: "Venue",
  type: ["Online activities", "Promotion activities"],
});

const handleStateToggle = () => {
  console.log(`Current stage: ${rwState.value}`);
};
</script>
