<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../model/auth-store';
import { PageLoader } from '@/shared/ui';

const props = defineProps<{ requireAdmin?: boolean }>();
const auth = useAuthStore();
const router = useRouter();

const ready = computed(() => auth.hydrated);

watchEffect(() => {
  if (!auth.hydrated) return;
  if (!auth.user) {
    void router.replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  if (props.requireAdmin && !auth.isAdmin) {
    void router.replace('/panel');
  }
});
</script>

<template>
  <PageLoader v-if="!ready || !auth.user || (requireAdmin && !auth.isAdmin)" />
  <slot v-else />
</template>
