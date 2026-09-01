import Link from '@/components/Link';

type Tone = 'blue' | 'sky' | 'black';
const tones: Record<Tone, { section: string; eyebrow: string; button: string }> = {
  blue: { section: 'bg-[#4556f5] text-white', eyebrow: 'text-white/55', button: 'bg-black text-white' },
  sky: { section: 'bg-[#52c6ff] text-black', eyebrow: 'text-black/45', button: 'bg-black text-white' },
  black: { section: 'bg-black text-white', eyebrow: 'text-[#52c6ff]', button: 'bg-[#4556f5] text-white' },
};

export default function CtaBand({ eyebrow, title, cta, href, secondary, secondaryHref, tone = 'sky' }: { eyebrow?: string; title: string; cta: string; href: string; secondary?: string; secondaryHref?: string; tone?: Tone }) {
  const t = tones[tone];
  return (
    <section className={`px-5 py-20 lg:px-8 ${t.section}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div>{eyebrow && <p className={`text-xs font-bold uppercase tracking-[.16em] ${t.eyebrow}`}>{eyebrow}</p>}<h2 className={`max-w-3xl text-4xl font-light leading-tight sm:text-5xl ${eyebrow ? 'mt-4' : ''}`}>{title}</h2></div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={href} className={`rounded-full px-7 py-4 text-center text-sm font-bold ${t.button}`}>{cta}</Link>
          {secondary && secondaryHref && <Link href={secondaryHref} className="rounded-full border border-current/25 px-7 py-4 text-center text-sm font-bold">{secondary}</Link>}
        </div>
      </div>
    </section>
  );
}
