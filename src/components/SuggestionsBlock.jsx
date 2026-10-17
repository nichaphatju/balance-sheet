import { useApp } from '../state/AppContext.jsx';

export default function SuggestionsBlock({ limit }) {
  const { fx, sugs, actions } = useApp();
  const list = limit ? sugs.slice(0, limit) : sugs;

  return (
    <section className="card">
      <div className="card-h">
        <h2>{fx.t('Suggested actions', 'สิ่งที่ควรทำ')}</h2>
        {limit && sugs.length > limit
          ? <button type="button" className="btn ghost" onClick={() => actions.setTab('plan')}>{fx.t('See all', 'ดูทั้งหมด')} ({sugs.length})</button>
          : null}
      </div>
      <div className="sugs">
        {list.map((s, i) => (
          <div className={'sug ' + s.s} key={i}><div><h3>{s.t}</h3><p>{s.b}</p></div></div>
        ))}
      </div>
      <p className="note" style={{ marginTop: 12 }}>{fx.t('General guidance based on common financial planning rules, not personal financial advice.', 'คำแนะนำทั่วไปตามหลักการวางแผนการเงิน ไม่ใช่คำแนะนำการลงทุนเฉพาะบุคคล')}</p>
    </section>
  );
}
