import { useState } from 'react';
import { useApp } from '../../state/AppContext.jsx';
import { useUi } from '../../state/UiContext.jsx';
import { LCATS } from '../../lib/categories.js';
import { num } from '../../lib/format.js';
import Field from '../Field.jsx';
import CatSelect from '../CatSelect.jsx';
import ConfirmButton from '../ConfirmButton.jsx';

export default function LiabilityForm({ sheet }) {
  const { S, fx, actions } = useApp();
  const { closeSheet, toast } = useUi();
  const existing = S.liabilities.find(x => x.id === sheet.id);
  const [f, setF] = useState(existing || { id: '', cat: sheet.cat || 'card', name: '', balance: '', rate: '', payment: '', months: '', lender: '', note: '' });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const onSubmit = e => {
    e.preventDefault();
    actions.upsertLiability({
      id: f.id,
      cat: f.cat,
      name: f.name,
      balance: num(f.balance),
      rate: num(f.rate),
      payment: f.payment === '' ? '' : num(f.payment),
      months: f.months === '' ? '' : num(f.months),
      lender: f.lender,
      note: f.note
    });
    closeSheet();
    toast(fx.t('Saved', 'บันทึกแล้ว'));
  };

  const onDelete = () => {
    actions.deleteLiability(f.id);
    closeSheet();
    toast(fx.t('Deleted', 'ลบแล้ว'));
  };

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gap: 16 }}>
        <h2>{f.id ? fx.t('Edit liability', 'แก้ไขหนี้สิน') : fx.t('Add liability', 'เพิ่มหนี้สิน')}</h2>
        <div className="fields">
          <CatSelect id="f-cat" label={fx.t('Type', 'ประเภท')} cats={LCATS} value={f.cat} onChange={v => set('cat', v)} kind="l" />
          <Field id="f-name" type="text" label={fx.t('Name', 'ชื่อรายการ')} value={f.name} onChange={v => set('name', v)} ph={fx.t('e.g. Home loan', 'เช่น สินเชื่อบ้าน')} wide autoFocus />
          <Field id="f-balance" label={fx.t('Outstanding balance', 'ยอดหนี้คงค้าง')} value={f.balance} onChange={v => set('balance', v)} req />
          <Field id="f-rate" label={fx.t('Interest rate (% / yr)', 'อัตราดอกเบี้ย (% ต่อปี)')} value={f.rate} onChange={v => set('rate', v)} />
          <Field id="f-payment" label={fx.t('Monthly payment', 'ค่างวดต่อเดือน')} value={f.payment} onChange={v => set('payment', v)} hint={fx.t('Leave blank to estimate from rate and months', 'เว้นว่างเพื่อคำนวณจากดอกเบี้ยและจำนวนเดือน')} />
          <Field id="f-months" label={fx.t('Months remaining', 'จำนวนเดือนที่เหลือ')} value={f.months} onChange={v => set('months', v)} hint={fx.t('Optional', 'ไม่บังคับ')} />
          <Field id="f-lender" type="text" label={fx.t('Lender', 'ผู้ให้กู้')} value={f.lender} onChange={v => set('lender', v)} />
          <Field id="f-note" type="text" label={fx.t('Notes', 'หมายเหตุ')} value={f.note} onChange={v => set('note', v)} />
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
