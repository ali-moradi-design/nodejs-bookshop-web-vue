<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '../model/auth-store';
import { UiButton, UiInput, UiLabel, UiCard } from '@/shared/ui';

const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const onSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/';
    await router.replace(redirect);
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UiCard class="mx-auto w-full max-w-md space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold">{{ t('auth.loginTitle') }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('auth.adminHint') }}</p>
    </div>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <UiLabel for="email">{{ t('auth.email') }}</UiLabel>
        <UiInput id="email" v-model="email" type="email" required autocomplete="email" />
      </div>
      <div class="space-y-2">
        <UiLabel for="password">{{ t('auth.password') }}</UiLabel>
        <UiInput id="password" v-model="password" type="password" required autocomplete="current-password" />
      </div>
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <UiButton type="submit" class="w-full" :disabled="loading">
        {{ loading ? t('common.loading') : t('nav.login') }}
      </UiButton>
    </form>
    <p class="text-center text-sm text-muted-foreground">
      {{ t('auth.noAccount') }}
      <RouterLink to="/register" class="font-medium text-primary underline-offset-4 hover:underline">
        {{ t('nav.register') }}
      </RouterLink>
    </p>
  </UiCard>
</template>
