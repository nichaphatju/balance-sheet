import { useApp } from '../state/AppContext.jsx';

export default function RatiosBlock({ title }) {
  const { C, fx, actions } = useApp();
  const lbl = { good: fx.t('Healthy', 'ดี'), warn: fx.t('Watch', 'เฝ้าระวัง'), bad: fx.t('Act now', 'ควรแก้ไข'), na: fx.t('Needs data', 'ต้องกรอกข้อมูล') };

  return (
    <section className="card">
      <div className="card-h">
        <h2>{title || fx.t('Key financial ratios', 'อัตราส่วนทางการเงินที่สำคัญ')}</h2>
        <button type="button" className="btn ghost" onClick={() => actions.setTab('learn')}>{fx.t('What do these mean?', 'แต่ละค่าหมายถึงอะไร')}</button>
      </div>
      <div className="ratios">
        {C.ratios.map(r => (
          <div className="ratio" key={r.k}>
            <div className="top"><span className="sub">{r.n}</span><span className={'pill ' + r.s}>{lbl[r.s]}</span></div>
            <span className="val num">{r.show}</span>
            <span className="tgt">{r.tgt}</span>
            <span className="tgt" style={{ opacity: .8 }}>{r.f}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
