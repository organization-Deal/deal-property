export const PROJECT = {
  name: 'Human Allowed Rimping',
  path: '/projects/human-allowed-chiang-mai',
  fullPrice: 1712000,
  startingPrice: 171200,
  managementPercent: 30,
  remainingPercent: 60,
  company: 'บริษัท ดีลอินเวส จำกัด',
  updated: '2026-10-11',
  updatedLabel: '11 ตุลาคม 2569',
} as const;

export type Interest = {
  message?: string;
  ownership?: 'co-owner' | 'whole' | 'undecided';
  purpose?: 'details' | 'visit' | 'plans';
  sharePct?: number;
  shareInvalid?: boolean;
};

export function validShare(value: number) {
  return Number.isFinite(value) && value >= 10 && value <= 100 && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;
}

export function parseShare(value: string) {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value.trim())) return null;
  const number = Number(value.trim().replace(',', '.'));
  return validShare(number) ? number : null;
}

export function ownershipPrice(ownership?: Interest['ownership'], sharePct = 10) {
  if (ownership === 'whole') return PROJECT.fullPrice;
  if (!validShare(sharePct)) throw new RangeError('Share must be between 10 and 100 with at most two decimals');
  return Math.round(PROJECT.fullPrice * sharePct) / 100;
}

export const money = (value: number) => new Intl.NumberFormat('th-TH').format(value);
