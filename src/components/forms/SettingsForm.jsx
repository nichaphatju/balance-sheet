import { useRef, useState } from 'react';
import { useApp } from '../../state/AppContext.jsx';
import { useUi } from '../../state/UiContext.jsx';
import { CURRENCIES } from '../../lib/categories.js';
import { TODAY } from '../../state/initialState.js';
import Field from '../Field.jsx';
import ConfirmButton from '../ConfirmButton.jsx';

export default function SettingsForm() {
  const { S, fx, actions } = useApp();
  const { closeSheet, toast } = useUi();
  const [owner, setOwner] = useState(S.owner);
  const [asOf, setAsOf] = useState(S.asOf || TODAY);
  const [currency, setCurrency] = useState(S.currency);
  const [json, setJson] = useState(() => JSON.stringify({ ...S, tab: 'overview' }));
  const fileInput = useRef(null);

  const onSubmit = e => {
    e.preventDefault();
    actions.saveSettings(owner, asOf, currency);
    closeSheet();
    toast(fx.t('Settings saved', 'บันทึกการตั้งค่าแล้ว'));
  };

  const restore = text => {
    try {
      const data = JSON.parse(text);
      if (!data || !Array.isArray(data.assets)) throw new Error('invalid backup');
      actions.restore(data);
      closeSheet();
      toast(fx.t('Data restored', 'กู้คืนข้อมูลแล้ว'));
    } catch (err) {
      toast(fx.t('That backup could not be read. Paste the full text you copied.', 'อ่านข้อมูลสำรองไม่ได้ กรุณาวางข้อความทั้งหมดที่คัดลอกไว้'));
    }
  };

  const copyJson = () => {
    navigator.clipboard?.writeText(json).then(
      () => toast(fx.t('Backup copied', 'คัดลอกแล้ว')),
      () => toast(fx.t('Text selected. Copy it with your keyboard.', 'เลือกข้อความแล้ว กดคัดลอกด้วยแป้นพิมพ์'))
    );
  };

  const onFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => restore(reader.result);
    reader.readAsText(file);
  };

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gap: 16 }}>
        <h2>{fx.t('Settings & data', 'ตั้งค่าและข้อมูล')}</h2>
        <div className="fields">
          <Field id="s-owner" type="text" label={fx.t('Prepared for', 'จัดทำสำหรับ')} value={owner} onChange={setOwner} ph={fx.t('Your name (optional)', 'ชื่อของคุณ (ไม่บังคับ)')} />
          <Field id="s-asof" type="date" label={fx.t('Statement date (as of)', 'ณ วันที่')} value={asOf} onChange={setAsOf} />
          <Field id="s-cur" label={fx.t('Currency', 'สกุลเงิน')}>
            <select id="s-cur" value={currency} onChange={e => setCurrency(e.target.value)}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <h3>{fx.t('Back up or move your data', 'สำรองหรือย้ายข้อมูล')}</h3>
          <p className="note">{fx.t('Your data stays in this browser only. Copy the backup text below and keep it somewhere safe, or paste a backup here and choose Restore.', 'ข้อมูลเก็บไว้ในเบราว์เซอร์นี้เท่านั้น คัดลอกข้อความสำรองด้านล่างเก็บไว้ หรือวางข้อความสำรองแล้วกดกู้คืน')}</p>
          <textarea id="s-json" spellCheck="false" value={json} onChange={e => setJson(e.target.value)} />
          <div className="toolbar">
            <button type="button" className="btn" onClick={copyJson}>{fx.t('Copy backup', 'คัดลอกข้อมูลสำรอง')}</button>
            <button type="button" className="btn" onClick={() => restore(json)}>{fx.t('Restore from text', 'กู้คืนจากข้อความ')}</button>
            <button type="button" className="btn" onClick={() => fileInput.current?.click()}>{fx.t('Restore from file', 'กู้คืนจากไฟล์')}</button>
            <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={onFile} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <h3>{fx.t('Start over', 'เริ่มใหม่')}</h3>
          <div className="toolbar">
            <ConfirmButton className="btn" onConfirm={() => { actions.loadSample(); closeSheet(); }}>{fx.t('Load example data', 'โหลดข้อมูลตัวอย่าง')}</ConfirmButton>
            <ConfirmButton className="btn danger" onConfirm={() => { actions.clearAll(); closeSheet(); toast(fx.t('All data cleared', 'ลบข้อมูลทั้งหมดแล้ว')); }}>{fx.t('Clear all data', 'ลบข้อมูลทั้งหมด')}</ConfirmButton>
          </div>
        </div>

        <div className="sheet-foot">
          <button type="button" className="btn" onClick={closeSheet}>{fx.t('Close', 'ปิด')}</button>
          <button type="submit" className="btn pri">{fx.t('Save', 'บันทึก')}</button>
        </div>
      </div>
    </form>
  );
}
