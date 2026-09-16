<script setup lang="ts">
defineProps<{ for?: string; class?: string }>();
</script>

<template>
  <label :for="for" :class="['text-sm font-medium leading-none', $props.class]">
    <slot />
  </label>
</template>
