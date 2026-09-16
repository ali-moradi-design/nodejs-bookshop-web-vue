<script setup lang="ts">
import { Header } from '@/widgets/header';
import { AdminShell } from '@/widgets/admin-shell';
import { RequireAuth } from '@/features/auth';
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <RequireAuth require-admin>
      <AdminShell>
        <RouterView />
      </AdminShell>
    </RequireAuth>
  </div>
</template>
