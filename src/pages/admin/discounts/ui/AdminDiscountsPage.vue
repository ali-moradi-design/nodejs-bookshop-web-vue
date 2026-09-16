<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchDiscounts, createDiscount, deleteDiscount, type Discount } from '@/entities/discount';
import { PageLoader, UiButton, UiCard, UiInput } from '@/shared/ui';
const { t } = useI18n();
const items = ref<Discount[]>([]);
const loading = ref(true);
const form = reactive({ code: '', type: 'percent' as const, value: 10 });
const load = async () => {
  loading.value = true;
  try { items.value = (await fetchDiscounts()).data; } finally { loading.value = false; }
};
onMounted(load);
const create = async () => { await createDiscount(form); form.code = ''; await load(); };
const remove = async (id: string) => { await deleteDiscount(id); await load(); };
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('nav.discounts') }}</h1>
    <UiCard class="flex flex-wrap gap-2 p-4">
      <UiInput v-model="form.code" placeholder="CODE" />
      <UiInput v-model.number="form.value" type="number" />
      <UiButton @click="create">{{ t('common.create') }}</UiButton>
    </UiCard>
    <PageLoader v-if="loading" />
    <ul v-else class="space-y-2">
      <li v-for="d in items" :key="d.id">
        <UiCard class="flex items-center justify-between p-3">
          <span>{{ d.code }} · {{ d.type }} {{ d.value }}</span>
          <UiButton size="sm" variant="destructive" @click="remove(d.id)">{{ t('common.delete') }}</UiButton>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
