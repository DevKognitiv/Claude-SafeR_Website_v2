import Icon, { type IconName } from '@/components/Icon';
import { getI18n } from '@/lib/i18n/server';

/** Conversion reassurance row: warranty, verified installers, payment, 24/7 — used on Store, product and offer pages. */
export default async function TrustStrip({ tone = 'light', compact = false }: { tone?: 'light' | 'dark'; compact?: boolean }) {
  const { d } = await getI18n();
  const dark = tone === 'dark';
  return (
    <section aria-label={d.trust.eyebrow} className={`${compact ? 'py-6' : 'py-10'} px-5 lg:px-8 ${dark ? 'bg-black text-white' : 'border-y border-black/8 bg-white text-black'}`}>
      <ul className={`mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4`}>
        {d.trust.items.map(([icon, title, text]) => (
          <li key={title} className={`flex items-start gap-4 rounded-2xl p-4 ${dark ? 'bg-white/6' : 'bg-[#f3f5fb]'}`}>
            <span className={`grid size-11 shrink-0 place-items-center rounded-full ${dark ? 'bg-[#4556f5] text-white' : 'bg-[#4556f5]/10 text-[#4556f5]'}`}><Icon name={icon as IconName} size={22} /></span>
            <div><p className="text-sm font-semibold leading-tight">{title}</p><p className={`mt-1 text-xs leading-5 ${dark ? 'text-white/55' : 'text-black/55'}`}>{text}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
