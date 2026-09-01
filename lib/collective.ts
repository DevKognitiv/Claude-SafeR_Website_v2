export const segmentOrder = ['residences', 'quartiers', 'campus', 'collectivites'] as const;
export type SegmentId = (typeof segmentOrder)[number];
export function isSegmentId(value: string): value is SegmentId {
  return (segmentOrder as readonly string[]).includes(value);
}
export const segmentIcons: Record<SegmentId, string> = { residences: '⌂', quartiers: '◎', campus: '▦', collectivites: '◈' };
