import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { reducer } from './reducer.js';
import { sample, load, persist, TODAY } from './initialState.js';
import { calc, suggestions, borrowCalc } from '../lib/calc.js';
import { money, pct, fdate, monthsUntil } from '../lib/format.js';
import { TABS } from '../lib/tabs.js';

const AppContext = createContext(null);

function initialState() {
  const S = load() || sample();
  const h = (location.hash || '').slice(1);
  if (TABS.some(t => t[0] === h)) return { ...S, tab: h };
  return S;
}

export function AppProvider({ children }) {
  const [S, dispatch] = useReducer(reducer, null, initialState);

  useEffect(() => { persist(S); }, [S]);
  useEffect(() => {
    document.documentElement.lang = S.lang;
    try { if (location.hash.slice(1) !== S.tab) history.replaceState(null, '', '#' + S.tab); } catch (e) { /* ignore */ }
  }, [S.lang, S.tab]);

  const C = useMemo(() => calc(S), [S]);

  const fx = useMemo(() => ({
    t: (en, th) => (S.lang === 'th' ? th : en),
    nm: arr => arr[S.lang === 'th' ? 1 : 0],
    money: (n, compact) => money(S.lang, S.currency, n, compact),
    pct,
    fdate: d => fdate(S.lang, d),
    monthsUntil
  }), [S.lang, S.currency]);

  const actions = useMemo(() => ({
    setLang: lang => dispatch({ type: 'SET_LANG', lang }),
    setTab: tab => dispatch({ type: 'SET_TAB', tab }),
    setField: (path, value) => dispatch({ type: 'SET_FIELD', path, value }),
    setTotalIncome: value => dispatch({ type: 'SET_TOTAL_INCOME', value }),
    setPurpose: (purpose, defaults) => dispatch({ type: 'SET_PURPOSE', purpose, defaults }),
    saveSettings: (owner, asOf, currency) => dispatch({ type: 'SAVE_SETTINGS', owner, asOf, currency }),
    startOwn: () => dispatch({ type: 'START_OWN' }),
    saveSnapshot: () => dispatch({ type: 'SAVE_SNAPSHOT', totalA: C.totalA, totalL: C.totalL }),
    upsertAsset: rec => dispatch({ type: 'UPSERT_ASSET', rec }),
    deleteAsset: id => dispatch({ type: 'DELETE_ASSET', id }),
    upsertLiability: rec => dispatch({ type: 'UPSERT_LIAB', rec }),
    deleteLiability: id => dispatch({ type: 'DELETE_LIAB', id }),
    upsertGoal: rec => dispatch({ type: 'UPSERT_GOAL', rec }),
    deleteGoal: id => dispatch({ type: 'DELETE_GOAL', id }),
    loadSample: () => dispatch({ type: 'LOAD_SAMPLE' }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
    restore: data => dispatch({ type: 'RESTORE', data })
  }), [C.totalA, C.totalL]);

  const sugs = useMemo(() => suggestions(S, C), [S, C]);
  const borrow = useMemo(() => borrowCalc(S, C), [S, C]);
  const borrowWith = useMemo(() => (B => borrowCalc(S, C, B)), [S, C]);

  const value = useMemo(() => ({ S, C, fx, actions, sugs, borrow, borrowWith, TODAY }), [S, C, fx, actions, sugs, borrow, borrowWith]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
