<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchFeaturedBooks, type Book } from '@/entities/book';
import { HomeHero } from '@/widgets/home-hero';
import { BookGrid } from '@/widgets/book-grid';
import { PageLoader, EmptyState } from '@/shared/ui';

const { t } = useI18n();
const books = ref<Book[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const res = await fetchFeaturedBooks();
    books.value = res.data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="space-y-10">
    <HomeHero />
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">{{ t('home.featured') }}</h2>
      <PageLoader v-if="loading" />
      <EmptyState v-else-if="error" :title="t('common.error')" :description="error" />
      <EmptyState v-else-if="!books.length" :title="t('common.empty')" />
      <BookGrid v-else :books="books" />
    </section>
  </div>
</template>
