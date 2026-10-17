import { useApp } from '../../state/AppContext.jsx';
import { useUi } from '../../state/UiContext.jsx';
import { GROUPS, lcat } from '../../lib/categories.js';
import { num } from '../../lib/format.js';

const QUICK = ['card', 'personal', 'mortgage', 'car', 'student', 'family'];

export default function LiabilitiesView() {
  const { S, C, fx } = useApp();
  const { openLiability } = useUi();

  const yearlyInterest = S.liabilities.reduce((s, l) => s + (num(l.balance) * num(l.rate)) / 100, 0);

  const groups = ['short', 'long'].map(g => {
    const items = S.liabilities.filter(l => lcat(l.cat).g === g).sort((a, b) => num(b.rate) - num(a.rate));
    if (!items.length) return null;
    return (
      <div key={g}>
        <div className="group-h" style={{ '--dot': 'var(--c-debt)' }}><span>{fx.nm(GROUPS[g].n)}</span><span className="num">{fx.money(g === 'short' ? C.short : C.long)}</span></div>
        {items.map(l => {
          const months = num(l.months), interest = num(l.rate) ? (num(l.balance) * num(l.rate)) / 100 / 12 : 0;
          const meta = [fx.nm(lcat(l.cat).n), l.lender, num(l.rate) ? num(l.rate) + '% ' + fx.t('/ yr', 'ต่อปี') : '', months ? months + ' ' + fx.t('months left', 'เดือนที่เหลือ') : ''].filter(Boolean).join(' · ');
          return (
            <div className="row" role="button" tabIndex={0} key={l.id} onClick={() => openLiability(l.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLiability(l.id); } }}>
              <div>
                <div className="nm">{l.name || fx.nm(lcat(l.cat).n)}{num(l.rate) >= 12 ? <span className="pill bad"> {fx.t('High interest', 'ดอกเบี้ยสูง')}</span> : null}</div>
                <div className="meta">{meta}</div>
              </div>
              <div>
                <div className="amt num">{fx.money(num(l.balance))}</div>
                <div className="gl num sub">{fx.money(num(l.payment))}{fx.t('/mo', '/เดือน')}{interest ? ` · ${fx.t('interest', 'ดอกเบี้ย')} ~${fx.money(interest)}` : ''}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }).filter(Boolean);

  return (
    <section className="card">
      <div className="card-h">
        <div>
          <h2>{fx.t('Liabilities', 'หนี้สิน')}</h2>
          <p className="sub">{fx.t('Everything you owe. Enter the outstanding balance today, not the original loan amount.', 'หนี้ทุกก้อนที่ต้องชำระ ใส่ยอดคงค้าง ณ วันนี้ ไม่ใช่วงเงินกู้เริ่มต้น')}</p>
        </div>
        <button type="button" className="btn pri" onClick={() => openLiability(null)}>+ {fx.t('Add liability', 'เพิ่มหนี้สิน')}</button>
      </div>
      <div className="chips" style={{ marginBottom: 8 }}>
        {QUICK.map(k => <button type="button" className="chip" key={k} onClick={() => openLiability(null, k)}>+ {fx.nm(lcat(k).n)}</button>)}
      </div>
      <div className="list">
        {groups.length ? groups : <div className="empty">{fx.t('No debts recorded. If you have none, that is great news.', 'ยังไม่มีหนี้สิน หากไม่มีหนี้เลยถือว่าดีมาก')}</div>}
      </div>
      {S.liabilities.length ? (
        <>
          <div className="group-h" style={{ '--dot': 'var(--ink)', borderBottom: 0 }}><span>{fx.t('Total liabilities', 'หนี้สินรวม')}</span><span className="num">{fx.money(C.totalL)}</span></div>
          <dl className="kv" style={{ marginTop: 8 }}>
            <dt>{fx.t('Monthly payments', 'ค่างวดต่อเดือน')}</dt><dd>{fx.money(C.debtPay)}</dd>
            <dt>{fx.t('Interest cost per year (approx.)', 'ดอกเบี้ยต่อปี (โดยประมาณ)')}</dt><dd>{fx.money(yearlyInterest)}</dd>
            <dt>{fx.t('Due in the next 12 months', 'ต้องชำระใน 12 เดือน')}</dt><dd>{fx.money(C.due12)}</dd>
          </dl>
          <p className="note" style={{ marginTop: 8 }}>{fx.t('Sorted by interest rate. Paying the highest rate first saves the most interest.', 'เรียงตามอัตราดอกเบี้ย การปิดหนี้ดอกเบี้ยสูงก่อนช่วยประหยัดดอกเบี้ยได้มากที่สุด')}</p>
        </>
      ) : null}
    </section>
  );
}
