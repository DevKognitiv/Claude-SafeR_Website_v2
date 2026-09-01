'use client';

import { useState, type FormEvent } from 'react';
import { useI18n } from '@/lib/i18n/client';
import { interventionZones, partnerSkills } from '@/lib/partner-verification';

type SubmissionState = { kind: 'idle' | 'loading' | 'success' | 'error'; message?: string };

export default function PartnerApplicationForm({ defaultName, defaultEmail }: { defaultName: string; defaultEmail: string }) {
  const { d } = useI18n();
  const f = d.partners.apply.form;
  const skillLabels = d.partners.apply.skills;
  const zoneLabels = d.partners.apply.zones;
  const [state, setState] = useState<SubmissionState>({ kind: 'idle' });
  const [skills, setSkills] = useState<string[]>([]);
  const [zones, setZones] = useState<string[]>([]);

  function toggle(value: string, selected: string[], update: (items: string[]) => void) {
    update(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: 'loading', message: f.transmitting });
    const form = new FormData(event.currentTarget);
    const payload = {
      legalName: form.get('legalName'), tradeName: form.get('tradeName'), phone: form.get('phone'), commune: form.get('commune'),
      professionalType: form.get('professionalType'), companyRegistration: form.get('companyRegistration'), experienceYears: form.get('experienceYears'),
      skills, zones, acceptedCode: form.get('acceptedCode') === 'on', consent: form.get('consent') === 'on',
    };
    try {
      const profileResponse = await fetch('/api/partners/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const profileResult = await profileResponse.json() as { error?: string };
      if (!profileResponse.ok) throw new Error(profileResult.error || f.profileError);
      const document = form.get('document');
      if (document instanceof File && document.size > 0) {
        const upload = new FormData();
        upload.set('document', document);
        const uploadResponse = await fetch('/api/partners/kyc', { method: 'POST', body: upload });
        const uploadResult = await uploadResponse.json() as { error?: string };
        if (!uploadResponse.ok) throw new Error(uploadResult.error || f.documentError);
      }
      setState({ kind: 'success', message: f.success });
    } catch (error) {
      setState({ kind: 'error', message: error instanceof Error ? error.message : f.genericError });
    }
  }

  const input = 'mt-2 w-full rounded-2xl border border-black/10 bg-[#f3f5fb] px-4 py-3.5 font-normal outline-none focus:border-[#4556f5]';

  return <form onSubmit={submit} className="grid gap-5 rounded-[32px] border border-black/8 bg-white p-6 sm:p-8">
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{f.candidate}<input value={defaultName} readOnly className={`${input} opacity-70`} /></label><label className="text-sm font-semibold">{f.email}<input value={defaultEmail} readOnly className={`${input} opacity-70`} /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{f.legalName}<input name="legalName" required maxLength={120} className={input} /></label><label className="text-sm font-semibold">{f.tradeName}<input name="tradeName" maxLength={120} className={input} /></label></div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{f.phone}<input name="phone" required inputMode="tel" maxLength={32} placeholder={f.phonePlaceholder} className={input} /></label><label className="text-sm font-semibold">{f.commune}<input name="commune" required maxLength={80} placeholder={f.communePlaceholder} className={input} /></label></div>
    <div className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-semibold sm:col-span-2">{f.professionalType}<select name="professionalType" required className={input}><option value="">{f.choose}</option><option value="independent">{f.independent}</option><option value="company">{f.company}</option><option value="employee">{f.employee}</option></select></label><label className="text-sm font-semibold">{f.experience}<input name="experienceYears" type="number" min="0" max="50" defaultValue="0" className={input} /></label></div>
    <label className="text-sm font-semibold">{f.registration} <span className="font-normal text-black/45">{f.registrationHint}</span><input name="companyRegistration" maxLength={80} className={input} /></label>
    <fieldset><legend className="text-sm font-semibold">{f.skills}</legend><div className="mt-3 flex flex-wrap gap-2">{partnerSkills.map((skill, i) => <label key={skill} className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition ${skills.includes(skill) ? 'border-[#4556f5] bg-[#4556f5] text-white' : 'border-black/10'}`}><input type="checkbox" className="sr-only" checked={skills.includes(skill)} onChange={() => toggle(skill, skills, setSkills)} />{skillLabels[i] ?? skill}</label>)}</div></fieldset>
    <fieldset><legend className="text-sm font-semibold">{f.zones}</legend><div className="mt-3 flex flex-wrap gap-2">{interventionZones.map((zone, i) => <label key={zone} className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition ${zones.includes(zone) ? 'border-[#4556f5] bg-[#4556f5] text-white' : 'border-black/10'}`}><input type="checkbox" className="sr-only" checked={zones.includes(zone)} onChange={() => toggle(zone, zones, setZones)} />{zoneLabels[i] ?? zone}</label>)}</div></fieldset>
    <label className="rounded-2xl border border-dashed border-black/20 bg-[#f3f5fb] p-5 text-sm font-semibold">{f.document} <span className="block pt-1 text-xs font-normal text-black/48">{f.documentHint}</span><input name="document" type="file" accept="application/pdf,image/jpeg,image/png" className="mt-4 block w-full text-xs" /></label>
    <label className="flex items-start gap-3 text-xs leading-5"><input name="acceptedCode" type="checkbox" required className="mt-1 size-4 accent-[#4556f5]" /><span>{f.acceptCode}</span></label>
    <label className="flex items-start gap-3 text-xs leading-5"><input name="consent" type="checkbox" required className="mt-1 size-4 accent-[#4556f5]" /><span>{f.consent}</span></label>
    <button disabled={state.kind === 'loading' || skills.length === 0 || zones.length === 0} className="rounded-full bg-[#4556f5] px-7 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">{state.kind === 'loading' ? f.sending : f.submit}</button>
    {state.message && <p role="status" className={`partner-feedback rounded-2xl p-4 text-sm ${state.kind === 'success' ? 'bg-[#e9f8dc] text-[#17330b]' : state.kind === 'error' ? 'bg-[#fff0ed] text-[#6b1b0e]' : 'bg-[#e7f7ff] text-[#183e68]'}`}>{state.message}</p>}
  </form>;
}
