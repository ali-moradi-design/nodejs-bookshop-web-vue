<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { createIssue, ISSUE_TYPES, type IssueType } from '@/entities/report';
import { UiButton, UiCard, UiInput, UiLabel, UiTextarea } from '@/shared/ui';

const { t } = useI18n();
const form = reactive({
  type: 'other' as IssueType,
  subject: '',
  body: '',
  targetId: '',
});
const msg = ref('');
const loading = ref(false);

const submit = async () => {
  loading.value = true;
  msg.value = '';
  try {
    await createIssue({
      type: form.type,
      subject: form.subject,
      body: form.body,
      targetId: form.targetId || undefined,
    });
    msg.value = t('panel.submitIssue');
    form.subject = '';
    form.body = '';
    form.targetId = '';
  } catch (e) {
    msg.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UiCard class="max-w-lg space-y-4 p-6">
    <h1 class="text-2xl font-bold">{{ t('nav.report') }}</h1>
    <form class="space-y-3" @submit.prevent="submit">
      <div class="space-y-1">
        <UiLabel>{{ t('panel.type') }}</UiLabel>
        <select v-model="form.type" class="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
          <option v-for="ty in ISSUE_TYPES" :key="ty" :value="ty">{{ ty }}</option>
        </select>
      </div>
      <div class="space-y-1">
        <UiLabel>{{ t('panel.subject') }}</UiLabel>
        <UiInput v-model="form.subject" required />
      </div>
      <div class="space-y-1">
        <UiLabel>{{ t('panel.body') }}</UiLabel>
        <UiTextarea v-model="form.body" required />
      </div>
      <UiButton type="submit" :disabled="loading">{{ t('panel.submitIssue') }}</UiButton>
      <p v-if="msg" class="text-sm text-muted-foreground">{{ msg }}</p>
    </form>
  </UiCard>
</template>
