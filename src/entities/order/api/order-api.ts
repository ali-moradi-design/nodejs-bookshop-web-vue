import { apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData } from '@/shared/api';
import type { Order, OrderStatus } from '../model/types';

export const fetchOrders = () => apiGet<ApiData<Order[]>>('/orders');
export const fetchOrder = (id: string) => apiGet<ApiData<Order>>(`/orders/${id}`);
export const payOrder = (id: string) => apiPost<ApiData<Order>>(`/orders/${id}/pay`);
export const updateOrderStatus = (id: string, status: OrderStatus, note?: string) =>
  apiPatch<ApiData<Order>>(`/orders/${id}/status`, { status, note });
