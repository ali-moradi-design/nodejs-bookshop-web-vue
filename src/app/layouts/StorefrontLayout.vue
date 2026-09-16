<script setup lang="ts">
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { StorefrontShell } from '@/widgets/storefront-shell';
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <StorefrontShell>
      <RouterView />
    </StorefrontShell>
    <Footer />
  </div>
</template>
