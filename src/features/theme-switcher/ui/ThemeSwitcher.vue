<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { THEMES, type ColorMode, type ThemeName } from '@/shared/config';
import { usePreferencesStore } from '@/features/preferences/model/preferences-store';

const { t, locale } = useI18n();
const prefs = usePreferencesStore();

const onTheme = (e: Event) => prefs.setTheme((e.target as HTMLSelectElement).value as ThemeName);
const onMode = (e: Event) => prefs.setMode((e.target as HTMLSelectElement).value as ColorMode);
</script>

<template>
  <div class="flex items-center gap-2">
    <label class="sr-only" for="theme-select">{{ t('theme.theme') }}</label>
    <select
      id="theme-select"
      class="h-8 rounded-md border border-input bg-background px-2 text-xs"
      :value="prefs.theme"
      @change="onTheme"
    >
      <option v-for="th in THEMES" :key="th.id" :value="th.id">
        {{ locale === 'fa' ? th.labelFa : th.label }}
      </option>
    </select>
    <label class="sr-only" for="mode-select">{{ t('theme.mode') }}</label>
    <select
      id="mode-select"
      class="h-8 rounded-md border border-input bg-background px-2 text-xs"
      :value="prefs.mode"
      @change="onMode"
    >
      <option value="light">{{ t('theme.light') }}</option>
      <option value="dark">{{ t('theme.dark') }}</option>
    </select>
  </div>
</template>
