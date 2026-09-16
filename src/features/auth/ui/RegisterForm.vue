<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../model/auth-store';
import { UiButton, UiInput, UiLabel, UiCard } from '@/shared/ui';

const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const onSubmit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value });
    await router.replace('/panel');
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UiCard class="mx-auto w-full max-w-md space-y-6 p-6">
    <h1 class="text-2xl font-bold">{{ t('auth.registerTitle') }}</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <UiLabel for="name">{{ t('auth.name') }}</UiLabel>
        <UiInput id="name" v-model="name" required autocomplete="name" />
      </div>
      <div class="space-y-2">
        <UiLabel for="email">{{ t('auth.email') }}</UiLabel>
        <UiInput id="email" v-model="email" type="email" required autocomplete="email" />
      </div>
      <div class="space-y-2">
        <UiLabel for="password">{{ t('auth.password') }}</UiLabel>
        <UiInput id="password" v-model="password" type="password" required minlength="6" autocomplete="new-password" />
      </div>
      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
      <UiButton type="submit" class="w-full" :disabled="loading">
        {{ loading ? t('common.loading') : t('nav.register') }}
      </UiButton>
    </form>
    <p class="text-center text-sm text-muted-foreground">
      {{ t('auth.hasAccount') }}
      <RouterLink to="/login" class="font-medium text-primary underline-offset-4 hover:underline">
        {{ t('nav.login') }}
      </RouterLink>
    </p>
  </UiCard>
</template>
