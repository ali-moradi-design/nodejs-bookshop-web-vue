import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import fa from './locales/fa.json';

export type AppLocale = 'en' | 'fa';

const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('bookstore-locale')) as
  | AppLocale
  | null;

export const i18n = createI18n({
  legacy: false,
  locale: saved === 'fa' ? 'fa' : 'en',
  fallbackLocale: 'en',
  messages: { en, fa },
});

export const setDocumentLocale = (locale: AppLocale) => {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.classList.toggle('font-persian', locale === 'fa');
  localStorage.setItem('bookstore-locale', locale);
};
