'use client';

import Link from '@/components/Link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { fmt } from '@/lib/i18n/config';
import { formatXof } from '@/lib/catalog';
import { isPackId, packMonthlyXof, type PackId } from '@/lib/packs';

type Contact = { name: string; phone: string; email: string; consent: boolean };

function recommend(type: string, needs: string[], accessIndex: number, areaIndex: number, preselected?: PackId): PackId {
  if (preselected) return preselected;
  if (type === 'Résidence / quartier' || areaIndex === 2 || accessIndex === 2 || needs.includes('access') && needs.includes('comfort') && needs.includes('video')) return 'signature';
  if (needs.includes('video') || needs.includes('fire') || needs.includes('patrol') || type === 'Villa' || type === 'Commerce / bureau') return 'serenite';
  return 'essentiel';
}

function Wizard() {
  const { d, locale } = useI18n();
  const t = d.diagnostic;
  const params = useSearchParams();
  const preselected = isPackId(params.get('pack')) ? (params.get('pack') as PackId) : undefined;
  const selection = params.get('selection') ?? '';
  const option = params.get('option') ?? '';

  const [step, setStep] = useState(1);
  const [typeIndex, setTypeIndex] = useState(1);
  const [commune, setCommune] = useState('');
  const [needs, setNeeds] = useState<string[]>(option === 'camera-exterieure' || option === 'sonnette-video' ? ['video'] : option === 'detection-incendie' ? ['intrusion', 'fire'] : ['intrusion', 'video']);
  const [details, setDetails] = useState({ access: 0, area: 1, occupancy: 0, existing: 0 });
  const [contact, setContact] = useState<Contact>({ name: '', phone: '', email: '', consent: true });
  const [submitted, setSubmitted] = useState(false);
  const [slot, setSlot] = useState(0);
  const [leadState, setLeadState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [slotState, setSlotState] = useState<'idle' | 'ok'>('idle');
  const [quoteRequested, setQuoteRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeKeys = ['Appartement', 'Villa', 'Commerce / bureau', 'Résidence / quartier'];
  const pack = useMemo(() => recommend(typeKeys[typeIndex], needs, details.access, details.area, preselected), [typeIndex, needs, details.access, details.area, preselected]); // eslint-disable-line react-hooks/exhaustive-deps
  const packCopy = d.offers.packs[pack];
  const monthly = packMonthlyXof[pack];
  const toggle = (id: string) => setNeeds((value) => value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  const progress = submitted ? 100 : step * 25;

  async function sendLead(kind: 'diagnostic' | 'quote' | 'callback', extra: Record<string, unknown> = {}) {
    setLeadState('sending');
    setError(null);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: kind, name: contact.name, phone: contact.phone, email: contact.email || undefined, consent: contact.consent, locale, source: '/diagnostic', subject: packCopy.name, payload: { type: typeKeys[typeIndex], commune, needs, access: t.step3.accessOptions[details.access], area: t.step3.areaOptions[details.area], occupancy: t.step3.occupancyOptions[details.occupancy], existing: t.step3.existingOptions[details.existing], pack, selection, option, ...extra } }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) { setError(result.error === 'phone' ? d.common.invalidPhone : result.error === 'email' ? d.common.invalidEmail : result.error === 'consent' ? d.common.consentRequired : d.common.formError); setLeadState('error'); return false; }
      setLeadState('ok');
      return true;
    } catch { setError(d.common.formError); setLeadState('error'); return false; }
  }

  async function finish() {
    if (!contact.name || !contact.phone) { setError(d.common.invalidPhone); return; }
    if (!contact.consent) { setError(d.common.consentRequired); return; }
    const ok = await sendLead('diagnostic');
    if (ok) setSubmitted(true);
  }

  const input = 'mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f9f7] px-4 py-3.5 font-normal outline-none focus:border-[#78a91e]';

  if (submitted) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-[30px] bg-white p-6 shadow-sm sm:p-9">
          <span className="grid size-14 place-items-center rounded-full bg-[#b8ff3d] text-2xl">✓</span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.14em] text-[#669516]">{t.result.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-[-.04em]">{fmt(t.result.title, { pack: packCopy.name })}</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-black/50">{fmt(t.result.text, { type: t.types[typeIndex].toLowerCase(), count: needs.length })}</p>
          <div className="mt-8 rounded-2xl bg-[#f1f4f1] p-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-black/45">{t.result.from}</p><p className="mt-1 text-3xl font-semibold">{monthly ? <>{formatXof(monthly, locale)} <span className="text-sm">{t.result.perMonth}</span></> : d.common.onQuote}</p></div><p className="text-xs text-black/40">{t.result.installNote}</p></div></div>
          {selection && <div className="mt-5 rounded-2xl border border-black/10 p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-black/45">{t.result.selectionTitle}</p><p className="mt-2 text-sm leading-6">{decodeURIComponent(selection)}</p></div>}
          <p className="mt-6 text-sm leading-6 text-[#17330b]">{t.result.saved}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={async () => { const ok = await sendLead('quote', { requested: 'quote' }); if (ok) setQuoteRequested(true); }} disabled={leadState === 'sending' || quoteRequested} className="rounded-full bg-[#0b1d17] px-6 py-4 text-sm font-bold text-white disabled:opacity-50">{quoteRequested ? t.result.quoteSent : t.result.quote}</button><Link href={`/offres/${pack}`} className="rounded-full border border-black/10 px-6 py-4 text-center text-sm font-bold">{t.result.compare}</Link></div>
        </section>
        <aside className="rounded-[30px] bg-[#0b1d17] p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">{t.result.nextEyebrow}</p><h2 className="mt-4 text-2xl font-semibold">{t.result.nextTitle}</h2><p className="mt-3 text-sm leading-6 text-white/50">{t.result.nextText}</p>
          <div className="mt-7 grid gap-3">{t.result.slots.map((date, i) => <button key={date} type="button" onClick={() => setSlot(i)} aria-pressed={slot === i} className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm ${slot === i ? 'border-[#b8ff3d] bg-[#b8ff3d]/10' : 'border-white/10'}`}><span>{date}</span><span className={`size-4 rounded-full border ${slot === i ? 'border-4 border-[#b8ff3d]' : 'border-white/30'}`} /></button>)}</div>
          <button type="button" onClick={async () => { const ok = await sendLead('callback', { slot: t.result.slots[slot] }); if (ok) setSlotState('ok'); }} disabled={slotState === 'ok' || leadState === 'sending'} className="mt-6 w-full rounded-full bg-[#b8ff3d] px-6 py-4 text-sm font-bold text-[#07120f] disabled:opacity-70">{slotState === 'ok' ? t.result.confirmed : t.result.confirm}</button>
          {error && <p role="alert" className="mt-4 rounded-2xl bg-[#fff0ed] p-3 text-xs text-[#6b1b0e]">{error}</p>}
          <p className="mt-5 text-center text-xs text-white/35">{t.result.payment}</p>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_310px]">
      <section className="rounded-[30px] bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-9"><div className="flex items-center justify-between text-xs font-semibold"><span>{fmt(t.stepOf, { step, total: 4 })}</span><span className="text-black/35">{t.duration}</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-black/8"><div className="h-full rounded-full bg-[#77a81d] transition-all" style={{ width: `${progress}%` }} /></div></div>
        {step === 1 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">{t.step1.eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{t.step1.title}</h1><p className="mt-3 text-sm text-black/45">{t.step1.text}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{t.types.map((item, i) => <button key={item} type="button" onClick={() => setTypeIndex(i)} aria-pressed={typeIndex === i} className={`rounded-2xl border p-5 text-left transition ${typeIndex === i ? 'border-[#78a91e] bg-[#b8ff3d]/15' : 'border-black/10 hover:border-black/25'}`}><span className="text-2xl">{['▤', '⌂', '▦', '◇'][i]}</span><p className="mt-5 font-semibold">{item}</p></button>)}</div><label className="mt-6 block text-sm font-semibold">{t.step1.commune}<input value={commune} onChange={(e) => setCommune(e.target.value)} className={input} placeholder={t.step1.communePlaceholder} /></label></div>}
        {step === 2 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">{t.step2.eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{t.step2.title}</h1><p className="mt-3 text-sm text-black/45">{t.step2.text}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{t.needs.map(([id, title, desc]) => { const active = needs.includes(id); return <button key={id} type="button" onClick={() => toggle(id)} aria-pressed={active} className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${active ? 'border-[#78a91e] bg-[#b8ff3d]/15' : 'border-black/10 hover:border-black/25'}`}><span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs ${active ? 'border-[#78a91e] bg-[#b8ff3d]' : 'border-black/15'}`}>{active ? '✓' : ''}</span><span><strong className="text-sm">{title}</strong><span className="mt-1 block text-xs leading-5 text-black/40">{desc}</span></span></button>; })}</div></div>}
        {step === 3 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">{t.step3.eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{t.step3.title}</h1><div className="mt-8 grid gap-5 sm:grid-cols-2">{([['access', t.step3.access, t.step3.accessOptions], ['area', t.step3.area, t.step3.areaOptions], ['occupancy', t.step3.occupancy, t.step3.occupancyOptions], ['existing', t.step3.existing, t.step3.existingOptions]] as [keyof typeof details, string, string[]][]).map(([key, label, options]) => <label key={key} className="text-sm font-semibold">{label}<select value={details[key]} onChange={(e) => setDetails((v) => ({ ...v, [key]: Number(e.target.value) }))} className={input}>{options.map((o, i) => <option key={o} value={i}>{o}</option>)}</select></label>)}</div></div>}
        {step === 4 && <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#669516]">{t.step4.eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{t.step4.title}</h1><p className="mt-3 text-sm text-black/45">{t.step4.text}</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">{t.step4.name}<input required value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={input} placeholder={t.step4.namePlaceholder} autoComplete="name" /></label><label className="text-sm font-semibold">{t.step4.phone}<input required type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={input} placeholder={t.step4.phonePlaceholder} autoComplete="tel" /></label><label className="text-sm font-semibold sm:col-span-2">{t.step4.email}<input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={input} placeholder={t.step4.emailPlaceholder} autoComplete="email" /></label></div><label className="mt-6 flex items-start gap-3 text-xs leading-5 text-black/45"><input type="checkbox" checked={contact.consent} onChange={(e) => setContact({ ...contact, consent: e.target.checked })} className="mt-1 accent-[#78a91e]" />{t.step4.consent}</label>{error && <p role="alert" className="mt-4 rounded-2xl bg-[#fff0ed] p-3 text-xs text-[#6b1b0e]">{error}</p>}</div>}
        <div className="mt-10 flex items-center justify-between border-t border-black/8 pt-6"><button type="button" onClick={() => setStep(Math.max(1, step - 1))} className={`text-sm font-semibold ${step === 1 ? 'invisible' : ''}`}>{d.common.back}</button><button type="button" disabled={leadState === 'sending' || (step === 2 && needs.length === 0)} onClick={() => step < 4 ? setStep(step + 1) : finish()} className="rounded-full bg-[#0b1d17] px-7 py-3.5 text-sm font-bold text-white disabled:opacity-50">{step === 4 ? (leadState === 'sending' ? d.common.sending : t.seeRecommendation) : t.next}</button></div>
      </section>
      <aside className="h-fit rounded-[28px] bg-[#0b1d17] p-6 text-white lg:sticky lg:top-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#b8ff3d]">{t.aside.eyebrow}</p><h2 className="mt-4 text-xl font-semibold">{t.aside.title}</h2><ul className="mt-6 space-y-4 text-sm text-white/60">{t.aside.bullets.map((b) => <li key={b} className="flex gap-3"><span className="text-[#b8ff3d]">✓</span>{b}</li>)}</ul>{preselected && <p className="mt-6 rounded-2xl bg-white/8 p-4 text-xs text-white/70">{packCopy.name}</p>}<div className="mt-8 border-t border-white/10 pt-6"><p className="text-xs text-white/35">{t.aside.help}</p><a href={d.common.phoneHref} className="mt-1 block text-sm font-semibold">{d.common.phoneDisplay}</a></div></aside>
    </div>
  );
}

export default function DiagnosticWizard() {
  return <Suspense fallback={<div className="min-h-[400px]" aria-busy="true" />}><Wizard /></Suspense>;
}
