<script setup lang="ts">
import { cn } from '@/shared/lib';

defineProps<{
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  class?: string;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <input
    :id="id"
    :type="type || 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :min="min"
    :max="max"
    :step="step"
    :class="
      cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        $props.class,
      )
    "
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
