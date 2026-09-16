<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { ShoppingCart } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '../model/cart-store';
import { useAuthStore } from '@/features/auth';

const { t } = useI18n();
const cart = useCartStore();
const auth = useAuthStore();

onMounted(() => {
  if (auth.user) void cart.load();
});

watch(
  () => auth.user,
  (u) => {
    if (u) void cart.load();
    else cart.cart = null;
  },
);
</script>

<template>
  <RouterLink
    to="/cart"
    class="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
    :aria-label="t('nav.cartWithCount', { count: cart.itemCount })"
  >
    <ShoppingCart class="h-5 w-5" />
    <span
      v-if="cart.itemCount > 0"
      class="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
    >
      {{ cart.itemCount }}
    </span>
  </RouterLink>
</template>
