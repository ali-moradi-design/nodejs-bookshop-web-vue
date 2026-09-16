<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import type { Book } from '../model/types';
import { formatMoney, resolveImageUrl } from '@/shared/lib';
import { UiBadge, UiCard } from '@/shared/ui';

const props = defineProps<{ book: Book }>();
const { locale } = useI18n();
const cover = computed(() => resolveImageUrl(props.book.coverImageUrl) || '/placeholder-book.svg');
const price = computed(() => formatMoney(props.book.price, props.book.currency || 'USD', locale.value));
</script>

<template>
  <RouterLink :to="`/books/${book.id}`" class="group block h-full">
    <UiCard class="flex h-full flex-col overflow-hidden transition hover:shadow-md">
      <div class="aspect-[3/4] overflow-hidden bg-muted">
        <img
          :src="cover"
          :alt="book.title"
          class="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div class="flex flex-1 flex-col gap-1 p-4">
        <div class="flex items-start justify-between gap-2">
          <h3 class="line-clamp-2 font-semibold leading-snug">{{ book.title }}</h3>
          <UiBadge v-if="book.featured">{{ $t('book.featured') }}</UiBadge>
        </div>
        <p class="text-sm text-muted-foreground">{{ book.author }}</p>
        <p class="mt-auto pt-2 font-medium text-primary">{{ price }}</p>
      </div>
    </UiCard>
  </RouterLink>
</template>
