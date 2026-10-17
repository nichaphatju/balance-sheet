import { useApp } from '../state/AppContext.jsx';
import { num } from '../lib/format.js';

export default function PlanLive() {
  const { S, C, fx } = useApp();
  const P = S.profile, yrs = num(P.retireAge) - num(P.age);

  return (
    <>
      <dl className="kv">
        <dt>{fx.t('Total income', 'รายได้รวม')}</dt><dd>{fx.money(C.income)}</dd>
        <dt>{fx.t('Living expenses', 'ค่าใช้จ่าย')}</dt><dd>− {fx.money(C.expenses)}</dd>
        <dt>{fx.t('Debt payments', 'ค่างวดหนี้')}</dt><dd>− {fx.money(C.debtPay)}</dd>
        <div className="sep" />
        <dt><b>{fx.t('Left to save or invest', 'เหลือเก็บหรือลงทุน')}</b></dt>
        <dd className={'big num' + (C.surplus < 0 ? ' down' : '')} style={{ fontSize: '1.3rem' }}>{fx.money(C.surplus)}</dd>
        <dt>{fx.t('Savings rate', 'อัตราการออม')}</dt><dd>{C.income ? fx.pct(C.sr) : '–'}</dd>
        <dt>{fx.t('Per year', 'ต่อปี')}</dt><dd>{fx.money(C.surplus * 12)}</dd>
        {yrs > 0 ? <><dt>{fx.t('Years to retirement', 'ปีที่เหลือก่อนเกษียณ')}</dt><dd>{yrs}</dd></> : null}
      </dl>
      {C.income ? (
        <div style={{ marginTop: 14 }}>
          <div className="bar" style={{ height: 10, display: 'flex', gap: 2, background: 'none' }}>
            {[[C.expenses, 'var(--c-personal)'], [C.debtPay, 'var(--c-debt)'], [Math.max(0, C.surplus), 'var(--accent)']].map(([v, c], i) => (
              <span key={i} style={{ width: `${(v / Math.max(C.income, C.outflow) * 100).toFixed(1)}%`, background: c }} />
            ))}
          </div>
          <div className="legend">
            <span><i style={{ background: 'var(--c-personal)' }} />{fx.t('Spending', 'ค่าใช้จ่าย')}</span>
            <span><i style={{ background: 'var(--c-debt)' }} />{fx.t('Debt', 'หนี้')}</span>
            <span><i style={{ background: 'var(--accent)' }} />{fx.t('Savings', 'เงินออม')}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
