'use client';

import Link from 'next/link';
import { useMemo, useState, type CSSProperties } from 'react';
import { formatXof, type StoreProduct } from '@/lib/store-catalog';

type StoreCatalogProps = { products: StoreProduct[] };

export default function StoreCatalog({ products }: StoreCatalogProps) {
  const categories = ['Tous', ...Array.from(new Set(products.map((product) => product.category)))];
  const [category, setCategory] = useState('Tous');
  const [cart, setCart] = useState<Record<string, number>>({});
  const visible = category === 'Tous' ? products : products.filter((product) => product.category === category);
  const cartLines = useMemo(() => products.filter((product) => cart[product.id]).map((product) => ({ product, quantity: cart[product.id] })), [cart, products]);
  const total = cartLines.reduce((sum, line) => sum + line.product.priceXof * line.quantity, 0);
  const cartQuery = encodeURIComponent(cartLines.map(({ product, quantity }) => `${quantity}× ${product.name}`).join(', '));

  function addToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: Math.min((current[productId] || 0) + 1, 9) }));
  }

  return <div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les équipements par catégorie">
      {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-4 py-2.5 text-xs font-bold transition ${category === item ? 'border-transparent bg-[#4556f5] text-white' : 'border-black/10 bg-white hover:border-[#4556f5]'}`}>{item}</button>)}
    </div>

    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visible.map((product) => <article key={product.id} className="store-product-card group flex min-h-[520px] flex-col overflow-hidden rounded-[30px] border border-black/8 bg-white">
        <div className="store-product-visual relative min-h-56 overflow-hidden p-6" style={{ '--product-accent': product.accent } as CSSProperties}>
          <div className="absolute -right-10 -top-12 size-48 rounded-full border border-black/10" />
          <div className="absolute bottom-6 right-7 grid size-28 place-items-center rounded-[32px] border border-black/10 bg-black/90 text-5xl text-white shadow-2xl transition duration-500 group-hover:-translate-y-2 group-hover:rotate-3">{product.symbol}</div>
          <span className="relative rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-black">{product.category}</span>
          <p className="relative mt-20 max-w-[190px] text-sm font-semibold leading-5 text-black/65">{product.headline}</p>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold tracking-tight">{product.name}</h2><p className="mt-1 text-[11px] font-semibold text-black/45">{product.reference}</p></div><span className="catalog-badge rounded-full bg-[#e7f7ff] px-3 py-1.5 text-[10px] font-bold text-[#183e68]">SafeR</span></div>
          <p className="mt-5 text-sm leading-6 text-black/58">{product.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full border border-black/8 px-2.5 py-1 text-[10px] font-semibold text-black/55">{tag}</span>)}</div>
          <div className="mt-auto pt-7"><div className="border-t border-black/8 pt-5"><div className="flex items-end justify-between gap-4"><div><p className="text-2xl font-semibold">{formatXof(product.priceXof)} <span className="text-xs">FCFA</span></p><p className="mt-1 text-[11px] text-black/45">+ service dès {formatXof(product.monthlyXof)} FCFA/mois</p></div><button type="button" onClick={() => addToCart(product.id)} className="rounded-full bg-black px-5 py-3 text-xs font-bold text-white transition hover:bg-[#4556f5]" aria-label={`Ajouter ${product.name} au panier`}>Ajouter</button></div><p className="mt-4 text-[10px] leading-4 text-black/42">{product.stock} · Base technique : {product.sourceEcosystem} {product.sourceModel}</p></div></div>
        </div>
      </article>)}
    </div>

    {cartLines.length > 0 && <aside className="sticky bottom-4 z-40 mx-auto mt-8 flex max-w-4xl flex-col gap-4 rounded-[24px] border border-white/15 bg-black/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between" aria-label="Panier SafeR">
      <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#52c6ff]">Votre sélection · {cartLines.reduce((sum, line) => sum + line.quantity, 0)} article(s)</p><p className="mt-1 text-lg font-semibold">À partir de {formatXof(total)} FCFA</p><p className="text-[10px] text-white/55">Prix indicatif, configuration et disponibilité validées avant paiement.</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => setCart({})} className="rounded-full border border-white/15 px-4 py-3 text-xs font-bold">Vider</button><Link href={`/diagnostic?selection=${cartQuery}`} className="rounded-full bg-[#4556f5] px-5 py-3 text-center text-xs font-bold">Configurer & commander</Link></div>
    </aside>}
  </div>;
}
