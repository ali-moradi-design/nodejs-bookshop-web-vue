<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchIssues, updateIssue, type IssueReport, ISSUE_STATUSES, type IssueStatus } from '@/entities/report';
import { PageLoader, UiCard } from '@/shared/ui';
const { t } = useI18n();
const items = ref<IssueReport[]>([]);
const loading = ref(true);
const load = async () => {
  loading.value = true;
  try { items.value = (await fetchIssues()).data; } finally { loading.value = false; }
};
onMounted(load);
const onStatus = async (id: string, e: Event) => {
  await updateIssue(id, { status: (e.target as HTMLSelectElement).value as IssueStatus });
  await load();
};
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('nav.reports') }}</h1>
    <PageLoader v-if="loading" />
    <ul v-else class="space-y-2">
      <li v-for="i in items" :key="i.id">
        <UiCard class="space-y-2 p-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="font-medium">{{ i.subject }}</p>
            <select class="h-8 rounded-md border border-input bg-background px-2 text-xs" :value="i.status" @change="onStatus(i.id, $event)">
              <option v-for="s in ISSUE_STATUSES" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <p class="text-sm text-muted-foreground">{{ i.body }}</p>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
