<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <footer class="mt-auto border-t border-border bg-muted/30">
    <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>© {{ new Date().getFullYear() }} {{ t('common.appName') }}</p>
      <p>Vue 3 · Vite · FSD · Cookie auth</p>
    </div>
  </footer>
</template>
