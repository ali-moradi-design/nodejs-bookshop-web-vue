import type { BookListParams } from '@/entities/book';

export const parseBookFilters = (query: Record<string, unknown>): BookListParams => {
  const num = (v: unknown) => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
  const bool = (v: unknown) => (v === 'true' || v === true ? true : undefined);

  return {
    q: str(query.q),
    category: str(query.category),
    minPrice: num(query.minPrice),
    maxPrice: num(query.maxPrice),
    inStock: bool(query.inStock),
    page: num(query.page) || 1,
    limit: num(query.limit) || 12,
    sort: (str(query.sort) as BookListParams['sort']) || 'createdAt',
    order: (str(query.order) as BookListParams['order']) || 'desc',
  };
};

export const filtersToQuery = (f: BookListParams): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.entries(f).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    out[k] = String(v);
  });
  return out;
};
