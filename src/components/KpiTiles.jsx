import { useApp } from '../state/AppContext.jsx';

export default function KpiTiles() {
  const { S, C, fx } = useApp();
  const prev = S.snapshots.slice().sort((a, b) => a.date.localeCompare(b.date)).pop();
  const delta = prev ? C.nw - (prev.a - prev.l) : null;
  const sc = C.score;
  const scLbl = sc === null ? '–' : sc >= 80 ? fx.t('Healthy', 'ดี') : sc >= 55 ? fx.t('Needs attention', 'ควรปรับปรุง') : fx.t('At risk', 'มีความเสี่ยง');

  return (
    <section className="kpis" aria-label={fx.t('Summary', 'สรุป')}>
      <div className="kpi">
        <span className="eyebrow">{fx.t('Total assets', 'สินทรัพย์รวม')}</span>
        <span className="v num">{fx.money(C.totalA)}</span>
        <span className="d">{S.assets.length} {fx.t('items', 'รายการ')}</span>
      </div>
      <div className="kpi">
        <span className="eyebrow">{fx.t('Total liabilities', 'หนี้สินรวม')}</span>
        <span className="v num">{fx.money(C.totalL)}</span>
        <span className="d">{fx.money(C.debtPay)} {fx.t('/ month in payments', '/ เดือน ค่างวด')}</span>
      </div>
      <div className="kpi nw">
        <span className="eyebrow">{fx.t('Net worth (equity)', 'ความมั่งคั่งสุทธิ')}</span>
        <span className="v num">{fx.money(C.nw)}</span>
        <span className="d">
          {delta === null
            ? fx.t('Assets − liabilities', 'สินทรัพย์ − หนี้สิน')
            : (delta >= 0 ? '▲ ' : '▼ ') + fx.money(Math.abs(delta)) + fx.t(' since ', ' ตั้งแต่ ') + fx.fdate(prev.date)}
        </span>
      </div>
      <div className="kpi">
        <span className="eyebrow">{fx.t('Financial health', 'สุขภาพการเงิน')}</span>
        <span className="v num">{sc === null ? '–' : <>{sc}<span className="sub"> / 100</span></>}</span>
        <span className="d">{scLbl}</span>
      </div>
    </section>
  );
}
