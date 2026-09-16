<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth';
import { fetchOrders } from '@/entities/order';
import { fetchFavorites } from '@/entities/favorite';
import { fetchReviews } from '@/entities/review';
import { UiCard } from '@/shared/ui';

const { t } = useI18n();
const auth = useAuthStore();
const orders = ref(0);
const favorites = ref(0);
const reviews = ref(0);

onMounted(async () => {
  try {
    const [o, f, r] = await Promise.all([
      fetchOrders(),
      fetchFavorites(),
      fetchReviews({ user: auth.user?.id, limit: 100 }),
    ]);
    orders.value = o.data.length;
    favorites.value = f.data.length;
    const rd = (r as { data: unknown[] }).data;
    reviews.value = Array.isArray(rd) ? rd.length : 0;
  } catch {
    /* ignore */
  }
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ t('panel.welcome') }}, {{ auth.user?.name }}</h1>
    <div class="grid gap-4 sm:grid-cols-3">
      <RouterLink to="/panel/orders">
        <UiCard class="p-4 transition hover:shadow-md">
          <p class="text-sm text-muted-foreground">{{ t('panel.ordersCount') }}</p>
          <p class="text-3xl font-bold">{{ orders }}</p>
        </UiCard>
      </RouterLink>
      <RouterLink to="/panel/favorites">
        <UiCard class="p-4 transition hover:shadow-md">
          <p class="text-sm text-muted-foreground">{{ t('panel.favoritesCount') }}</p>
          <p class="text-3xl font-bold">{{ favorites }}</p>
        </UiCard>
      </RouterLink>
      <RouterLink to="/panel/reviews">
        <UiCard class="p-4 transition hover:shadow-md">
          <p class="text-sm text-muted-foreground">{{ t('panel.reviewsCount') }}</p>
          <p class="text-3xl font-bold">{{ reviews }}</p>
        </UiCard>
      </RouterLink>
    </div>
  </div>
</template>
