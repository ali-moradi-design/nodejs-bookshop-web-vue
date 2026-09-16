<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { UiButton } from '@/shared/ui';

const { t } = useI18n();
</script>

<template>
  <section class="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-background to-accent/20 px-6 py-14 sm:px-10">
    <div class="relative z-10 max-w-xl space-y-4">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ t('home.heroTitle') }}</h1>
      <p class="text-muted-foreground sm:text-lg">{{ t('home.heroSubtitle') }}</p>
      <RouterLink to="/catalog">
        <UiButton size="lg">{{ t('home.browseAll') }}</UiButton>
      </RouterLink>
    </div>
  </section>
</template>
