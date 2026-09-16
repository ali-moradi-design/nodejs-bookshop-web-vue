import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Cart } from '@/entities/cart';
import * as cartApi from '@/entities/cart';

export const useCartStore = defineStore('cart', () => {
  const cart = ref<Cart | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const itemCount = computed(() =>
    cart.value?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
  );

  const load = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await cartApi.fetchCart();
      cart.value = res.data;
    } catch (e) {
      cart.value = null;
      error.value = e instanceof Error ? e.message : 'Failed to load cart';
    } finally {
      loading.value = false;
    }
  };

  const addItem = async (bookId: string, quantity = 1) => {
    const res = await cartApi.addCartItem(bookId, quantity);
    cart.value = res.data;
  };

  const updateItem = async (bookId: string, quantity: number) => {
    const res = await cartApi.updateCartItem(bookId, quantity);
    cart.value = res.data;
  };

  const removeItem = async (bookId: string) => {
    const res = await cartApi.removeCartItem(bookId);
    cart.value = res.data;
  };

  const clear = async () => {
    const res = await cartApi.clearCart();
    cart.value = res.data;
  };

  return { cart, loading, error, itemCount, load, addItem, updateItem, removeItem, clear };
});
