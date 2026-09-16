<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchDashboardSummary, fetchRecentOrders, fetchLowStock, type DashboardSummary } from '@/entities/admin';
import type { Order } from '@/entities/order';
import type { Book } from '@/entities/book';
import { formatMoney } from '@/shared/lib';
import { PageLoader, UiCard } from '@/shared/ui';

const { t, locale } = useI18n();
const summary = ref<DashboardSummary | null>(null);
const recent = ref<Order[]>([]);
const low = ref<Book[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [s, r, l] = await Promise.all([
      fetchDashboardSummary(),
      fetchRecentOrders(8),
      fetchLowStock(5),
    ]);
    summary.value = s.data;
    recent.value = r.data;
    low.value = l.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ t('admin.summary') }}</h1>
    <PageLoader v-if="loading" />
    <template v-else-if="summary">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UiCard class="p-4"><p class="text-sm text-muted-foreground">{{ t('nav.users') }}</p><p class="text-2xl font-bold">{{ summary.users }}</p></UiCard>
        <UiCard class="p-4"><p class="text-sm text-muted-foreground">{{ t('nav.books') }}</p><p class="text-2xl font-bold">{{ summary.books }}</p></UiCard>
        <UiCard class="p-4"><p class="text-sm text-muted-foreground">{{ t('nav.orders') }}</p><p class="text-2xl font-bold">{{ summary.orders }}</p></UiCard>
        <UiCard class="p-4"><p class="text-sm text-muted-foreground">{{ t('admin.revenue') }}</p><p class="text-2xl font-bold">{{ formatMoney(summary.revenue, 'USD', locale) }}</p></UiCard>
        <UiCard class="p-4"><p class="text-sm text-muted-foreground">{{ t('admin.openIssues') }}</p><p class="text-2xl font-bold">{{ summary.openIssueReports }}</p></UiCard>
        <UiCard class="p-4"><p class="text-sm text-muted-foreground">{{ t('admin.lowStock') }}</p><p class="text-2xl font-bold">{{ summary.lowStock }}</p></UiCard>
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <UiCard class="p-4">
          <h2 class="mb-3 font-semibold">{{ t('admin.recentOrders') }}</h2>
          <ul class="space-y-2 text-sm">
            <li v-for="o in recent" :key="o.id" class="flex justify-between gap-2">
              <span>#{{ o.id.slice(-8) }}</span>
              <span>{{ o.status }}</span>
            </li>
          </ul>
        </UiCard>
        <UiCard class="p-4">
          <h2 class="mb-3 font-semibold">{{ t('admin.lowStock') }}</h2>
          <ul class="space-y-2 text-sm">
            <li v-for="b in low" :key="b.id" class="flex justify-between gap-2">
              <span>{{ b.title }}</span>
              <span>{{ b.stock }}</span>
            </li>
          </ul>
        </UiCard>
      </div>
    </template>
  </div>
</template>
