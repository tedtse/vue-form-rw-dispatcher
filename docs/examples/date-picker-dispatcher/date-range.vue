<template>
  <div class="demo-date-picker">
    <div class="block">
      <span class="demonstration">Date Range</span>
      <el-date-picker-dispatcher
        v-model="value1"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
      />
    </div>
    <div class="block">
      <span class="demonstration">Month Range</span>
      <el-date-picker-dispatcher
        v-model="value2"
        type="monthrange"
        range-separator="To"
        start-placeholder="Start month"
        end-placeholder="End month"
      />
    </div>
    <div class="block">
      <span class="demonstration">Year Range</span>
      <el-date-picker-dispatcher
        v-model="value3"
        type="yearrange"
        range-separator="To"
        start-placeholder="Start Year"
        end-placeholder="End Year"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const value1 = ref("");
const value2 = ref("");
const value3 = ref("");
</script>
