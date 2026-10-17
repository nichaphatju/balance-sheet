export const uid = () => Math.random().toString(36).slice(2, 10);

export const num = v => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isFinite(n) ? n : 0;
};

export const loc = lang => (lang === 'th' ? 'th-TH' : 'en-US');

export function money(lang, currency, n, compact) {
  try {
    return new Intl.NumberFormat(loc(lang), {
      style: 'currency',
      currency,
      maximumFractionDigits: compact ? 1 : 0,
      notation: compact ? 'compact' : 'standard'
    }).format(n || 0);
  } catch (e) {
    return currency + ' ' + Math.round(n || 0).toLocaleString();
  }
}

export const pct = (x, d = 0) => (isFinite(x) ? (x * 100).toFixed(d) + '%' : '–');

export function fdate(lang, d) {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString(loc(lang), { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return d;
  }
}

export function monthsUntil(d) {
  const t = new Date(d + 'T00:00:00'), n = new Date();
  return Math.max(1, (t.getFullYear() - n.getFullYear()) * 12 + (t.getMonth() - n.getMonth()));
}
