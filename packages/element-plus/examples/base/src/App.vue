<template>
  <header class="nav">
    <nav>
      <RouterLink to="/form">Form</RouterLink>
      <RouterLink to="/provider">Provider</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<script lang="ts" setup></script>

<style lang="css" scoped>
.nav {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}

nav a {
  margin: 0 12px;
  text-decoration: none;
  color: var(--el-text-color-regular);
}

nav a.router-link-active {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
