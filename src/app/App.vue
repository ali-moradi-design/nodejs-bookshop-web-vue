<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/features/auth';
import { usePreferencesStore } from '@/features/preferences/model/preferences-store';

const auth = useAuthStore();
const prefs = usePreferencesStore();

onMounted(async () => {
  prefs.bootstrap();
  auth.setHydrated(true);
  if (auth.user) {
    await auth.refreshMe();
  }
});
</script>

<template>
  <RouterView />
</template>
