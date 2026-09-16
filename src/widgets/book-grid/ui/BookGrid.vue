<script setup lang="ts">
import type { Book } from '@/entities/book';
import { BookCard } from '@/entities/book';

defineProps<{ books: Book[] }>();
</script>

<template>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    <BookCard v-for="book in books" :key="book.id" :book="book" />
  </div>
</template>
