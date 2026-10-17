import { useApp } from '../state/AppContext.jsx';
import { GROUPS, acat } from '../lib/categories.js';

export default function Allocation() {
  const { C, fx } = useApp();
  const cats = Object.entries(C.byCat).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const r = 62, circ = 2 * Math.PI * r;
  let off = 0;
  const ring = ['liquid', 'invest', 'personal'].map(g => {
    const v = C.g[g];
    if (!v || !C.totalA) return null;
    const len = (v / C.totalA) * circ;
    const el = (
      <circle key={g} r={r} cx="80" cy="80" fill="none" stroke={GROUPS[g].c} strokeWidth="22"
        strokeDasharray={`${Math.max(0, len - 2)} ${circ}`} strokeDashoffset={-off} transform="rotate(-90 80 80)">
        <title>{fx.nm(GROUPS[g].n)} {fx.pct(v / C.totalA)}</title>
      </circle>
    );
    off += len;
    return el;
  });

  const list = cats.slice(0, 7).map(([k, v]) => (
    <li key={k}>
      <span>{fx.nm(acat(k).n)}</span>
      <span className="num">{fx.pct(v / C.totalA)}</span>
      <span className="bar"><span style={{ width: `${(v / cats[0][1] * 100).toFixed(1)}%`, background: GROUPS[acat(k).g].c }} /></span>
    </li>
  ));

  return (
    <section className="card">
      <div className="card-h">
        <h2>{fx.t('Where your assets are', 'สินทรัพย์ของคุณอยู่ที่ไหน')}</h2>
        <span className="sub">{fx.t('Share of total assets', 'สัดส่วนของสินทรัพย์รวม')}</span>
      </div>
      {C.totalA ? (
        <div className="alloc">
          <svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label={fx.t('Asset allocation by group', 'สัดส่วนสินทรัพย์ตามกลุ่ม')}>
            <circle r={r} cx="80" cy="80" fill="none" stroke="var(--sunken)" strokeWidth="22" />
            {ring}
            <text x="80" y="76" textAnchor="middle" fontSize="11">{fx.t('Investable', 'ลงทุนได้')}</text>
            <text x="80" y="94" textAnchor="middle" fontSize="16" fontWeight="600" style={{ fill: 'var(--ink)' }}>{fx.pct((C.g.liquid + C.g.invest) / C.totalA)}</text>
          </svg>
          <ul>{list}</ul>
        </div>
      ) : (
        <div className="empty">{fx.t('Add assets to see the breakdown.', 'เพิ่มสินทรัพย์เพื่อดูสัดส่วน')}</div>
      )}
    </section>
  );
}
