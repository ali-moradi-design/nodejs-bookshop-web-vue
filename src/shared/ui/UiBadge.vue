<script setup lang="ts">
import { cn } from '@/shared/lib';
defineProps<{ class?: string }>();
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center rounded-full border border-transparent bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
        $props.class,
      )
    "
  >
    <slot />
  </span>
</template>
