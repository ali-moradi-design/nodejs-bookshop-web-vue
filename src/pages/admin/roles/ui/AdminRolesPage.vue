<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchRoles, type Role } from '@/entities/role';
import { PageLoader, UiCard } from '@/shared/ui';
const { t } = useI18n();
const items = ref<Role[]>([]);
const loading = ref(true);
onMounted(async () => {
  try { items.value = (await fetchRoles()).data; } finally { loading.value = false; }
});
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('nav.roles') }}</h1>
    <PageLoader v-if="loading" />
    <ul v-else class="space-y-2">
      <li v-for="r in items" :key="r.id"><UiCard class="p-3"><p class="font-medium">{{ r.name }}</p><p class="text-sm text-muted-foreground">{{ r.description }}</p></UiCard></li>
    </ul>
  </div>
</template>
