import { useState } from 'react';
import { useApp } from '../../state/AppContext.jsx';
import { useUi } from '../../state/UiContext.jsx';
import { num } from '../../lib/format.js';
import Field from '../Field.jsx';
import ConfirmButton from '../ConfirmButton.jsx';

export default function GoalForm({ sheet }) {
  const { S, fx, actions } = useApp();
  const { closeSheet, toast } = useUi();
  const existing = S.goals.find(x => x.id === sheet.id);
  const [f, setF] = useState(existing || { id: '', name: '', target: '', saved: '', date: (new Date().getFullYear() + 2) + '-01-01' });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const onSubmit = e => {
    e.preventDefault();
    actions.upsertGoal({ id: f.id, name: f.name, target: num(f.target), saved: num(f.saved), date: f.date });
    closeSheet();
    toast(fx.t('Saved', 'บันทึกแล้ว'));
  };

  const onDelete = () => {
    actions.deleteGoal(f.id);
    closeSheet();
    toast(fx.t('Deleted', 'ลบแล้ว'));
  };

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gap: 16 }}>
        <h2>{f.id ? fx.t('Edit goal', 'แก้ไขเป้าหมาย') : fx.t('Add goal', 'เพิ่มเป้าหมาย')}</h2>
        <div className="fields">
          <Field id="f-name" type="text" label={fx.t('Goal', 'เป้าหมาย')} value={f.name} onChange={v => set('name', v)} req ph={fx.t('e.g. Home down payment', 'เช่น เงินดาวน์บ้าน')} wide autoFocus />
          <Field id="f-target" label={fx.t('Target amount', 'จำนวนเงินเป้าหมาย')} value={f.target} onChange={v => set('target', v)} req />
          <Field id="f-saved" label={fx.t('Saved so far', 'ออมแล้ว')} value={f.saved} onChange={v => set('saved', v)} />
          <Field id="f-date" type="date" label={fx.t('Target date', 'วันที่ต้องการ')} value={f.date} onChange={v => set('date', v)} req />
        </div>
        <div className="sheet-foot">
          {f.id ? <ConfirmButton className="btn danger spacer" onConfirm={onDelete}>{fx.t('Delete', 'ลบ')}</ConfirmButton> : null}
          <button type="button" className="btn" onClick={closeSheet}>{fx.t('Cancel', 'ยกเลิก')}</button>
          <button type="submit" className="btn pri">{fx.t('Save', 'บันทึก')}</button>
        </div>
      </div>
    </form>
  );
}
