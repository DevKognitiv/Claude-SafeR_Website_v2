import JsonLd from '@/components/JsonLd';
import type { StoreItem } from '@/lib/catalog/view';
import { SITE_URL } from '@/lib/site';

/** schema.org ItemList of products for store listing pages (category, subcategory, brand, store home). */
export default function ItemListJsonLd({ name, description, path, items, limit = 24 }: { name: string; description?: string; path: string; items: StoreItem[]; limit?: number }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description ? { description } : {}),
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items.slice(0, limit).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}${item.path}`,
      item: {
        '@type': 'Product',
        name: item.name,
        sku: item.sku,
        brand: { '@type': 'Brand', name: item.brandName },
        description: item.tagline,
        url: `${SITE_URL}${item.path}`,
        ...(item.imageUrl ? { image: item.imageUrl } : {}),
        ...(item.priceXof
          ? { offers: { '@type': 'Offer', price: item.priceXof, priceCurrency: 'XOF', availability: item.availability === 'en-stock' ? 'https://schema.org/InStock' : item.availability === 'precommande' ? 'https://schema.org/PreOrder' : 'https://schema.org/BackOrder', url: `${SITE_URL}${item.path}` } }
          : {}),
      },
    })),
  };
  return <JsonLd data={data} />;
}
