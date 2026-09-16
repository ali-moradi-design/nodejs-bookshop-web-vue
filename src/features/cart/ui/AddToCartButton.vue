<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '../model/cart-store';
import { useAuthStore } from '@/features/auth';
import { useRouter } from 'vue-router';
import { UiButton } from '@/shared/ui';

const props = defineProps<{ bookId: string; disabled?: boolean }>();
const { t } = useI18n();
const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const message = ref('');

const onClick = async () => {
  if (!auth.user) {
    await router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  loading.value = true;
  message.value = '';
  try {
    await cart.addItem(props.bookId, 1);
    message.value = t('toast.addedToCart');
  } catch (e) {
    message.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <UiButton :disabled="disabled || loading" @click="onClick">
      {{ disabled ? t('book.outOfStock') : loading ? t('common.loading') : t('book.addToCart') }}
    </UiButton>
    <p v-if="message" class="text-xs text-muted-foreground">{{ message }}</p>
  </div>
</template>
