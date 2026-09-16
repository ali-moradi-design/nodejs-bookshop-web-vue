<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { cn } from '@/shared/lib';

const { t } = useI18n();
const route = useRoute();

const links = [
  { to: '/panel', label: 'nav.dashboard', exact: true },
  { to: '/panel/profile', label: 'nav.profile' },
  { to: '/panel/orders', label: 'nav.orders' },
  { to: '/panel/favorites', label: 'nav.favorites' },
  { to: '/panel/reviews', label: 'nav.reviews' },
  { to: '/panel/report', label: 'nav.report' },
];
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:flex-row sm:px-6">
    <aside class="w-full shrink-0 sm:w-56">
      <nav class="flex flex-row gap-1 overflow-x-auto sm:flex-col">
        <RouterLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :class="
            cn(
              'rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-accent',
              (l.exact ? route.path === l.to : route.path.startsWith(l.to)) &&
                'bg-accent font-medium text-accent-foreground',
            )
          "
        >
          {{ t(l.label) }}
        </RouterLink>
      </nav>
    </aside>
    <div class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
