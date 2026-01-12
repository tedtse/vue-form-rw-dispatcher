<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ElDivider,
  ElTooltip,
  ElIcon,
  ElCollapseTransition,
  ElMessage,
} from "element-plus";
import { useClipboard, useToggle } from "@vueuse/core";
import { EVENT_CODE } from "element-plus";
import { CaretTop } from "@element-plus/icons-vue";
import { useLang } from "../composables/lang";
import { useRWDispatcher } from "../composables/use-rw-disaptcher";
import demoBlockLocale from "../../i18n/component/demo-block.json";
import SourceCode from "./vp-source-code.vue";

const props = defineProps<{
  source: string;
  path: string;
  rawSource: string;
  description: string;
}>();

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
});

const [sourceVisible, toggleSourceVisible] = useToggle();
const lang = useLang();
const { rwDispatcherState, toggleRWDispatcherState } = useRWDispatcher();

const sourceCodeRef = ref<HTMLButtonElement>();

const locale = computed(
  () => demoBlockLocale[lang.value as keyof typeof demoBlockLocale]
);
const decodedDescription = computed(() =>
  decodeURIComponent(props.description)
);

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (
    [EVENT_CODE.enter, EVENT_CODE.numpadEnter, EVENT_CODE.space].includes(
      e.code
    )
  ) {
    e.preventDefault();
    toggleSourceVisible(false);
    sourceCodeRef.value?.focus();
  }
};

const copyCode = async () => {
  if (!isSupported) {
    ElMessage.error(locale.value["copy-error"]);
  }
  try {
    await copy();
    ElMessage.success(locale.value["copy-success"]);
  } catch (e: any) {
    ElMessage.error(e.message);
  }
};
</script>

<template>
  <div text="sm" m="y-4" v-html="decodedDescription"></div>

  <div class="example">
    <div class="example-showcase">
      <slot name="source" />
    </div>

    <ElDivider class="m-0" />

    <div class="op-btns">
      <ElTooltip
        :content="locale[rwDispatcherState + '-state']"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <button
          ref="sourceCodeRef"
          :aria-label="locale[rwDispatcherState + '-state']"
          class="reset-btn el-icon op-btn"
          @click="toggleRWDispatcherState()"
        >
          <ElIcon :size="16" color="#409eff">
            <i-ri-edit-line v-if="rwDispatcherState === 'read'" />
            <i-ri-eye-line v-else />
          </ElIcon>
        </button>
      </ElTooltip>

      <ElTooltip
        :content="locale['copy-code']"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <ElIcon
          :size="16"
          :aria-label="locale['copy-code']"
          class="op-btn"
          tabindex="0"
          role="button"
          @click="copyCode"
          @keydown.prevent.enter="copyCode"
          @keydown.prevent.space="copyCode"
        >
          <i-ri-file-copy-line />
        </ElIcon>
      </ElTooltip>

      <ElTooltip
        :content="sourceVisible ? locale['hide-source'] : locale['view-source']"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <button
          ref="sourceCodeRef"
          :aria-label="
            sourceVisible ? locale['hide-source'] : locale['view-source']
          "
          class="reset-btn el-icon op-btn"
          @click="toggleSourceVisible()"
        >
          <ElIcon :size="16">
            <i-ri-code-line />
          </ElIcon>
        </button>
      </ElTooltip>

      <!-- <ElTooltip
        :content="locale['view-on-github']"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
      </ElTooltip> -->
    </div>

    <ElCollapseTransition>
      <SourceCode :visible="sourceVisible" :source="source" />
    </ElCollapseTransition>

    <Transition name="el-fade-in-linear">
      <div
        v-show="sourceVisible"
        class="example-float-control"
        tabindex="0"
        role="button"
        @click="toggleSourceVisible(false)"
        @keydown="onSourceVisibleKeydown"
      >
        <ElIcon :size="16">
          <CaretTop />
        </ElIcon>
        <span>{{ locale["hide-source"] }}</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.example {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);

  .example-showcase {
    padding: 1.5rem;
    margin: 0.5px;
    background-color: var(--el-bg-color);
    border-radius: var(--el-border-radius-base);
    overflow: auto;
  }

  .op-btns {
    background-color: var(--el-bg-color);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .el-icon {
      &:hover {
        color: var(--el-text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--el-text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--el-text-color-lighter);

        &:hover {
          color: var(--el-text-color);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--el-border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--el-bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
