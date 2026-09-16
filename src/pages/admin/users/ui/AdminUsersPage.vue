<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchUsers, deleteUser, updateUser, type User, getRoleNames } from '@/entities/user';
import { PageLoader, UiButton, UiCard, UiBadge } from '@/shared/ui';

const { t } = useI18n();
const users = ref<User[]>([]);
const loading = ref(true);

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchUsers();
    users.value = res.data;
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const toggleActive = async (u: User) => {
  await updateUser(u.id, { isActive: !u.isActive });
  await load();
};

const remove = async (id: string) => {
  await deleteUser(id);
  await load();
};
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ t('admin.manageUsers') }}</h1>
    <PageLoader v-if="loading" />
    <ul v-else class="space-y-2">
      <li v-for="u in users" :key="u.id">
        <UiCard class="flex flex-wrap items-center justify-between gap-3 p-3">
          <div>
            <p class="font-medium">{{ u.name }}</p>
            <p class="text-sm text-muted-foreground">{{ u.email }}</p>
            <div class="mt-1 flex flex-wrap gap-1">
              <UiBadge v-for="r in getRoleNames(u)" :key="r">{{ r }}</UiBadge>
            </div>
          </div>
          <div class="flex gap-2">
            <UiButton size="sm" variant="outline" @click="toggleActive(u)">
              {{ u.isActive ? 'Active' : 'Inactive' }}
            </UiButton>
            <UiButton size="sm" variant="destructive" @click="remove(u.id)">{{ t('common.delete') }}</UiButton>
          </div>
        </UiCard>
      </li>
    </ul>
  </div>
</template>
