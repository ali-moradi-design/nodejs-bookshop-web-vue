<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth';
import { updateUser } from '@/entities/user';
import { UiButton, UiCard, UiInput, UiLabel } from '@/shared/ui';

const { t } = useI18n();
const auth = useAuthStore();
const name = ref(auth.user?.name || '');
const email = ref(auth.user?.email || '');
const msg = ref('');
const loading = ref(false);

const save = async () => {
  if (!auth.user) return;
  loading.value = true;
  msg.value = '';
  try {
    const res = await updateUser(auth.user.id, { name: name.value, email: email.value });
    auth.setUser(res.data);
    msg.value = t('common.save');
  } catch (e) {
    msg.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UiCard class="max-w-lg space-y-4 p-6">
    <h1 class="text-2xl font-bold">{{ t('nav.profile') }}</h1>
    <form class="space-y-3" @submit.prevent="save">
      <div class="space-y-1">
        <UiLabel>{{ t('auth.name') }}</UiLabel>
        <UiInput v-model="name" required />
      </div>
      <div class="space-y-1">
        <UiLabel>{{ t('auth.email') }}</UiLabel>
        <UiInput v-model="email" type="email" required />
      </div>
      <UiButton type="submit" :disabled="loading">{{ t('common.save') }}</UiButton>
      <p v-if="msg" class="text-sm text-muted-foreground">{{ msg }}</p>
    </form>
  </UiCard>
</template>
