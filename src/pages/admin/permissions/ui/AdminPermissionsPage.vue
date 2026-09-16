<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchPermissions, type Permission } from '@/entities/permission';
import { PageLoader, UiCard, UiBadge } from '@/shared/ui';
const { t } = useI18n();
const items = ref<Permission[]>([]);
const loading = ref(true);
onMounted(async () => {
  try { items.value = (await fetchPermissions()).data; } finally { loading.value = false; }
});
</script>
<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('nav.permissions') }}</h1>
    <PageLoader v-if="loading" />
    <ul v-else class="space-y-2">
      <li v-for="p in items" :key="p.id">
        <UiCard class="flex items-center justify-between gap-2 p-3">
          <div><p class="font-medium">{{ p.name }}</p><p class="text-sm text-muted-foreground">{{ p.slug }}</p></div>
          <UiBadge>{{ p.section }}</UiBadge>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
