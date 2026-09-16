<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { fetchFavorites, removeFavorite, type Favorite } from '@/entities/favorite';
import { PageLoader, EmptyState, UiButton, UiCard } from '@/shared/ui';

const { t } = useI18n();
const items = ref<Favorite[]>([]);
const loading = ref(true);

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchFavorites();
    items.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const remove = async (bookId: string) => {
  await removeFavorite(bookId);
  await load();
};
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('nav.favorites') }}</h1>
    <PageLoader v-if="loading" />
    <EmptyState v-else-if="!items.length" :title="t('common.empty')" :description="t('favorites.emptyHint')">
      <RouterLink to="/catalog"><UiButton>{{ t('favorites.browseCatalog') }}</UiButton></RouterLink>
    </EmptyState>
    <ul v-else class="space-y-3">
      <li v-for="f in items" :key="f.id">
        <UiCard class="flex items-center justify-between gap-3 p-4">
          <RouterLink :to="`/books/${f.bookId}`" class="font-medium hover:underline">
            {{ f.populated?.book?.title || f.bookId }}
          </RouterLink>
          <UiButton size="sm" variant="outline" @click="remove(f.bookId)">{{ t('cart.remove') }}</UiButton>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
