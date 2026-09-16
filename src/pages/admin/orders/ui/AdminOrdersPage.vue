<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchOrders, updateOrderStatus, ORDER_STATUSES, type Order, type OrderStatus } from '@/entities/order';
import { formatMoney } from '@/shared/lib';
import { PageLoader, UiCard } from '@/shared/ui';

const { t, locale } = useI18n();
const orders = ref<Order[]>([]);
const loading = ref(true);

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchOrders();
    orders.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const onStatus = async (id: string, e: Event) => {
  const status = (e.target as HTMLSelectElement).value as OrderStatus;
  await updateOrderStatus(id, status);
  await load();
};
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('admin.manageOrders') }}</h1>
    <PageLoader v-if="loading" />
    <ul v-else class="space-y-2">
      <li v-for="o in orders" :key="o.id">
        <UiCard class="flex flex-wrap items-center justify-between gap-3 p-3">
          <div>
            <p class="font-medium">#{{ o.id.slice(-8) }}</p>
            <p class="text-sm text-muted-foreground">{{ formatMoney(o.totalAmount, 'USD', locale) }}</p>
          </div>
          <select
            class="h-9 rounded-md border border-input bg-background px-2 text-sm"
            :value="o.status"
            @change="onStatus(o.id, $event)"
          >
            <option v-for="s in ORDER_STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
