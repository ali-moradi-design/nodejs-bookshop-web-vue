import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { App, router } from '@/app';
import { i18n, setDocumentLocale } from '@/shared/i18n';
import '@/app/styles/globals.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);

const locale = (localStorage.getItem('bookstore-locale') as 'en' | 'fa') || 'en';
setDocumentLocale(locale);

app.mount('#app');
