<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { usePreferencesStore } from '@/features/preferences/model/preferences-store';
import type { AppLocale } from '@/shared/i18n';

const { t } = useI18n();
const prefs = usePreferencesStore();

const onChange = (e: Event) => {
  prefs.setLocale((e.target as HTMLSelectElement).value as AppLocale);
};
</script>

<template>
  <label class="sr-only" for="locale-select">{{ t('theme.language') }}</label>
  <select
    id="locale-select"
    class="h-8 rounded-md border border-input bg-background px-2 text-xs"
    :value="prefs.locale"
    @change="onChange"
  >
    <option value="en">EN</option>
    <option value="fa">FA</option>
  </select>
</template>
