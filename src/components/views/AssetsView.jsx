import { useApp } from '../../state/AppContext.jsx';
import { useUi } from '../../state/UiContext.jsx';
import { GROUPS, acat } from '../../lib/categories.js';
import { num } from '../../lib/format.js';
import Allocation from '../Allocation.jsx';

const QUICK = ['cash', 'fund', 'stock', 'retire', 'gold', 'home', 'vehicle', 'crypto'];

export default function AssetsView() {
  const { S, C, fx } = useApp();
  const { openAsset } = useUi();

  const totalCost = S.assets.filter(a => num(a.cost) > 0).reduce((s, a) => s + num(a.cost), 0);
  const totalValCost = S.assets.filter(a => num(a.cost) > 0).reduce((s, a) => s + num(a.value), 0);

  const groups = ['liquid', 'invest', 'personal'].map(g => {
    const items = S.assets.filter(a => acat(a.cat).g === g).sort((a, b) => num(b.value) - num(a.value));
    if (!items.length) return null;
    return (
      <div key={g}>
        <div className="group-h" style={{ '--dot': GROUPS[g].c }}><span>{fx.nm(GROUPS[g].n)}</span><span className="num">{fx.money(C.g[g])}</span></div>
        {items.map(a => {
          const v = num(a.value), c = num(a.cost), gl = a.cost !== '' && c > 0 ? v - c : null;
          const meta = [fx.nm(acat(a.cat).n), a.inst, a.rate !== '' && num(a.rate) ? num(a.rate) + '% ' + fx.t('/ yr', 'ต่อปี') : '', a.note].filter(Boolean).join(' · ');
          return (
            <div className="row" role="button" tabIndex={0} key={a.id} onClick={() => openAsset(a.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAsset(a.id); } }}>
              <div><div className="nm">{a.name || fx.nm(acat(a.cat).n)}</div><div className="meta">{meta}</div></div>
              <div>
                <div className="amt num">{fx.money(v)}</div>
                {gl !== null ? <div className={'gl num ' + (gl >= 0 ? 'up' : 'down')}>{gl >= 0 ? '+' : '−'}{fx.money(Math.abs(gl))} ({fx.pct(gl / c, 1)})</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }).filter(Boolean);

  return (
    <>
      <section className="card">
        <div className="card-h">
          <div>
            <h2>{fx.t('Assets', 'สินทรัพย์')}</h2>
            <p className="sub">{fx.t('Everything you own that has money value. Use today’s market value, not what you paid.', 'ทุกอย่างที่คุณเป็นเจ้าของและมีมูลค่า ใช้มูลค่าตลาด ณ วันนี้ ไม่ใช่ราคาที่ซื้อมา')}</p>
          </div>
          <button type="button" className="btn pri" onClick={() => openAsset(null)}>+ {fx.t('Add asset', 'เพิ่มสินทรัพย์')}</button>
        </div>
        <div className="chips" style={{ marginBottom: 8 }}>
          {QUICK.map(k => <button type="button" className="chip" key={k} onClick={() => openAsset(null, k)}>+ {fx.nm(acat(k).n)}</button>)}
        </div>
        <div className="list">
          {groups.length ? groups : <div className="empty">{fx.t('No assets yet. Pick a type above to add your first one.', 'ยังไม่มีสินทรัพย์ เลือกประเภทด้านบนเพื่อเพิ่มรายการแรก')}</div>}
        </div>
        {S.assets.length ? (
          <div className="group-h" style={{ '--dot': 'var(--ink)', borderBottom: 0 }}><span>{fx.t('Total assets', 'สินทรัพย์รวม')}</span><span className="num">{fx.money(C.totalA)}</span></div>
        ) : null}
        {totalCost ? (
          <p className="note">{fx.t('Unrealised gain/loss on items with a cost entered', 'กำไร/ขาดทุนที่ยังไม่รับรู้ ของรายการที่ระบุต้นทุน')}: <b className={totalValCost - totalCost >= 0 ? 'up' : 'down'}>{fx.money(totalValCost - totalCost)}</b></p>
        ) : null}
      </section>
      <Allocation />
    </>
  );
}
