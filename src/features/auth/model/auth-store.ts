import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { User } from '@/entities/user';
import { isAdminUser } from '@/entities/user';
import * as userApi from '@/entities/user';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null);
    const hydrated = ref(false);

    const isAdmin = computed(() => isAdminUser(user.value));
    const isAuthenticated = computed(() => !!user.value);

    const setUser = (u: User | null) => {
      user.value = u;
    };

    const setHydrated = (v: boolean) => {
      hydrated.value = v;
    };

    const login = async (email: string, password: string) => {
      const res = await userApi.login(email, password);
      user.value = res.user;
      try {
        const me = await userApi.fetchMe();
        user.value = me.data;
        return me.data;
      } catch {
        return res.user;
      }
    };

    const register = async (input: { name: string; email: string; password: string }) => {
      const res = await userApi.register(input);
      user.value = res.user;
      try {
        const me = await userApi.fetchMe();
        user.value = me.data;
        return me.data;
      } catch {
        return res.user;
      }
    };

    const logout = async () => {
      try {
        await userApi.logout();
      } finally {
        user.value = null;
      }
    };

    const refreshMe = async () => {
      try {
        const me = await userApi.fetchMe();
        user.value = me.data;
        return me.data;
      } catch {
        user.value = null;
        return null;
      }
    };

    return {
      user,
      hydrated,
      isAdmin,
      isAuthenticated,
      setUser,
      setHydrated,
      login,
      register,
      logout,
      refreshMe,
    };
  },
  {
    persist: {
      key: 'bookstore-auth',
      pick: ['user'],
    },
  },
);
