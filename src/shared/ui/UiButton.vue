<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/shared/lib';

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    class?: string;
  }>(),
  { variant: 'default', size: 'md', type: 'button', disabled: false },
);

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-primary text-primary-foreground hover:bg-primary/90': props.variant === 'default',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80': props.variant === 'secondary',
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
        props.variant === 'outline',
      'hover:bg-accent hover:text-accent-foreground': props.variant === 'ghost',
      'bg-destructive text-destructive-foreground hover:bg-destructive/90':
        props.variant === 'destructive',
      'h-8 px-3 text-sm': props.size === 'sm',
      'h-10 px-4 text-sm': props.size === 'md',
      'h-11 px-6 text-base': props.size === 'lg',
    },
    props.class,
  ),
);
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
