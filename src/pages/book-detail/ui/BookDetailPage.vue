<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { fetchBook, type Book } from '@/entities/book';
import { fetchReviews, createReview, type Review } from '@/entities/review';
import { AddToCartButton } from '@/features/cart';
import { FavoriteToggleButton } from '@/features/favorites';
import { formatMoney, resolveImageUrl } from '@/shared/lib';
import { PageLoader, EmptyState, UiBadge, UiButton, UiInput, UiLabel, UiTextarea } from '@/shared/ui';
import { useAuthStore } from '@/features/auth';

const route = useRoute();
const { t, locale } = useI18n();
const auth = useAuthStore();
const book = ref<Book | null>(null);
const reviews = ref<Review[]>([]);
const loading = ref(true);
const error = ref('');
const rating = ref(5);
const comment = ref('');
const reviewMsg = ref('');

const id = computed(() => String(route.params.id));

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const [b, r] = await Promise.all([
      fetchBook(id.value),
      fetchReviews({ book: id.value, limit: 50 }),
    ]);
    book.value = b.data;
    reviews.value = Array.isArray((r as { data: Review[] }).data)
      ? (r as { data: Review[] }).data
      : [];
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};

onMounted(load);
watch(id, load);

const cover = computed(() => resolveImageUrl(book.value?.coverImageUrl) || '/placeholder-book.svg');

const submitReview = async () => {
  if (!auth.user || !book.value) return;
  try {
    await createReview({ book: book.value.id, rating: rating.value, comment: comment.value || undefined });
    reviewMsg.value = t('book.reviewUpdated');
    comment.value = '';
    await load();
  } catch (e) {
    reviewMsg.value = e instanceof Error ? e.message : t('common.error');
  }
};
</script>

<template>
  <PageLoader v-if="loading" />
  <EmptyState v-else-if="error || !book" :title="t('common.error')" :description="error || t('common.empty')" />
  <div v-else class="grid gap-8 lg:grid-cols-[320px_1fr]">
    <div class="overflow-hidden rounded-xl border border-border bg-muted">
      <img :src="cover" :alt="book.title" class="aspect-[3/4] w-full object-cover" />
    </div>
    <div class="space-y-6">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-3xl font-bold">{{ book.title }}</h1>
          <UiBadge v-if="book.featured">{{ t('book.featured') }}</UiBadge>
        </div>
        <p class="text-lg text-muted-foreground">{{ book.author }}</p>
        <p class="text-2xl font-semibold text-primary">
          {{ formatMoney(book.price, book.currency || 'USD', locale) }}
        </p>
        <p class="text-sm text-muted-foreground">{{ t('book.stock') }}: {{ book.stock }}</p>
      </div>
      <p class="whitespace-pre-wrap leading-relaxed text-foreground/90">{{ book.description }}</p>
      <div class="flex flex-wrap gap-3">
        <AddToCartButton :book-id="book.id" :disabled="book.stock <= 0" />
        <FavoriteToggleButton :book-id="book.id" />
      </div>
      <section class="space-y-4 border-t border-border pt-6">
        <h2 class="text-xl font-semibold">{{ t('book.reviews') }}</h2>
        <form v-if="auth.user" class="space-y-3 rounded-lg border border-border p-4" @submit.prevent="submitReview">
          <h3 class="font-medium">{{ t('book.writeReview') }}</h3>
          <div class="space-y-2">
            <UiLabel>{{ t('book.yourRating') }}</UiLabel>
            <UiInput v-model.number="rating" type="number" min="1" max="5" />
          </div>
          <UiTextarea v-model="comment" :placeholder="t('book.writeReview')" />
          <UiButton type="submit">{{ t('common.save') }}</UiButton>
          <p v-if="reviewMsg" class="text-sm text-muted-foreground">{{ reviewMsg }}</p>
        </form>
        <ul v-if="reviews.length" class="space-y-3">
          <li v-for="r in reviews" :key="r.id" class="rounded-lg border border-border p-3">
            <p class="font-medium">★ {{ r.rating }}/5 · {{ r.populated?.user?.name || 'User' }}</p>
            <p v-if="r.comment" class="mt-1 text-sm text-muted-foreground">{{ r.comment }}</p>
          </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">{{ t('common.empty') }}</p>
      </section>
    </div>
  </div>
</template>
