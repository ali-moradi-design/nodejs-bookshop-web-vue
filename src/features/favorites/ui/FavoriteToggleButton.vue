<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Heart } from 'lucide-vue-next';
import { useAuthStore } from '@/features/auth';
import { useRouter } from 'vue-router';
import * as favoriteApi from '@/entities/favorite';
import { UiButton } from '@/shared/ui';

const props = defineProps<{ bookId: string }>();
const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();
const active = ref(false);
const loading = ref(false);

onMounted(async () => {
  if (!auth.user) return;
  try {
    const res = await favoriteApi.fetchFavorites();
    active.value = res.data.some((f) => f.bookId === props.bookId);
  } catch {
    /* ignore */
  }
});

const toggle = async () => {
  if (!auth.user) {
    await router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  loading.value = true;
  try {
    if (active.value) {
      await favoriteApi.removeFavorite(props.bookId);
      active.value = false;
    } else {
      await favoriteApi.addFavorite(props.bookId);
      active.value = true;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UiButton variant="outline" :disabled="loading" @click="toggle">
    <Heart class="h-4 w-4" :class="active ? 'fill-primary text-primary' : ''" />
    {{ active ? t('book.unfavorite') : t('book.favorite') }}
  </UiButton>
</template>
