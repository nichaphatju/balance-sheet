import { useApp } from '../state/AppContext.jsx';
import { PURPOSE } from '../lib/categories.js';

export default function BorrowTeaser() {
  const { S, fx, actions, borrow, borrowWith } = useApp();
  const b = S.borrow.purpose === 'home' ? borrow : borrowWith({ ...S.borrow, ...PURPOSE.home, purpose: 'home', price: '' });

  return (
    <section className="card">
      <div className="card-h">
        <h2>{fx.t('Home buying power', 'กำลังซื้อบ้าน')}</h2>
        <button type="button" className="btn ghost" onClick={() => actions.setTab('borrow')}>{fx.t('Open calculator', 'เปิดเครื่องคำนวณ')}</button>
      </div>
      {b.income ? (
        <>
          <p className="sub">{fx.t('Estimated price you could afford', 'ราคาบ้านที่น่าจะซื้อได้')}</p>
          <p className="big num">{fx.money(b.price)}</p>
          <dl className="kv" style={{ marginTop: 10 }}>
            <dt>{fx.t('Maximum loan', 'วงเงินกู้สูงสุด')}</dt><dd>{fx.money(b.maxLoan)}</dd>
            <dt>{fx.t('Monthly payment room', 'ค่างวดที่ยังผ่อนเพิ่มได้')}</dt><dd>{fx.money(b.room)}</dd>
            <dt>{fx.t('Limited by', 'ข้อจำกัดหลัก')}</dt><dd>{b.limit === 'income' ? fx.t('Income & existing debt', 'รายได้และหนี้เดิม') : fx.t('Cash for down payment', 'เงินดาวน์')}</dd>
          </dl>
        </>
      ) : (
        <div className="empty">{fx.t('Add your income in the Plan tab to estimate how much you could borrow.', 'กรอกรายได้ในแท็บแผนการเงินเพื่อประเมินวงเงินกู้')}</div>
      )}
    </section>
  );
}
