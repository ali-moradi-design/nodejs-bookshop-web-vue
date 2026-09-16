<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchRevenue, fetchOrdersByStatus, fetchTopBooks } from '@/entities/report';
import { formatMoney } from '@/shared/lib';
import { PageLoader, UiCard } from '@/shared/ui';
const { t, locale } = useI18n();
const revenue = ref<{ totalRevenue?: number; orderCount?: number } | null>(null);
const byStatus = ref<{ status: string; count: number }[]>([]);
const top = ref<{ title?: string; quantity?: number; revenue?: number }[]>([]);
const loading = ref(true);
onMounted(async () => {
  try {
    const [r, s, tb] = await Promise.all([fetchRevenue(), fetchOrdersByStatus(), fetchTopBooks()]);
    revenue.value = r.data;
    byStatus.value = s.data;
    top.value = tb.data;
  } finally { loading.value = false; }
});
</script>
<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ t('nav.analytics') }}</h1>
    <PageLoader v-if="loading" />
    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2">
        <UiCard class="p-4">
          <p class="text-sm text-muted-foreground">{{ t('admin.revenue') }}</p>
          <p class="text-2xl font-bold">{{ formatMoney(revenue?.totalRevenue || 0, 'USD', locale) }}</p>
          <p class="text-sm text-muted-foreground">Orders: {{ revenue?.orderCount ?? '—' }}</p>
        </UiCard>
        <UiCard class="p-4">
          <h2 class="mb-2 font-semibold">Orders by status</h2>
          <ul class="space-y-1 text-sm">
            <li v-for="s in byStatus" :key="s.status" class="flex justify-between"><span>{{ s.status }}</span><span>{{ s.count }}</span></li>
          </ul>
        </UiCard>
      </div>
      <UiCard class="p-4">
        <h2 class="mb-2 font-semibold">Top books</h2>
        <ul class="space-y-1 text-sm">
          <li v-for="(b, i) in top" :key="i" class="flex justify-between gap-2">
            <span>{{ b.title || '—' }}</span>
            <span>{{ b.quantity ?? 0 }} · {{ formatMoney(b.revenue || 0, 'USD', locale) }}</span>
          </li>
        </ul>
      </UiCard>
    </template>
  </div>
</template>
