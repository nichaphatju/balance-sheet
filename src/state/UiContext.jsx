import { createContext, useCallback, useContext, useRef, useState } from 'react';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [sheet, setSheet] = useState(null); // { kind, id?, cat? }
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const openAsset = useCallback((id, cat) => setSheet({ kind: 'asset', id, cat }), []);
  const openLiability = useCallback((id, cat) => setSheet({ kind: 'liability', id, cat }), []);
  const openGoal = useCallback(id => setSheet({ kind: 'goal', id }), []);
  const openSettings = useCallback(() => setSheet({ kind: 'settings' }), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const toast = useCallback(msg => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const value = { sheet, openAsset, openLiability, openGoal, openSettings, closeSheet, toast, toastMsg };
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
