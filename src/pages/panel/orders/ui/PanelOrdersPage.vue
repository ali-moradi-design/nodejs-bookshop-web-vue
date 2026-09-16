<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { fetchOrders, type Order } from '@/entities/order';
import { formatDate, formatMoney } from '@/shared/lib';
import { PageLoader, EmptyState, UiCard, UiBadge } from '@/shared/ui';

const { t, locale } = useI18n();
const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const res = await fetchOrders();
    orders.value = res.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('nav.orders') }}</h1>
    <PageLoader v-if="loading" />
    <EmptyState v-else-if="error" :title="t('common.error')" :description="error" />
    <EmptyState v-else-if="!orders.length" :title="t('common.empty')" />
    <ul v-else class="space-y-3">
      <li v-for="o in orders" :key="o.id">
        <RouterLink :to="`/panel/orders/${o.id}`">
          <UiCard class="flex flex-wrap items-center justify-between gap-3 p-4 transition hover:shadow-md">
            <div>
              <p class="font-medium">#{{ o.id.slice(-8) }}</p>
              <p class="text-sm text-muted-foreground">{{ formatDate(o.createdAt, locale) }}</p>
            </div>
            <div class="flex items-center gap-3">
              <UiBadge>{{ o.status }}</UiBadge>
              <span class="font-medium">{{ formatMoney(o.totalAmount, 'USD', locale) }}</span>
            </div>
          </UiCard>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
