<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth';
import { useCartStore } from '@/features/cart';
import { checkoutCart } from '@/entities/cart';
import { EmptyState, UiButton, UiCard, UiInput, UiLabel } from '@/shared/ui';

const { t } = useI18n();
const auth = useAuthStore();
const cart = useCartStore();
const router = useRouter();
const error = ref('');
const loading = ref(false);

const form = reactive({
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  discountCode: '',
});

onMounted(() => {
  if (auth.user) {
    form.fullName = auth.user.name;
    void cart.load();
  }
});

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    const res = await checkoutCart({
      shippingAddress: {
        fullName: form.fullName,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state || undefined,
        postalCode: form.postalCode,
        country: form.country,
      },
      discountCode: form.discountCode || undefined,
    });
    await cart.load();
    await router.push(`/panel/orders/${res.data.id}`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('common.error');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6">
    <h1 class="text-3xl font-bold">{{ t('checkout.title') }}</h1>
    <EmptyState v-if="!auth.user" :title="t('cart.loginHint')">
      <RouterLink to="/login"><UiButton>{{ t('nav.login') }}</UiButton></RouterLink>
    </EmptyState>
    <EmptyState v-else-if="!cart.cart?.items.length" :title="t('cart.empty')">
      <RouterLink to="/catalog"><UiButton>{{ t('home.browseAll') }}</UiButton></RouterLink>
    </EmptyState>
    <UiCard v-else class="space-y-4 p-6">
      <h2 class="font-semibold">{{ t('checkout.shipping') }}</h2>
      <form class="grid gap-3 sm:grid-cols-2" @submit.prevent="submit">
        <div class="space-y-1 sm:col-span-2">
          <UiLabel>{{ t('checkout.fullName') }}</UiLabel>
          <UiInput v-model="form.fullName" required />
        </div>
        <div class="space-y-1 sm:col-span-2">
          <UiLabel>{{ t('checkout.line1') }}</UiLabel>
          <UiInput v-model="form.line1" required />
        </div>
        <div class="space-y-1 sm:col-span-2">
          <UiLabel>{{ t('checkout.line2') }}</UiLabel>
          <UiInput v-model="form.line2" />
        </div>
        <div class="space-y-1">
          <UiLabel>{{ t('checkout.city') }}</UiLabel>
          <UiInput v-model="form.city" required />
        </div>
        <div class="space-y-1">
          <UiLabel>{{ t('checkout.state') }}</UiLabel>
          <UiInput v-model="form.state" />
        </div>
        <div class="space-y-1">
          <UiLabel>{{ t('checkout.postalCode') }}</UiLabel>
          <UiInput v-model="form.postalCode" required />
        </div>
        <div class="space-y-1">
          <UiLabel>{{ t('checkout.country') }}</UiLabel>
          <UiInput v-model="form.country" required />
        </div>
        <div class="space-y-1 sm:col-span-2">
          <UiLabel>{{ t('checkout.discount') }}</UiLabel>
          <UiInput v-model="form.discountCode" />
        </div>
        <p v-if="error" class="sm:col-span-2 text-sm text-destructive">{{ error }}</p>
        <UiButton type="submit" class="sm:col-span-2" :disabled="loading">
          {{ loading ? t('common.loading') : t('checkout.placeOrder') }}
        </UiButton>
      </form>
    </UiCard>
  </div>
</template>
