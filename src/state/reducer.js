import { blank, sample, TODAY } from './initialState.js';
import { uid, num } from '../lib/format.js';
import { pmt } from '../lib/calc.js';

const TOUCHING = new Set(['UPSERT_ASSET', 'DELETE_ASSET', 'UPSERT_LIAB', 'DELETE_LIAB', 'UPSERT_GOAL', 'DELETE_GOAL', 'SAVE_SNAPSHOT']);

export function reducer(S, action) {
  const next = apply(S, action);
  if (next !== S && TOUCHING.has(action.type) && next.isSample) return { ...next, isSample: false };
  return next;
}

function apply(S, action) {
  switch (action.type) {
    case 'SET_LANG':
      return { ...S, lang: action.lang };
    case 'SET_TAB':
      return { ...S, tab: action.tab };
    case 'SET_FIELD': {
      const [obj, key] = action.path.split('.');
      return { ...S, [obj]: { ...S[obj], [key]: action.value } };
    }
    case 'SET_TOTAL_INCOME':
      // The borrowing tab's income field is "total income"; it edits profile.income net of other income.
      return { ...S, profile: { ...S.profile, income: Math.max(0, num(action.value) - num(S.profile.otherIncome)) } };
    case 'SET_PURPOSE':
      return { ...S, borrow: { ...S.borrow, purpose: action.purpose, ...action.defaults } };
    case 'SAVE_SETTINGS':
      return { ...S, owner: action.owner, asOf: action.asOf || TODAY, currency: action.currency || 'THB' };
    case 'MARK_BACKED_UP':
      return { ...S, lastBackupAt: TODAY };
    case 'START_OWN':
      return Object.assign(blank(), { lang: S.lang, currency: S.currency, tab: 'assets' });
    case 'SAVE_SNAPSHOT': {
      const snapshots = S.snapshots.filter(s => s.date !== TODAY);
      snapshots.push({ date: TODAY, a: action.totalA, l: action.totalL });
      return { ...S, snapshots };
    }
    case 'UPSERT_ASSET': {
      const rec = { ...action.rec, id: action.rec.id || uid() };
      const i = S.assets.findIndex(x => x.id === rec.id);
      const assets = i >= 0 ? S.assets.map((a, idx) => (idx === i ? rec : a)) : [...S.assets, rec];
      return { ...S, assets };
    }
    case 'DELETE_ASSET':
      return { ...S, assets: S.assets.filter(x => x.id !== action.id) };
    case 'UPSERT_LIAB': {
      let payment = action.rec.payment;
      const rec = { ...action.rec, id: action.rec.id || uid() };
      if ((payment === '' || payment === undefined) && num(rec.months) > 0) payment = Math.round(pmt(num(rec.balance), num(rec.rate), num(rec.months)));
      rec.payment = num(payment);
      const i = S.liabilities.findIndex(x => x.id === rec.id);
      const liabilities = i >= 0 ? S.liabilities.map((l, idx) => (idx === i ? rec : l)) : [...S.liabilities, rec];
      return { ...S, liabilities };
    }
    case 'DELETE_LIAB':
      return { ...S, liabilities: S.liabilities.filter(x => x.id !== action.id) };
    case 'UPSERT_GOAL': {
      const rec = { ...action.rec, id: action.rec.id || uid() };
      const i = S.goals.findIndex(x => x.id === rec.id);
      const goals = i >= 0 ? S.goals.map((g, idx) => (idx === i ? rec : g)) : [...S.goals, rec];
      return { ...S, goals };
    }
    case 'DELETE_GOAL':
      return { ...S, goals: S.goals.filter(x => x.id !== action.id) };
    case 'LOAD_SAMPLE':
      return Object.assign(sample(), { lang: S.lang, currency: S.currency });
    case 'CLEAR_ALL':
      return Object.assign(blank(), { lang: S.lang });
    case 'RESTORE':
      return Object.assign(blank(), action.data, { v: 1, isSample: false });
    default:
      return S;
  }
}
