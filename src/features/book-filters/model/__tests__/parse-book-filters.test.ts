import { describe, expect, it } from 'vitest';
import { parseBookFilters, filtersToQuery } from '../parse-book-filters';

describe('parseBookFilters', () => {
  it('parses query params', () => {
    const p = parseBookFilters({ q: 'vue', page: '2', inStock: 'true', minPrice: '10' });
    expect(p.q).toBe('vue');
    expect(p.page).toBe(2);
    expect(p.inStock).toBe(true);
    expect(p.minPrice).toBe(10);
  });

  it('round-trips via filtersToQuery', () => {
    const p = parseBookFilters({ q: 'niko', category: 'fiction' });
    const q = filtersToQuery(p);
    expect(q.q).toBe('niko');
    expect(q.category).toBe('fiction');
  });
});
