<script setup lang="ts">
import { cn } from '@/shared/lib';
defineProps<{
  modelValue?: string;
  placeholder?: string;
  rows?: number;
  class?: string;
  required?: boolean;
}>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows || 4"
    :required="required"
    :class="
      cn(
        'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        $props.class,
      )
    "
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
