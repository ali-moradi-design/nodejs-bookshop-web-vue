<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/features/auth';
import { CartBadgeLink } from '@/features/cart';
import { ThemeSwitcher } from '@/features/theme-switcher';
import { LocaleSwitcher } from '@/features/locale-switcher';
import { UiButton } from '@/shared/ui';

const { t } = useI18n();
const auth = useAuthStore();

const onLogout = async () => {
  await auth.logout();
};
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2 font-semibold tracking-tight">
        <img src="/logo.png" alt="" class="h-8 w-8 object-contain" />
        <span class="hidden sm:inline">{{ t('common.appName') }}</span>
      </RouterLink>
      <nav class="ms-4 hidden items-center gap-3 text-sm md:flex">
        <RouterLink to="/" class="text-muted-foreground hover:text-foreground">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/catalog" class="text-muted-foreground hover:text-foreground">{{ t('nav.catalog') }}</RouterLink>
        <RouterLink v-if="auth.user" to="/panel" class="text-muted-foreground hover:text-foreground">{{ t('nav.account') }}</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="text-muted-foreground hover:text-foreground">{{ t('nav.admin') }}</RouterLink>
      </nav>
      <div class="ms-auto flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeSwitcher />
        <CartBadgeLink />
        <template v-if="auth.user">
          <span class="hidden text-sm text-muted-foreground sm:inline">{{ auth.user.name }}</span>
          <UiButton variant="ghost" size="sm" @click="onLogout">{{ t('nav.logout') }}</UiButton>
        </template>
        <template v-else>
          <RouterLink to="/login">
            <UiButton variant="ghost" size="sm">{{ t('nav.login') }}</UiButton>
          </RouterLink>
          <RouterLink to="/register">
            <UiButton size="sm">{{ t('nav.register') }}</UiButton>
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
