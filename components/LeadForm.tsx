'use client';

import { useState, type FormEvent } from 'react';
import { useI18n } from '@/lib/i18n/client';
import type { LeadType } from '@/lib/leads';

export type LeadField =
  | { name: 'name' | 'phone' | 'email' | 'organization'; label: string; placeholder?: string; required?: boolean; span?: boolean }
  | { name: 'subject' | 'projectType'; label: string; options: string[]; required?: boolean; span?: boolean }
  | { name: 'message'; label: string; placeholder?: string; required?: boolean; span?: boolean };

type Props = {
  type: LeadType;
  fields: LeadField[];
  submitLabel: string;
  consentLabel: string;
  source?: string;
  tone?: 'light' | 'dark';
  className?: string;
};

type State = { kind: 'idle' | 'loading' | 'success' | 'error'; message?: string };

export default function LeadForm({ type, fields, submitLabel, consentLabel, source, tone = 'light', className = '' }: Props) {
  const { d, locale } = useI18n();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const input = tone === 'dark' ? 'mt-2 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3.5 font-normal text-white outline-none focus:border-[#52c6ff]' : 'mt-2 w-full rounded-2xl border border-black/10 bg-[#f5f7f5] px-4 py-3.5 font-normal outline-none focus:border-[#4556f5]';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {};
    for (const [key, value] of data.entries()) if (!['name', 'phone', 'email', 'organization', 'subject', 'message', 'consent', 'website'].includes(key)) payload[key] = value;
    setState({ kind: 'loading', message: d.common.sending });
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name: data.get('name'), phone: data.get('phone'), email: data.get('email') || undefined, organization: data.get('organization') || undefined, subject: data.get('subject') || undefined, message: data.get('message') || undefined, consent: data.get('consent') === 'on', website: data.get('website') || '', locale, source: source ?? (typeof location !== 'undefined' ? location.pathname : undefined), payload }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        const message = result.error === 'phone' ? d.common.invalidPhone : result.error === 'email' ? d.common.invalidEmail : result.error === 'consent' ? d.common.consentRequired : d.common.formError;
        setState({ kind: 'error', message });
        return;
      }
      form.reset();
      setState({ kind: 'success', message: d.common.formSuccess });
    } catch {
      setState({ kind: 'error', message: d.common.formError });
    }
  }

  return (
    <form onSubmit={submit} className={`grid gap-4 sm:grid-cols-2 ${className}`} noValidate={false}>
      {fields.map((field) => {
        const span = field.span ? 'sm:col-span-2' : '';
        if (field.name === 'message') return <label key={field.name} className={`text-sm font-semibold ${span || 'sm:col-span-2'}`}>{field.label}<textarea name="message" required={field.required} maxLength={2000} placeholder={field.placeholder} className={`${input} min-h-28`} /></label>;
        if (field.name === 'subject' || field.name === 'projectType') return <label key={field.name} className={`text-sm font-semibold ${span}`}>{field.label}<select name={field.name === 'projectType' ? 'projectType' : 'subject'} required={field.required} className={input}>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
        if (field.name === 'name' || field.name === 'phone' || field.name === 'email' || field.name === 'organization') {
        const inputType = field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : 'text';
          return <label key={field.name} className={`text-sm font-semibold ${span}`}>{field.label}{field.required ? ' *' : ''}<input name={field.name} type={inputType} inputMode={field.name === 'phone' ? 'tel' : undefined} required={field.required} maxLength={160} placeholder={field.placeholder} autoComplete={field.name === 'name' ? 'name' : field.name === 'phone' ? 'tel' : field.name === 'email' ? 'email' : 'organization'} className={input} /></label>;
        }
        return null;
      })}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className={`flex items-start gap-3 text-xs leading-5 sm:col-span-2 ${tone === 'dark' ? 'text-white/70' : 'text-black/55'}`}><input name="consent" type="checkbox" required className="mt-1 size-4 accent-[#4556f5]" /><span>{consentLabel}</span></label>
      <button type="submit" disabled={state.kind === 'loading'} className={`rounded-full px-6 py-4 text-sm font-bold disabled:opacity-50 sm:col-span-2 ${tone === 'dark' ? 'bg-[#52c6ff] text-black' : 'bg-[#07120f] text-white'}`}>{state.kind === 'loading' ? d.common.sending : submitLabel}</button>
      {state.message && <p role="status" className={`sm:col-span-2 rounded-2xl p-4 text-sm ${state.kind === 'success' ? 'bg-[#e9f8dc] text-[#17330b]' : state.kind === 'error' ? 'bg-[#fff0ed] text-[#6b1b0e]' : 'bg-[#e7f7ff] text-[#183e68]'}`}>{state.message}</p>}
    </form>
  );
}
