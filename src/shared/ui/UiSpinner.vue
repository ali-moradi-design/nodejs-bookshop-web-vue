<script setup lang="ts">
import { cn } from '@/shared/lib';
defineProps<{ class?: string }>();
</script>

<template>
  <div
    :class="cn('h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-primary', $props.class)"
    role="status"
    aria-label="Loading"
  />
</template>
