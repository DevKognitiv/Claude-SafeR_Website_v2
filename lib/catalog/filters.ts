export type CategoryId = 'video' | 'alarme' | 'acces' | 'domotique' | 'energie';
export const categoryIds: CategoryId[] = ['video', 'alarme', 'acces', 'domotique', 'energie'];
export type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'newest' | 'name';
export const facetKeys = ['brand', 'protocol', 'placement', 'power', 'compat', 'resolution', 'availability', 'price'] as const;
export type FacetKey = (typeof facetKeys)[number];

export function isCategoryId(value: string): value is CategoryId {
  return (categoryIds as string[]).includes(value);
}

export type FilterState = {
  q?: string;
  category?: CategoryId;
  subcategory?: string;
  brand?: string[];
  protocol?: string[];
  placement?: string[];
  power?: string[];
  compat?: string[];
  resolution?: string[];
  availability?: string[];
  price?: string[];
  sort?: SortKey;
};

const multiKeys: (keyof FilterState)[] = ['brand', 'protocol', 'placement', 'power', 'compat', 'resolution', 'availability', 'price'];

export function parseFilters(params: URLSearchParams | Record<string, string | string[] | undefined>): FilterState {
  const get = (key: string): string[] => {
    if (params instanceof URLSearchParams) return params.getAll(key).flatMap((v) => v.split(',')).filter(Boolean);
    const value = params[key];
    if (!value) return [];
    return (Array.isArray(value) ? value : [value]).flatMap((v) => v.split(',')).filter(Boolean);
  };
  const state: FilterState = {};
  const q = get('q')[0];
  if (q) state.q = q.slice(0, 80);
  const category = get('category')[0];
  if (category && isCategoryId(category)) state.category = category;
  const subcategory = get('subcategory')[0];
  if (subcategory) state.subcategory = subcategory;
  for (const key of multiKeys) {
    const values = get(key);
    if (values.length) (state as Record<string, unknown>)[key] = Array.from(new Set(values));
  }
  const sort = get('sort')[0];
  if (sort && ['featured', 'priceAsc', 'priceDesc', 'newest', 'name'].includes(sort)) state.sort = sort as SortKey;
  return state;
}

export function serializeFilters(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.category) params.set('category', state.category);
  if (state.subcategory) params.set('subcategory', state.subcategory);
  for (const key of multiKeys) {
    const values = state[key] as string[] | undefined;
    if (values?.length) params.set(key, values.join(','));
  }
  if (state.sort && state.sort !== 'featured') params.set('sort', state.sort);
  const query = params.toString();
  return query ? `?${query}` : '';
}
