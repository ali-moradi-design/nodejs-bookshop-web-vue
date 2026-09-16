<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth';
import { useCartStore } from '@/features/cart';
import { fetchBook, type Book } from '@/entities/book';
import { formatMoney, resolveImageUrl } from '@/shared/lib';
import { PageLoader, EmptyState, UiButton, UiCard } from '@/shared/ui';

const { t, locale } = useI18n();
const auth = useAuthStore();
const cart = useCartStore();
const bookMap = ref<Record<string, Book>>({});
const loadingBooks = ref(false);

const loadBooks = async () => {
  if (!cart.cart?.items.length) {
    bookMap.value = {};
    return;
  }
  loadingBooks.value = true;
  try {
    const entries = await Promise.all(
      cart.cart.items.map(async (i) => {
        try {
          const res = await fetchBook(i.bookId);
          return [i.bookId, res.data] as const;
        } catch {
          return null;
        }
      }),
    );
    const map: Record<string, Book> = {};
    entries.forEach((e) => {
      if (e) map[e[0]] = e[1];
    });
    bookMap.value = map;
  } finally {
    loadingBooks.value = false;
  }
};

onMounted(async () => {
  if (auth.user) {
    await cart.load();
    await loadBooks();
  }
});

watch(() => cart.cart?.items, loadBooks, { deep: true });


const linePrice = (bookId: string) => {
  const b = bookMap.value[bookId];
  if (!b) return '—';
  return formatMoney(b.price, b.currency || 'USD', locale.value);
};

const subtotal = computed(() =>
  (cart.cart?.items || []).reduce((sum, i) => {
    const b = bookMap.value[i.bookId];
    return sum + (b ? b.price * i.quantity : 0);
  }, 0),
);
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">{{ t('cart.title') }}</h1>
    <EmptyState v-if="!auth.user" :title="t('cart.loginHint')">
      <RouterLink to="/login"><UiButton>{{ t('nav.login') }}</UiButton></RouterLink>
    </EmptyState>
    <PageLoader v-else-if="cart.loading || loadingBooks" />
    <EmptyState
      v-else-if="!cart.cart?.items.length"
      :title="t('cart.empty')"
      :description="t('cart.emptyHint')"
    >
      <RouterLink to="/catalog"><UiButton>{{ t('home.browseAll') }}</UiButton></RouterLink>
    </EmptyState>
    <div v-else class="grid gap-6 lg:grid-cols-[1fr_280px]">
      <ul class="space-y-3">
        <li v-for="item in cart.cart.items" :key="item.bookId">
          <UiCard class="flex gap-4 p-4">
            <img
              :src="resolveImageUrl(bookMap[item.bookId]?.coverImageUrl) || '/placeholder-book.svg'"
              alt=""
              class="h-24 w-16 rounded object-cover"
            />
            <div class="min-w-0 flex-1 space-y-2">
              <RouterLink :to="`/books/${item.bookId}`" class="font-medium hover:underline">
                {{ bookMap[item.bookId]?.title || item.bookId }}
              </RouterLink>
              <p class="text-sm text-muted-foreground">
                {{ linePrice(item.bookId) }}
              </p>
              <div class="flex items-center gap-2">
                <UiButton
                  size="sm"
                  variant="outline"
                  :disabled="item.quantity <= 1"
                  @click="cart.updateItem(item.bookId, item.quantity - 1)"
                >
                  −
                </UiButton>
                <span class="w-8 text-center text-sm">{{ item.quantity }}</span>
                <UiButton size="sm" variant="outline" @click="cart.updateItem(item.bookId, item.quantity + 1)">
                  +
                </UiButton>
                <UiButton size="sm" variant="ghost" @click="cart.removeItem(item.bookId)">
                  {{ t('cart.remove') }}
                </UiButton>
              </div>
            </div>
          </UiCard>
        </li>
      </ul>
      <UiCard class="h-fit space-y-4 p-4">
        <div class="flex justify-between font-medium">
          <span>{{ t('cart.subtotal') }}</span>
          <span>{{ formatMoney(subtotal, 'USD', locale) }}</span>
        </div>
        <UiButton variant="outline" class="w-full" @click="cart.clear()">{{ t('cart.clear') }}</UiButton>
        <RouterLink to="/checkout" class="block">
          <UiButton class="w-full">{{ t('cart.checkout') }}</UiButton>
        </RouterLink>
      </UiCard>
    </div>
  </div>
</template>
