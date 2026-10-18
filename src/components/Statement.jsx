import { useApp } from '../state/AppContext.jsx';
import { useUi } from '../state/UiContext.jsx';
import { GROUPS, ACATS, LCATS } from '../lib/categories.js';
import { TODAY } from '../state/initialState.js';

export default function Statement() {
  const { S, C, fx, actions } = useApp();
  const { toast } = useUi();

  const onSnapshot = () => {
    actions.saveSnapshot();
    toast(fx.t('Snapshot saved — it now appears in "Net worth over time" below.', 'บันทึกสแนปช็อตแล้ว ดูได้ที่ "ความมั่งคั่งสุทธิตามเวลา" ด้านล่าง'));
  };

  const lastSnapshot = S.snapshots.map(s => s.date).sort().pop();
  const snapshotHint = lastSnapshot
    ? fx.t(`Last saved ${fx.fdate(lastSnapshot)}`, `บันทึกล่าสุด ${fx.fdate(lastSnapshot)}`)
    : fx.t('Not saved yet', 'ยังไม่ได้บันทึก');

  const assetGroups = ['liquid', 'invest', 'personal'].map(g => {
    const cats = ACATS.filter(c => c.g === g && C.byCat[c.k]);
    return (
      <tbody key={g}>
        <tr className="grp" style={{ '--dot': GROUPS[g].c }}>
          <td>{fx.nm(GROUPS[g].n)}</td>
          <td className="n">{fx.money(C.g[g])}</td>
          <td className="p">{C.totalA ? fx.pct(C.g[g] / C.totalA) : ''}</td>
        </tr>
        {cats.length
          ? cats.map(c => (
              <tr className="item" key={c.k}>
                <td>{fx.nm(c.n)}</td>
                <td className="n">{fx.money(C.byCat[c.k])}</td>
                <td className="p" />
              </tr>
            ))
          : <tr className="item"><td className="sub">{fx.t('None yet', 'ยังไม่มี')}</td><td /><td /></tr>}
      </tbody>
    );
  });

  const liabGroups = ['short', 'long'].map(g => {
    const cats = LCATS.filter(c => c.g === g && C.byL[c.k]);
    const total = g === 'short' ? C.short : C.long;
    return (
      <tbody key={g}>
        <tr className="grp" style={{ '--dot': 'var(--c-debt)' }}>
          <td>{fx.nm(GROUPS[g].n)}</td>
          <td className="n">{fx.money(total)}</td>
          <td className="p">{C.totalA ? fx.pct(total / C.totalA) : ''}</td>
        </tr>
        {cats.length
          ? cats.map(c => (
              <tr className="item" key={c.k}>
                <td>{fx.nm(c.n)}</td>
                <td className="n">{fx.money(C.byL[c.k])}</td>
                <td className="p" />
              </tr>
            ))
          : <tr className="item"><td className="sub">{fx.t('None', 'ไม่มี')}</td><td /><td /></tr>}
      </tbody>
    );
  });

  return (
    <section className="card" aria-labelledby="stmtH">
      <div className="stmt-head">
        <div>
          <h2 id="stmtH">{fx.t('Statement of financial position', 'งบแสดงฐานะการเงิน')}</h2>
          <span className="sub">{S.owner ? S.owner + ' · ' : ''}{fx.t('As of', 'ณ วันที่')} {fx.fdate(S.asOf || TODAY)} · {S.currency}</span>
        </div>
        <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
          <span className="sub">{snapshotHint}</span>
          <button
            type="button"
            className="btn"
            onClick={onSnapshot}
            title={fx.t('Records today’s total assets and liabilities so you can track your net worth trend over time.', 'บันทึกสินทรัพย์และหนี้สินรวมของวันนี้ เพื่อใช้ติดตามแนวโน้มความมั่งคั่งสุทธิ')}
          >
            {fx.t('Save snapshot', 'บันทึกสแนปช็อต')}
          </button>
        </div>
      </div>
      <div className="stmt">
        <table>
          <thead><tr><th>{fx.t('Assets', 'สินทรัพย์')}</th><th /><th /></tr></thead>
          {assetGroups}
          <tbody>
            <tr className="total dbl"><td>{fx.t('Total assets', 'สินทรัพย์รวม')}</td><td className="n">{fx.money(C.totalA)}</td><td className="p">100%</td></tr>
          </tbody>
        </table>
        <table>
          <thead><tr><th>{fx.t('Liabilities & net worth', 'หนี้สินและความมั่งคั่งสุทธิ')}</th><th /><th /></tr></thead>
          {liabGroups}
          <tbody>
            <tr className="total"><td>{fx.t('Total liabilities', 'หนี้สินรวม')}</td><td className="n">{fx.money(C.totalL)}</td><td className="p">{C.totalA ? fx.pct(C.totalL / C.totalA) : ''}</td></tr>
            <tr className="grp" style={{ '--dot': 'var(--accent)' }}><td>{fx.t('Net worth (equity)', 'ความมั่งคั่งสุทธิ (ส่วนของเจ้าของ)')}</td><td className="n">{fx.money(C.nw)}</td><td className="p">{C.totalA ? fx.pct(C.nw / C.totalA) : ''}</td></tr>
            <tr className="total dbl"><td>{fx.t('Total liabilities + net worth', 'หนี้สิน + ความมั่งคั่งสุทธิ')}</td><td className="n">{fx.money(C.totalL + C.nw)}</td><td className="p">100%</td></tr>
          </tbody>
        </table>
      </div>
      <p className="check">
        <b>✓</b> {fx.t('Balanced', 'สมดุล')}: {fx.t('Assets', 'สินทรัพย์')} {fx.money(C.totalA)} = {fx.t('Liabilities', 'หนี้สิน')} {fx.money(C.totalL)} + {fx.t('Net worth', 'ความมั่งคั่งสุทธิ')} {fx.money(C.nw)}
      </p>
    </section>
  );
}
