import { useApp } from '../state/AppContext.jsx';
import { useUi } from '../state/UiContext.jsx';
import { num } from '../lib/format.js';

export default function GoalsList() {
  const { S, fx } = useApp();
  const { openGoal } = useUi();

  if (!S.goals.length) {
    return <div className="empty">{fx.t('No goals yet. A home down payment, a trip or a child’s education are common first goals.', 'ยังไม่มีเป้าหมาย เช่น เงินดาวน์บ้าน ท่องเที่ยว หรือการศึกษาบุตร')}</div>;
  }

  return (
    <>
      {S.goals.map(g => {
        const left = Math.max(0, num(g.target) - num(g.saved));
        const m = fx.monthsUntil(g.date);
        const per = left / m;
        const prog = num(g.target) ? Math.min(1, num(g.saved) / num(g.target)) : 0;
        return (
          <div className="goal" role="button" tabIndex={0} key={g.id} onClick={() => openGoal(g.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGoal(g.id); } }}>
            <div className="line"><b>{g.name}</b><span className="num">{fx.money(num(g.saved))} / {fx.money(num(g.target))}</span></div>
            <div className="bar" style={{ height: 7 }}><span style={{ width: `${(prog * 100).toFixed(1)}%`, background: 'var(--accent)' }} /></div>
            <div className="line sub">
              <span>{fx.fdate(g.date)} · {m} {fx.t('months', 'เดือน')}</span>
              <span className="num">{left ? fx.t('Save', 'ออม') + ' ' + fx.money(per) + fx.t('/mo', '/เดือน') : fx.t('Reached', 'ครบแล้ว')}</span>
            </div>
          </div>
        );
      })}
    </>
  );
}
