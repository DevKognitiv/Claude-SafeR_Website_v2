export const packOrder = ['essentiel', 'serenite', 'signature'] as const;
export type PackId = (typeof packOrder)[number];

export function isPackId(value: string | undefined | null): value is PackId {
  return !!value && (packOrder as readonly string[]).includes(value);
}

/** Monthly price in XOF for packs with a fixed price; Signature is on quote. */
export const packMonthlyXof: Record<PackId, number | null> = { essentiel: 19900, serenite: 34900, signature: null };

export const optionOrder = ['camera-exterieure', 'sonnette-video', 'portail-connecte', 'detection-incendie', 'pilotage-energie', 'bouton-urgence'] as const;
export type OptionId = (typeof optionOrder)[number];
export function isOptionId(value: string): value is OptionId {
  return (optionOrder as readonly string[]).includes(value);
}
