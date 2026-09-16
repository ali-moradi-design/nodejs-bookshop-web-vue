<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  fetchBooks, createBook, deleteBook, updateBook, type Book, type CreateBookInput,
} from '@/entities/book';
import { formatMoney } from '@/shared/lib';
import { PageLoader, UiButton, UiCard, UiInput, UiTextarea } from '@/shared/ui';

const { t, locale } = useI18n();
const books = ref<Book[]>([]);
const loading = ref(true);
const form = reactive<CreateBookInput>({
  title: '', author: '', description: '', price: 10, stock: 5, featured: false,
});

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchBooks({ limit: 50, page: 1 });
    books.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const create = async () => {
  await createBook(form);
  form.title = '';
  form.author = '';
  form.description = '';
  await load();
};

const remove = async (id: string) => {
  await deleteBook(id);
  await load();
};

const toggleFeatured = async (b: Book) => {
  await updateBook(b.id, { featured: !b.featured });
  await load();
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">{{ t('admin.manageBooks') }}</h1>
    <UiCard class="space-y-3 p-4">
      <h2 class="font-semibold">{{ t('common.create') }}</h2>
      <form class="grid gap-2 sm:grid-cols-2" @submit.prevent="create">
        <UiInput v-model="form.title" :placeholder="t('catalog.query')" required />
        <UiInput v-model="form.author" :placeholder="t('book.author')" required />
        <UiTextarea v-model="form.description" class="sm:col-span-2" required />
        <UiInput v-model.number="form.price" type="number" step="0.01" min="0" required />
        <UiInput v-model.number="form.stock" type="number" min="0" required />
        <UiButton type="submit" class="sm:col-span-2">{{ t('common.create') }}</UiButton>
      </form>
    </UiCard>
    <PageLoader v-if="loading" />
    <ul v-else class="space-y-2">
      <li v-for="b in books" :key="b.id">
        <UiCard class="flex flex-wrap items-center justify-between gap-3 p-3">
          <div>
            <p class="font-medium">{{ b.title }}</p>
            <p class="text-sm text-muted-foreground">{{ b.author }} · {{ formatMoney(b.price, b.currency || 'USD', locale) }} · stock {{ b.stock }}</p>
          </div>
          <div class="flex gap-2">
            <UiButton size="sm" variant="outline" @click="toggleFeatured(b)">{{ t('book.featured') }}</UiButton>
            <UiButton size="sm" variant="destructive" @click="remove(b.id)">{{ t('common.delete') }}</UiButton>
          </div>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
