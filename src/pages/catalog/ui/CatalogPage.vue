<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { fetchBooks, type Book } from '@/entities/book';
import type { PaginationMeta } from '@/shared/api';
import { BookFilters, parseBookFilters, filtersToQuery } from '@/features/book-filters';
import { BookGrid } from '@/widgets/book-grid';
import { PageLoader, EmptyState, UiButton } from '@/shared/ui';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const books = ref<Book[]>([]);
const meta = ref<PaginationMeta | null>(null);
const loading = ref(true);
const error = ref('');

const params = computed(() => parseBookFilters(route.query as Record<string, unknown>));

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetchBooks(params.value);
    books.value = res.data;
    meta.value = res.meta;
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};

watch(() => route.query, load, { immediate: true });

const goPage = (page: number) => {
  void router.push({
    path: '/catalog',
    query: filtersToQuery({ ...params.value, page }),
  });
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold">{{ t('catalog.title') }}</h1>
    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <BookFilters />
      <div class="space-y-4">
        <PageLoader v-if="loading" />
        <EmptyState v-else-if="error" :title="t('common.error')" :description="error" />
        <EmptyState v-else-if="!books.length" :title="t('catalog.noResults')" />
        <template v-else>
          <BookGrid :books="books" />
          <div v-if="meta && meta.pages > 1" class="flex items-center justify-center gap-3 pt-4">
            <UiButton variant="outline" size="sm" :disabled="meta.page <= 1" @click="goPage(meta.page - 1)">
              {{ t('common.previous') }}
            </UiButton>
            <span class="text-sm text-muted-foreground">
              {{ t('common.page') }} {{ meta.page }} {{ t('common.of') }} {{ meta.pages }}
            </span>
            <UiButton variant="outline" size="sm" :disabled="meta.page >= meta.pages" @click="goPage(meta.page + 1)">
              {{ t('common.next') }}
            </UiButton>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
