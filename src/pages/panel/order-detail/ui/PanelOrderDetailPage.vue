<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { fetchOrder, payOrder, type Order } from '@/entities/order';
import { formatDate, formatMoney } from '@/shared/lib';
import { PageLoader, EmptyState, UiButton, UiCard, UiBadge } from '@/shared/ui';

const route = useRoute();
const { t, locale } = useI18n();
const order = ref<Order | null>(null);
const loading = ref(true);
const error = ref('');
const paying = ref(false);
const id = computed(() => String(route.params.id));

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchOrder(id.value);
    order.value = res.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};

onMounted(load);
watch(id, load);

const onPay = async () => {
  if (!order.value) return;
  paying.value = true;
  try {
    const res = await payOrder(order.value.id);
    order.value = res.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    paying.value = false;
  }
};
</script>

<template>
  <PageLoader v-if="loading" />
  <EmptyState v-else-if="error || !order" :title="t('common.error')" :description="error" />
  <div v-else class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold">{{ t('panel.orderDetail') }} #{{ order.id.slice(-8) }}</h1>
      <UiBadge>{{ order.status }}</UiBadge>
    </div>
    <UiCard class="space-y-3 p-4">
      <p class="text-sm text-muted-foreground">{{ formatDate(order.createdAt, locale) }}</p>
      <ul class="divide-y divide-border">
        <li v-for="(item, idx) in order.items" :key="idx" class="flex justify-between py-2 text-sm">
          <span>{{ item.title }} × {{ item.quantity }}</span>
          <span>{{ formatMoney(item.price * item.quantity, 'USD', locale) }}</span>
        </li>
      </ul>
      <div class="flex justify-between border-t border-border pt-3 font-semibold">
        <span>{{ t('cart.subtotal') }}</span>
        <span>{{ formatMoney(order.totalAmount, 'USD', locale) }}</span>
      </div>
      <UiButton
        v-if="order.status === 'pending_payment'"
        :disabled="paying"
        @click="onPay"
      >
        {{ paying ? t('common.loading') : t('panel.pay') }}
      </UiButton>
      <p v-if="order.payment.status === 'paid'" class="text-sm text-primary">{{ t('panel.paymentSuccess') }}</p>
    </UiCard>
  </div>
</template>
