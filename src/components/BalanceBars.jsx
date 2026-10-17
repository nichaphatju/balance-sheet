import { useApp } from '../state/AppContext.jsx';
import { GROUPS } from '../lib/categories.js';

export default function BalanceBars() {
  const { C, fx } = useApp();
  const max = Math.max(C.totalA, C.totalL, 1);
  const h = v => (Math.max(0, v) / max * 100).toFixed(2) + '%';

  const Seg = ({ v, c, label }) => {
    if (v <= 0) return null;
    return (
      <div className="seg-b" style={{ height: h(v), background: c }} title={`${label}: ${fx.money(v)}`}>
        {v / max > 0.12 ? label : ''}
      </div>
    );
  };

  return (
    <section className="card">
      <div className="card-h"><h2>{fx.t('How your balance sheet balances', 'งบดุลสมดุลอย่างไร')}</h2></div>
      <div className="bal" role="img" aria-label={fx.t('Assets compared with liabilities plus net worth', 'สินทรัพย์เทียบกับหนี้สินบวกความมั่งคั่งสุทธิ')}>
        <div>
          <div className="col">
            <Seg v={C.g.personal} c={GROUPS.personal.c} label={fx.nm(GROUPS.personal.n)} />
            <Seg v={C.g.invest} c={GROUPS.invest.c} label={fx.nm(GROUPS.invest.n)} />
            <Seg v={C.g.liquid} c={GROUPS.liquid.c} label={fx.nm(GROUPS.liquid.n)} />
          </div>
        </div>
        <div>
          <div className="col">
            <Seg v={C.nw} c="var(--accent)" label={fx.t('Net worth', 'ความมั่งคั่งสุทธิ')} />
            <Seg v={C.long} c="var(--c-debt)" label={fx.nm(GROUPS.long.n)} />
            <Seg v={C.short} c="color-mix(in srgb, var(--c-debt) 70%, var(--ink))" label={fx.nm(GROUPS.short.n)} />
          </div>
        </div>
      </div>
      <div className="bal" style={{ height: 'auto' }}>
        <div className="cap">{fx.t('What you own', 'สิ่งที่คุณมี')}<br /><b className="num">{fx.money(C.totalA, true)}</b></div>
        <div className="cap">{fx.t('Who it belongs to', 'เป็นของใคร')}<br /><b className="num">{fx.money(C.totalL, true)} + {fx.money(C.nw, true)}</b></div>
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--c-liquid)' }} />{fx.nm(GROUPS.liquid.n)}</span>
        <span><i style={{ background: 'var(--c-invest)' }} />{fx.nm(GROUPS.invest.n)}</span>
        <span><i style={{ background: 'var(--c-personal)' }} />{fx.nm(GROUPS.personal.n)}</span>
        <span><i style={{ background: 'var(--c-debt)' }} />{fx.t('Liabilities', 'หนี้สิน')}</span>
        <span><i style={{ background: 'var(--accent)' }} />{fx.t('Net worth', 'ความมั่งคั่งสุทธิ')}</span>
      </div>
      {C.nw < 0 ? <p className="note" style={{ marginTop: 8 }}>{fx.t('Liabilities are larger than assets, so net worth is negative.', 'หนี้สินมากกว่าสินทรัพย์ ความมั่งคั่งสุทธิจึงติดลบ')}</p> : null}
    </section>
  );
}
