import { useEffect } from 'react';
import { useUi } from '../state/UiContext.jsx';
import AssetForm from './forms/AssetForm.jsx';
import LiabilityForm from './forms/LiabilityForm.jsx';
import GoalForm from './forms/GoalForm.jsx';
import SettingsForm from './forms/SettingsForm.jsx';

const FORMS = {
  asset: AssetForm,
  liability: LiabilityForm,
  goal: GoalForm,
  settings: SettingsForm
};

export default function Sheet() {
  const { sheet, closeSheet } = useUi();

  useEffect(() => {
    if (!sheet) return;
    const onKey = e => { if (e.key === 'Escape') closeSheet(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sheet, closeSheet]);

  if (!sheet) return null;
  const Form = FORMS[sheet.kind];
  if (!Form) return null;

  return (
    <div className="sheet" onClick={e => { if (e.target === e.currentTarget) closeSheet(); }}>
      <div className="sheet-card" role="dialog" aria-modal="true">
        <Form sheet={sheet} />
      </div>
    </div>
  );
}
