<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { BOOK_CATEGORIES, BOOK_PRICE_MAX, BOOK_PRICE_MIN } from '@/entities/book';
import { parseBookFilters, filtersToQuery } from '../model/parse-book-filters';
import { UiButton, UiInput, UiLabel } from '@/shared/ui';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const form = reactive({
  q: '',
  category: '',
  minPrice: String(BOOK_PRICE_MIN),
  maxPrice: String(BOOK_PRICE_MAX),
  inStock: false,
  sort: 'createdAt',
  order: 'desc',
});

const syncFromRoute = () => {
  const p = parseBookFilters(route.query as Record<string, unknown>);
  form.q = p.q || '';
  form.category = p.category || '';
  form.minPrice = String(p.minPrice ?? BOOK_PRICE_MIN);
  form.maxPrice = String(p.maxPrice ?? BOOK_PRICE_MAX);
  form.inStock = !!p.inStock;
  form.sort = p.sort || 'createdAt';
  form.order = p.order || 'desc';
};

syncFromRoute();
watch(() => route.query, syncFromRoute);

const apply = () => {
  const params = parseBookFilters({
    ...form,
    page: 1,
  });
  if (form.sort === 'price' && form.order === 'asc') {
    params.sort = 'price';
    params.order = 'asc';
  }
  void router.push({ path: '/catalog', query: filtersToQuery(params) });
};

const reset = () => {
  void router.push({ path: '/catalog' });
};

const onSortChange = (e: Event) => {
  const v = (e.target as HTMLSelectElement).value;
  if (v === 'price-asc') {
    form.sort = 'price';
    form.order = 'asc';
  } else if (v === 'price-desc') {
    form.sort = 'price';
    form.order = 'desc';
  } else if (v === 'title') {
    form.sort = 'title';
    form.order = 'asc';
  } else {
    form.sort = 'createdAt';
    form.order = 'desc';
  }
};

const sortValue = () => {
  if (form.sort === 'price' && form.order === 'asc') return 'price-asc';
  if (form.sort === 'price' && form.order === 'desc') return 'price-desc';
  if (form.sort === 'title') return 'title';
  return 'newest';
};
</script>

<template>
  <form class="space-y-4 rounded-xl border border-border bg-card p-4" @submit.prevent="apply">
    <h2 class="font-semibold">{{ t('catalog.filters') }}</h2>
    <div class="space-y-2">
      <UiLabel for="q">{{ t('catalog.query') }}</UiLabel>
      <UiInput id="q" v-model="form.q" :placeholder="t('catalog.searchPlaceholder')" />
    </div>
    <div class="space-y-2">
      <UiLabel for="category">{{ t('catalog.category') }}</UiLabel>
      <select
        id="category"
        v-model="form.category"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">{{ t('common.all') }}</option>
        <option v-for="c in BOOK_CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="space-y-2">
        <UiLabel for="minPrice">{{ t('catalog.minPrice') }}</UiLabel>
        <UiInput id="minPrice" v-model="form.minPrice" type="number" :min="BOOK_PRICE_MIN" :max="BOOK_PRICE_MAX" />
      </div>
      <div class="space-y-2">
        <UiLabel for="maxPrice">{{ t('catalog.maxPrice') }}</UiLabel>
        <UiInput id="maxPrice" v-model="form.maxPrice" type="number" :min="BOOK_PRICE_MIN" :max="BOOK_PRICE_MAX" />
      </div>
    </div>
    <label class="flex items-center gap-2 text-sm">
      <input v-model="form.inStock" type="checkbox" class="rounded border-input" />
      {{ t('catalog.inStock') }}
    </label>
    <div class="space-y-2">
      <UiLabel for="sort">{{ t('catalog.sort') }}</UiLabel>
      <select
        id="sort"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        :value="sortValue()"
        @change="onSortChange"
      >
        <option value="newest">{{ t('catalog.sortNewest') }}</option>
        <option value="price-asc">{{ t('catalog.sortPriceAsc') }}</option>
        <option value="price-desc">{{ t('catalog.sortPriceDesc') }}</option>
        <option value="title">{{ t('catalog.sortTitleAsc') }}</option>
      </select>
    </div>
    <div class="flex gap-2">
      <UiButton type="submit" class="flex-1">{{ t('catalog.apply') }}</UiButton>
      <UiButton type="button" variant="outline" @click="reset">{{ t('catalog.reset') }}</UiButton>
    </div>
  </form>
</template>
