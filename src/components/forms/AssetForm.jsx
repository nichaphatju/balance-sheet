import { useState } from 'react';
import { useApp } from '../../state/AppContext.jsx';
import { useUi } from '../../state/UiContext.jsx';
import { ACATS, acat } from '../../lib/categories.js';
import { num } from '../../lib/format.js';
import Field from '../Field.jsx';
import CatSelect from '../CatSelect.jsx';
import ConfirmButton from '../ConfirmButton.jsx';

export default function AssetForm({ sheet }) {
  const { S, fx, actions } = useApp();
  const { closeSheet, toast } = useUi();
  const existing = S.assets.find(x => x.id === sheet.id);
  const [f, setF] = useState(existing || { id: '', cat: sheet.cat || 'cash', name: '', value: '', cost: '', rate: '', inst: '', note: '' });
  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const g = acat(f.cat).g;

  const onSubmit = e => {
    e.preventDefault();
    actions.upsertAsset({
      id: f.id,
      cat: f.cat,
      name: f.name,
      value: num(f.value),
      cost: f.cost === '' ? '' : num(f.cost),
      rate: f.rate === '' ? '' : num(f.rate),
      inst: f.inst,
      note: f.note
    });
    closeSheet();
    toast(fx.t('Saved', 'บันทึกแล้ว'));
  };

  const onDelete = () => {
    actions.deleteAsset(f.id);
    closeSheet();
    toast(fx.t('Deleted', 'ลบแล้ว'));
  };

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gap: 16 }}>
        <h2>{f.id ? fx.t('Edit asset', 'แก้ไขสินทรัพย์') : fx.t('Add asset', 'เพิ่มสินทรัพย์')}</h2>
        <div className="fields">
          <CatSelect id="f-cat" label={fx.t('Type', 'ประเภท')} cats={ACATS} value={f.cat} onChange={v => set('cat', v)} kind="a" />
          <Field id="f-name" type="text" label={fx.t('Name', 'ชื่อรายการ')} value={f.name} onChange={v => set('name', v)} ph={fx.t('e.g. Savings account', 'เช่น บัญชีออมทรัพย์')} wide autoFocus />
          <Field id="f-value" label={fx.t('Current market value', 'มูลค่าตลาดปัจจุบัน')} value={f.value} onChange={v => set('value', v)} req hint={fx.t('What you could sell it for today', 'ราคาที่ขายได้วันนี้')} />
          <Field id="f-cost" label={fx.t('Cost (what you paid)', 'ต้นทุน (ราคาที่ซื้อ)')} value={f.cost} onChange={v => set('cost', v)} hint={fx.t('Optional, shows gain or loss', 'ไม่บังคับ ใช้แสดงกำไรขาดทุน')} />
          <Field id="f-rate" label={g === 'liquid' ? fx.t('Interest rate (% / yr)', 'อัตราดอกเบี้ย (% ต่อปี)') : fx.t('Expected return (% / yr)', 'ผลตอบแทนคาดหวัง (% ต่อปี)')} value={f.rate} onChange={v => set('rate', v)} hint={fx.t('Optional', 'ไม่บังคับ')} />
          <Field id="f-inst" type="text" label={fx.t('Where it is held', 'สถาบันหรือที่ตั้ง')} value={f.inst} onChange={v => set('inst', v)} ph={fx.t('Bank, broker, location', 'ธนาคาร โบรกเกอร์ หรือที่ตั้ง')} />
          <Field id="f-note" type="text" label={fx.t('Notes', 'หมายเหตุ')} value={f.note} onChange={v => set('note', v)} wide />
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
