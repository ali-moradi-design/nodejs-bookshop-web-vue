<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { cn } from '@/shared/lib';

const { t } = useI18n();
const route = useRoute();

const links = [
  { to: '/admin', label: 'nav.dashboard', exact: true },
  { to: '/admin/books', label: 'nav.books' },
  { to: '/admin/orders', label: 'nav.orders' },
  { to: '/admin/users', label: 'nav.users' },
  { to: '/admin/roles', label: 'nav.roles' },
  { to: '/admin/permissions', label: 'nav.permissions' },
  { to: '/admin/discounts', label: 'nav.discounts' },
  { to: '/admin/reports', label: 'nav.reports' },
  { to: '/admin/analytics', label: 'nav.analytics' },
];
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:flex-row sm:px-6">
    <aside class="w-full shrink-0 sm:w-56">
      <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {{ t('admin.title') }}
      </p>
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
