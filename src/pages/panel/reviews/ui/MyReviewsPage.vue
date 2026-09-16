<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth';
import { fetchReviews, deleteReview, type Review } from '@/entities/review';
import { PageLoader, EmptyState, UiButton, UiCard } from '@/shared/ui';

const { t } = useI18n();
const auth = useAuthStore();
const reviews = ref<Review[]>([]);
const loading = ref(true);

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchReviews({ user: auth.user?.id, limit: 100 });
    reviews.value = Array.isArray((res as { data: Review[] }).data)
      ? (res as { data: Review[] }).data
      : [];
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const remove = async (id: string) => {
  await deleteReview(id);
  await load();
};
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('nav.reviews') }}</h1>
    <PageLoader v-if="loading" />
    <EmptyState v-else-if="!reviews.length" :title="t('common.empty')" />
    <ul v-else class="space-y-3">
      <li v-for="r in reviews" :key="r.id">
        <UiCard class="flex items-start justify-between gap-3 p-4">
          <div>
            <p class="font-medium">★ {{ r.rating }}/5 · {{ r.populated?.book?.title || r.book }}</p>
            <p v-if="r.comment" class="text-sm text-muted-foreground">{{ r.comment }}</p>
          </div>
          <UiButton size="sm" variant="destructive" @click="remove(r.id)">{{ t('common.delete') }}</UiButton>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
