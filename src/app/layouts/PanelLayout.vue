<script setup lang="ts">
import { Header } from '@/widgets/header';
import { PanelShell } from '@/widgets/panel-shell';
import { RequireAuth } from '@/features/auth';
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <RequireAuth>
      <PanelShell>
        <RouterView />
      </PanelShell>
    </RequireAuth>
  </div>
</template>
