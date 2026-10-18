import { useApp } from '../state/AppContext.jsx';
import { useUi } from '../state/UiContext.jsx';
import { TODAY } from '../state/initialState.js';

export default function History() {
  const { S, C, fx, actions } = useApp();
  const { toast } = useUi();

  const onSnapshot = () => {
    actions.saveSnapshot();
    toast(fx.t('Snapshot saved — it now appears in "Net worth over time" below.', 'บันทึกสแนปช็อตแล้ว ดูได้ที่ "ความมั่งคั่งสุทธิตามเวลา" ด้านล่าง'));
  };

  const pts = S.snapshots.map(s => ({ d: s.date, v: s.a - s.l })).filter(p => p.d !== TODAY);
  pts.push({ d: TODAY, v: C.nw, now: true });
  pts.sort((a, b) => a.d.localeCompare(b.d));

  if (pts.length < 2) {
    const savedToday = S.snapshots.some(s => s.date === TODAY);
    return (
      <section className="card">
        <div className="card-h"><h2>{fx.t('Net worth over time', 'ความมั่งคั่งสุทธิตามเวลา')}</h2></div>
        <div className="empty">
          {savedToday
            ? <>
                <span>✓ {fx.t("Snapshot saved for today. This chart will show your trend once you save another — try again in a few months.", "บันทึกสแนปช็อตของวันนี้แล้ว กราฟนี้จะแสดงแนวโน้มเมื่อคุณบันทึกอีกครั้ง ลองใหม่ในอีกไม่กี่เดือน")}</span>
                <button type="button" className="btn" onClick={onSnapshot}>{fx.t('Update today’s snapshot', 'อัปเดตสแนปช็อตวันนี้')}</button>
              </>
            : <>
                {fx.t('A snapshot records today’s total assets and liabilities. Save one now and again in a few months to see your net worth trend here.', 'สแนปช็อตจะบันทึกสินทรัพย์และหนี้สินรวมของวันนี้ บันทึกไว้ตอนนี้ และอีกครั้งในอีกไม่กี่เดือน เพื่อดูแนวโน้มความมั่งคั่งสุทธิที่นี่')}
                <button type="button" className="btn" onClick={onSnapshot}>{fx.t('Save snapshot', 'บันทึกสแนปช็อต')}</button>
              </>}
        </div>
      </section>
    );
  }

  const W = 520, H = 180, pl = 8, pr = 8, pt = 22, pb = 26;
  const t0 = new Date(pts[0].d).getTime(), t1 = new Date(pts[pts.length - 1].d).getTime() || t0 + 1;
  const vs = pts.map(p => p.v), lo = Math.min(0, ...vs), hi = Math.max(...vs, 1), span = hi - lo || 1;
  const x = p => pl + ((new Date(p.d).getTime() - t0) / ((t1 - t0) || 1)) * (W - pl - pr);
  const y = v => pt + (1 - (v - lo) / span) * (H - pt - pb);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + x(p).toFixed(1) + ' ' + y(p.v).toFixed(1)).join(' ');
  const area = line + ` L ${x(pts[pts.length - 1]).toFixed(1)} ${y(lo)} L ${x(pts[0]).toFixed(1)} ${y(lo)} Z`;
  const last = pts[pts.length - 1], first = pts[0];
  const grid = [0.25, 0.5, 0.75].map(f => (
    <line key={f} x1={pl} x2={W - pr} y1={pt + f * (H - pt - pb)} y2={pt + f * (H - pt - pb)} stroke="var(--line)" strokeDasharray="3 4" />
  ));
  const dots = pts.map((p, i) => (
    <circle key={i} cx={x(p).toFixed(1)} cy={y(p.v).toFixed(1)} r={p.now ? 5 : 3} fill={p.now ? 'var(--accent)' : 'var(--surface)'} stroke="var(--accent)" strokeWidth="2">
      <title>{fx.fdate(p.d)}: {fx.money(p.v)}</title>
    </circle>
  ));
  const chg = last.v - first.v;

  return (
    <section className="card">
      <div className="card-h">
        <h2>{fx.t('Net worth over time', 'ความมั่งคั่งสุทธิตามเวลา')}</h2>
        <span className={'sub ' + (chg >= 0 ? 'up' : 'down')}>{chg >= 0 ? '▲' : '▼'} {fx.money(Math.abs(chg))} {fx.t('since', 'ตั้งแต่')} {fx.fdate(first.d)}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={fx.t('Net worth history', 'ประวัติความมั่งคั่งสุทธิ')} style={{ maxWidth: '100%', height: 'auto' }}>
        {grid}
        <path d={area} fill="var(--accent)" opacity=".1" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinejoin="round" />
        {dots}
        <text x={pl} y={H - 6} fontSize="11">{fx.fdate(first.d)}</text>
        <text x={W - pr} y={H - 6} fontSize="11" textAnchor="end">{fx.t('Today', 'วันนี้')}</text>
        <text x={Math.min(W - pr, x(last))} y={Math.max(12, y(last.v) - 10)} fontSize="12" fontWeight="600" textAnchor="end" style={{ fill: 'var(--ink)' }}>{fx.money(last.v, true)}</text>
      </svg>
    </section>
  );
}
