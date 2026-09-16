import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  type ColorMode,
  type ThemeName,
} from '@/shared/config';
import { setDocumentLocale, type AppLocale } from '@/shared/i18n';
import { i18n } from '@/shared/i18n';

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const theme = ref<ThemeName>(DEFAULT_THEME);
    const mode = ref<ColorMode>(DEFAULT_MODE);
    const locale = ref<AppLocale>('en');

    const applyTheme = () => {
      const root = document.documentElement;
      root.dataset.theme = theme.value;
      root.classList.toggle('dark', mode.value === 'dark');
    };

    const applyLocale = () => {
      i18n.global.locale.value = locale.value;
      setDocumentLocale(locale.value);
    };

    const setTheme = (t: ThemeName) => {
      theme.value = t;
      applyTheme();
    };

    const setMode = (m: ColorMode) => {
      mode.value = m;
      applyTheme();
    };

    const setLocale = (l: AppLocale) => {
      locale.value = l;
      applyLocale();
    };

    const bootstrap = () => {
      applyTheme();
      applyLocale();
    };

    watch([theme, mode], applyTheme);

    return { theme, mode, locale, setTheme, setMode, setLocale, bootstrap };
  },
  {
    persist: {
      key: 'bookstore-prefs',
      pick: ['theme', 'mode', 'locale'],
    },
  },
);
