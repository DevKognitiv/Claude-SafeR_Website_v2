import Link from '@/components/Link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductShowcase from '@/components/ProductShowcase';
import JsonLd from '@/components/JsonLd';
import Icon, { type IconName } from '@/components/Icon';
import TrustStrip from '@/components/TrustStrip';
import { catalog } from '@/lib/catalog';
import { getI18n } from '@/lib/i18n/server';
import { packOrder } from '@/lib/packs';
import { CONTACT_PHONE_HREF, SITE_URL } from '@/lib/site';

export default async function Home() {
  const { d, meta } = await getI18n();
  const h = d.home;
  const packs = packOrder.map((id) => ({ id, ...d.offers.packs[id], featured: id === 'serenite' }));
  const brandNames = Object.values(catalog.brands).filter((b) => b.count > 0).map((b) => b.name);
  const ecosystemIcons: IconName[] = ['camera', 'shield', 'key', 'home'];

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SafeR',
    legalName: 'RADIANT ASSISTANCE SECURITY',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/safer-logo.png`,
    telephone: '+2250150202020',
    address: { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressRegion: 'Plateau', addressCountry: 'CI' },
    areaServed: 'CI',
    inLanguage: meta.htmlLang,
  };

  return (
    <main id="contenu" className="theme-page overflow-hidden bg-[#f1f4f1] text-[#0a1814]">
      <JsonLd data={orgJsonLd} />
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <video className="absolute inset-0 h-full w-full object-cover opacity-55" autoPlay muted loop playsInline poster="/media/safer-abidjan-showroom-v1.png" aria-hidden="true">
          <source src="https://videos.pexels.com/video-files/5744424/5744424-hd_1280_720_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.88)_38%,rgba(0,0,0,.18)_100%)]" />
        <div className="brand-grid absolute inset-0 opacity-30" />
        <div className="brand-cut absolute -bottom-16 -right-20 h-48 w-[70%] bg-[#4556f5]/85" />
        <SiteHeader />
        <div className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-5 pb-24 pt-10 lg:grid-cols-[1.04fr_.96fr] lg:px-8 lg:pb-28">
          <div className="absolute -left-52 top-8 size-[520px] rounded-full bg-[#4556f5]/30 blur-[110px]" />
          <div className="relative z-10 max-w-3xl">
            <div className="animate-rise mb-7 inline-flex items-center gap-2 rounded-full border border-[#52c6ff]/30 bg-[#4556f5]/20 px-3.5 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#bcecff] backdrop-blur-md">
              <span className="size-1.5 animate-pulse rounded-full bg-[#52c6ff]" /><span>{h.hero.badge}</span>
            </div>
            <h1 className="animate-rise-2 max-w-3xl text-5xl font-light leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-[78px]"><span>{h.hero.title1}</span><br /><span className="font-semibold text-[#52c6ff]">{h.hero.title2}</span></h1>
            <p className="animate-rise-3 mt-7 max-w-xl text-lg leading-8 text-white/62">{h.hero.description}</p>
            <div className="animate-rise-4 mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/diagnostic" className="rounded-full bg-[#4556f5] px-7 py-4 text-center text-sm font-bold text-white shadow-[0_18px_50px_rgba(69,86,245,.35)] transition hover:-translate-y-0.5 hover:bg-[#52c6ff] hover:text-black">{h.hero.configure}</Link>
              <a href="#parcours" className="rounded-full border border-white/15 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/8">{h.hero.how}</a>
            </div>
            <div className="mt-11 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {h.hero.stats.map((stat) => <div key={stat.label}><p className="text-xl font-semibold">{stat.value}</p><p className="mt-1 text-xs text-white/45">{stat.label}</p></div>)}
            </div>
          </div>
          <div className="animate-rise-3 relative z-10 mx-auto w-full max-w-[570px] lg:ml-auto">
            <div className="absolute inset-10 rounded-full bg-[#b8ff3d]/15 blur-[85px]" />
            <div className="relative rotate-[1.5deg] rounded-[34px] border border-white/15 bg-[#10221d]/80 p-3 shadow-[0_45px_120px_rgba(0,0,0,.5)] backdrop-blur-xl">
              <div className="rounded-[27px] border border-white/8 bg-[#eaf0ec] p-4 text-[#0c1915] sm:p-6">
                <div className="mb-6 flex items-center justify-between"><div><p className="text-xs text-black/45">{h.hero.mock.greeting}</p><p className="mt-1 font-semibold">{h.hero.mock.status}</p></div><span className="grid size-10 place-items-center rounded-full bg-white text-sm shadow-sm">{h.hero.mock.initials}</span></div>
                <div className="relative overflow-hidden rounded-[24px] bg-[#0b1d17] p-5 text-white sm:p-6">
                  <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[#b8ff3d]/20 blur-2xl" />
                  <div className="relative flex items-start justify-between"><div><p className="text-xs text-white/50">{h.hero.mock.home}</p><p className="mt-2 text-xl font-semibold">{h.hero.mock.protected}</p></div><span className="grid size-12 place-items-center rounded-full bg-[#b8ff3d] text-[#07120f]"><Icon name="check" size={22} strokeWidth={2.5} /></span></div>
                  <div className="relative mt-8 grid grid-cols-3 gap-2"><div className="rounded-2xl bg-white/8 p-3"><p className="text-lg">04</p><p className="text-[10px] text-white/45">{h.hero.mock.accessClosed}</p></div><div className="rounded-2xl bg-white/8 p-3"><p className="text-lg">07</p><p className="text-[10px] text-white/45">{h.hero.mock.camerasActive}</p></div><div className="rounded-2xl bg-white/8 p-3"><p className="text-lg">22°</p><p className="text-[10px] text-white/45">{h.hero.mock.climate}</p></div></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4 shadow-sm"><Icon name="camera" size={24} /><p className="mt-4 text-xs text-black/45">{h.hero.mock.entrance}</p><p className="mt-1 text-sm font-semibold">{h.hero.mock.live}</p></div><div className="rounded-2xl bg-[#b8ff3d] p-4"><Icon name="zap" size={24} /><p className="mt-4 text-xs text-black/45">{h.hero.mock.scene}</p><p className="mt-1 text-sm font-semibold">{h.hero.mock.evening}</p></div></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-white/12 bg-[#132a23]/90 p-4 shadow-2xl backdrop-blur-xl sm:-left-10"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#b8ff3d] text-[#07120f]"><Icon name="check" size={18} strokeWidth={2.5} /></span><div><p className="text-xs text-white/45">{h.hero.mock.patrol}</p><p className="text-sm font-semibold">{h.hero.mock.nearby}</p></div></div></div>
          </div>
        </div>
      </section>

      <section className="marquee overflow-hidden border-b border-black/8 bg-white py-5" aria-label={h.ribbon.join(' · ')}>
        <div className="marquee-track gap-10 text-xs font-semibold uppercase tracking-[.14em] text-black/40">{[...h.ribbon, ...brandNames, ...h.ribbon, ...brandNames].map((item, i) => <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">{item}<span aria-hidden="true" className="size-1 rounded-full bg-[#4556f5]" /></span>)}</div>
      </section>

      <section className="bg-black px-5 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.12fr_.88fr]">
          <div className="media-grade relative min-h-[520px] overflow-hidden rounded-[36px]">
            <img src="/media/safer-abidjan-showroom-v1.png" alt={h.gallery.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#bcecff]">{h.gallery.eyebrow}</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-light leading-[1.02] tracking-[-.04em] sm:text-5xl">{h.gallery.title1}<br /><span className="font-semibold">{h.gallery.title2}</span></h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative min-h-[248px] overflow-hidden rounded-[30px] bg-[#4556f5] p-7">
              <img src="https://images.pexels.com/videos/25951436/adjust-automation-bedroom-button-25951436.jpeg?auto=compress&dpr=1&h=750&w=1260" alt={h.gallery.smartHomeAlt} className="absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-multiply" loading="lazy" />
              <div className="relative z-10 flex h-full flex-col justify-between"><span className="text-xs font-bold uppercase tracking-[.16em] text-white/65">{h.gallery.smartHome}</span><p className="max-w-sm text-2xl font-semibold">{h.gallery.smartHomeText}</p></div>
            </div>
            <div className="relative min-h-[248px] overflow-hidden rounded-[30px] bg-[#52c6ff] p-7 text-black">
              <div aria-hidden="true" className="brand-grid absolute inset-0 opacity-45" /><div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full border-[34px] border-black/10" />
              <div className="relative z-10 flex h-full flex-col justify-between"><span className="text-xs font-bold uppercase tracking-[.16em] text-black/50">{h.gallery.signal}</span><div><p className="text-4xl font-light">{h.gallery.signalValue}</p><p className="mt-2 max-w-xs text-sm leading-6 text-black/60">{h.gallery.signalText}</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <ProductShowcase />

      <section id="solutions" className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="eyebrow">{h.ecosystem.eyebrow}</p><h2 className="section-title mt-5">{h.ecosystem.title1}<br />{h.ecosystem.title2}</h2></div><p className="max-w-lg text-base leading-7 text-black/55 lg:ml-auto">{h.ecosystem.intro}</p></div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {h.ecosystem.cards.map((item, i) => <Link href={item.href} key={item.href} data-reveal="" data-reveal-delay={String(i)} className={`group card-lift flex min-h-[330px] flex-col rounded-[28px] border p-6 ${i === 1 ? 'border-transparent bg-[#b8ff3d]' : 'border-black/8 bg-white hover:border-black/15'}`}><div className="flex items-center justify-between text-sm text-black/35"><span>{item.n}</span><span className="grid size-11 place-items-center rounded-full border border-black/10 transition group-hover:translate-x-1"><Icon name={ecosystemIcons[i]} size={22} /></span></div><div className="mt-auto"><p className="mb-5 text-xs font-bold uppercase tracking-[.12em] text-black/35">{item.tag}</p><h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-black/55">{item.text}</p></div></Link>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto overflow-hidden rounded-[34px] bg-[#b8ff3d] px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div className="grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-black/45">{h.promise.eyebrow}</p><h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-.045em] sm:text-5xl lg:text-6xl">{h.promise.title1}<br />{h.promise.title2}</h2></div>
            <div className="rounded-[26px] bg-[#07120f] p-6 text-white lg:p-8"><div className="mb-8 flex items-center gap-3"><span className="relative grid size-12 place-items-center rounded-full bg-[#b8ff3d] text-xl text-[#07120f]">✓</span><div><p className="font-semibold">{h.promise.center}</p><p className="text-xs text-white/45">{h.promise.centerSub}</p></div></div><div className="space-y-4 text-sm">{h.promise.rows.map(([k, v], i) => <div key={k} className={`flex justify-between ${i < h.promise.rows.length - 1 ? 'border-b border-white/10 pb-4' : ''}`}><span className="text-white/50">{k}</span><span>{v}</span></div>)}</div></div>
          </div>
        </div>
      </section>

      <section id="parcours" className="bg-white px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="eyebrow">{h.journey.eyebrow}</p><h2 className="section-title mt-5">{h.journey.title1}<br />{h.journey.title2}</h2><p className="mt-6 max-w-xl leading-7 text-black/55">{h.journey.intro}</p></div>
          <div className="mt-16 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">
            {h.journey.steps.map(([n, title, text], i) => <div key={n} data-reveal="" data-reveal-delay={String(i % 3)} className="group min-h-[230px] border-b border-r border-black/10 p-6 lg:p-8"><span className="text-sm font-semibold text-[#659413]">{n}</span><h3 className="mt-12 text-2xl font-semibold tracking-tight">{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-black/50">{text}</p></div>)}
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-black/45">{h.journey.free}</p><Link href="/diagnostic" className="rounded-full bg-[#0b1d17] px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-[#17352b]">{d.common.startNow}</Link></div>
        </div>
      </section>

      <section className="bg-[#0b1d17] px-5 py-24 text-white lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div><p className="eyebrow text-[#b8ff3d]">{h.app.eyebrow}</p><h2 className="section-title mt-5">{h.app.title1}<br />{h.app.title2}</h2><p className="mt-6 max-w-lg leading-7 text-white/55">{h.app.intro}</p><div className="mt-8 grid max-w-md grid-cols-2 gap-3 text-sm"><div className="rounded-2xl border border-white/10 p-4"><span className="text-[#b8ff3d]">●</span><p className="mt-3 font-semibold">{h.app.alerts}</p><p className="mt-1 text-xs text-white/40">{h.app.alertsSub}</p></div><div className="rounded-2xl border border-white/10 p-4"><span className="text-[#b8ff3d]">↗</span><p className="mt-3 font-semibold">{h.app.actions}</p><p className="mt-1 text-xs text-white/40">{h.app.actionsSub}</p></div></div><Link href="/espace-client" className="mt-8 inline-flex rounded-full bg-[#b8ff3d] px-6 py-3.5 text-sm font-bold text-[#07120f]">{h.app.cta}</Link></div>
          <div className="relative mx-auto w-full max-w-xl rounded-[34px] border border-white/12 bg-white/6 p-4 shadow-[0_40px_100px_rgba(0,0,0,.35)]"><div className="rounded-[27px] bg-[#e9efe9] p-5 text-[#0b1d17]"><div className="flex items-center justify-between"><div><p className="text-xs text-black/40">{h.app.mock.dashboard}</p><p className="font-semibold">{h.app.mock.residence}</p></div><span className="rounded-full bg-[#b8ff3d] px-3 py-1.5 text-xs font-bold">{h.app.mock.protected}</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="min-h-52 rounded-3xl bg-[#07120f] p-5 text-white"><div className="flex justify-between"><span className="text-xs text-white/45">{h.app.mock.camera}</span><span className="size-2 rounded-full bg-[#b8ff3d]" /></div><div className="grid h-28 place-items-center text-4xl text-white/25">◉</div><p className="text-sm font-semibold">{h.app.mock.noMotion}</p></div><div className="grid gap-3"><div className="rounded-2xl bg-white p-4"><p className="text-xs text-black/40">{h.app.mock.gate}</p><div className="mt-5 flex items-end justify-between"><p className="font-semibold">{h.app.mock.closed}</p><span className="grid size-9 place-items-center rounded-full bg-[#b8ff3d]">✓</span></div></div><div className="rounded-2xl bg-[#b8ff3d] p-4"><p className="text-xs text-black/40">{h.app.mock.scene}</p><p className="mt-5 font-semibold">{h.app.mock.away}</p></div></div></div></div></div>
        </div>
      </section>

      <section id="packs" className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl"><div className="text-center"><p className="eyebrow">{h.packs.eyebrow}</p><h2 className="section-title mt-5">{h.packs.title1}<br />{h.packs.title2}</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-black/50">{h.packs.intro}</p></div>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">{packs.map((pack, i) => <article key={pack.id} data-reveal="" data-reveal-delay={String(i + 1)} className={`card-lift relative rounded-[30px] p-7 ${pack.featured ? 'bg-[#0b1d17] text-white shadow-2xl lg:-translate-y-4' : 'border border-black/8 bg-white'}`}>{pack.featured && <span className="absolute right-6 top-6 rounded-full bg-[#b8ff3d] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#07120f]">{h.packs.popular}</span>}<p className={`text-xs font-bold uppercase tracking-[.12em] ${pack.featured ? 'text-[#b8ff3d]' : 'text-black/35'}`}>{h.packs.segment}</p><h3 className="mt-5 text-2xl font-semibold">{pack.name}</h3><p className={`mt-2 min-h-12 text-sm leading-6 ${pack.featured ? 'text-white/50' : 'text-black/50'}`}>{pack.desc}</p><div className="my-7 border-y border-current/10 py-6"><span className="price text-3xl font-semibold">{pack.price}</span>{pack.id !== 'signature' && <><span className="ml-1 text-sm">{d.common.fcfa}</span><p className={`mt-1 text-xs ${pack.featured ? 'text-white/40' : 'text-black/40'}`}>{h.packs.perMonth}</p></>}</div><ul className="space-y-3 text-sm">{pack.items.map((item) => <li key={item} className="flex gap-3"><span className="text-[#75a919]">✓</span><span className={pack.featured ? 'text-white/70' : 'text-black/65'}>{item}</span></li>)}</ul><div className="mt-8 grid gap-2"><Link href={`/diagnostic?pack=${pack.id}`} className={`block rounded-full px-6 py-3.5 text-center text-sm font-bold ${pack.featured ? 'bg-[#b8ff3d] text-[#07120f]' : 'bg-[#0b1d17] text-white'}`}>{h.packs.choose}</Link><Link href={`/offres/${pack.id}`} className={`block text-center text-xs font-semibold underline underline-offset-4 ${pack.featured ? 'text-white/70' : 'text-black/55'}`}>{d.offers.seeDetails}</Link></div></article>)}</div>
          <div className="mt-8 text-center"><Link href="/offres" className="text-sm font-semibold underline decoration-[#79aa21] decoration-2 underline-offset-4">{h.packs.compare}</Link></div>
        </div>
      </section>

      <TrustStrip />

      <section className="px-5 pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto overflow-hidden rounded-[36px] bg-[#cfe7df] p-7 sm:p-10 lg:p-16"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="eyebrow">{h.collective.eyebrow}</p><h2 className="section-title mt-5">{h.collective.title1}<br />{h.collective.title2}</h2><p className="mt-6 max-w-lg leading-7 text-black/55">{h.collective.intro}</p><Link href="/quartiers" className="mt-8 inline-flex rounded-full bg-[#0b1d17] px-6 py-3.5 text-sm font-bold text-white">{h.collective.cta}</Link></div><div className="relative min-h-[380px] overflow-hidden rounded-[30px] bg-[#0b1d17] p-6 text-white"><div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(184,255,61,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(184,255,61,.12)_1px,transparent_1px)] [background-size:38px_38px]" /><div className="relative"><div className="flex justify-between"><div><p className="text-xs text-white/40">{h.collective.mock.zone}</p><p className="mt-1 text-lg font-semibold">{h.collective.mock.residence}</p></div><span className="rounded-full bg-[#b8ff3d] px-3 py-1.5 text-xs font-bold text-[#07120f]">{h.collective.mock.level}</span></div><div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><p className="text-2xl font-semibold">12</p><p className="mt-1 text-xs text-white/40">{h.collective.mock.access}</p></div><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><p className="text-2xl font-semibold">28</p><p className="mt-1 text-xs text-white/40">{h.collective.mock.cameras}</p></div><div className="rounded-2xl border border-white/10 bg-white/7 p-4"><p className="text-2xl font-semibold">02</p><p className="mt-1 text-xs text-white/40">{h.collective.mock.patrols}</p></div></div><div className="mt-4 rounded-2xl bg-[#b8ff3d] p-4 text-[#07120f]"><div className="flex items-center justify-between"><div><p className="text-xs text-black/45">{h.collective.mock.lastEvent}</p><p className="mt-1 text-sm font-semibold">{h.collective.mock.visitor}</p></div><span className="text-xl">→</span></div></div></div></div></div></div>
      </section>

      <section className="bg-white px-5 py-24 lg:px-8 lg:py-32"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">{h.testimonials.eyebrow}</p><h2 className="section-title mt-5">{h.testimonials.title}</h2><p className="mt-5 text-sm leading-6 text-black/45">{h.testimonials.note}</p></div><div className="grid gap-4 sm:grid-cols-2">{h.testimonials.items.map((item, i) => <blockquote key={item.name} className={`rounded-[28px] p-7 ${i === 0 ? 'bg-[#f1f4f1]' : 'bg-[#b8ff3d]'}`}><p className="text-2xl leading-9 tracking-tight">{item.quote}</p><footer className="mt-8 text-sm"><strong>{item.name}</strong><span className="ml-2 text-black/40">{item.place}</span></footer></blockquote>)}</div></div></div></section>

      <section className="px-5 py-24 lg:px-8 lg:py-32"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{h.faq.eyebrow}</p><h2 className="section-title mt-5">{h.faq.title1}<br />{h.faq.title2}</h2><Link href="/support/faq" className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4">{h.faq.more}</Link></div><div className="divide-y divide-black/10 border-t border-black/10">{h.faq.items.map(([q, a]) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold"><span>{q}</span><span className="grid size-8 shrink-0 place-items-center rounded-full border border-black/10 group-open:rotate-45">+</span></summary><p className="max-w-2xl pr-10 pt-4 text-sm leading-6 text-black/50">{a}</p></details>)}</div></div></section>

      <section className="relative overflow-hidden bg-[#4556f5] px-5 py-20 text-white lg:px-8 lg:py-24"><div className="brand-grid absolute inset-0 opacity-25" /><div className="brand-cut absolute -bottom-20 right-[-10%] h-40 w-[55%] bg-[#52c6ff]" /><div className="relative mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-white/55">{h.cta.eyebrow}</p><h2 className="mt-5 max-w-4xl text-5xl font-light leading-[1] tracking-[-.05em] sm:text-6xl">{h.cta.title1}<br /><span className="font-semibold">{h.cta.title2}</span></h2></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/diagnostic" className="rounded-full bg-black px-7 py-4 text-center text-sm font-bold text-white">{d.common.assessment}</Link><a href={CONTACT_PHONE_HREF} className="rounded-full border border-white/30 px-7 py-4 text-center text-sm font-bold">{d.common.callAdvisor}</a></div></div></section>
      <SiteFooter />
    </main>
  );
}
