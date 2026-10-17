import { useApp } from '../state/AppContext.jsx';

export default function BorrowLive() {
  const { C, fx, borrow: b } = useApp();

  if (!b.income) return <div className="empty">{fx.t('Enter your monthly income to see an estimate.', 'กรอกรายได้ต่อเดือนเพื่อดูผลประเมิน')}</div>;
  const ck = b.check;

  return (
    <>
      <p className="sub">{fx.t('Estimated price you can afford', 'ราคาที่น่าจะซื้อได้')}</p>
      <p className="big num">{fx.money(b.price)}</p>
      <p className="note">{b.limit === 'income' ? fx.t('Limited by your income and existing debt.', 'ถูกจำกัดโดยรายได้และหนี้เดิม') : fx.t('Limited by the cash you have for the down payment and fees.', 'ถูกจำกัดโดยเงินสดสำหรับเงินดาวน์และค่าธรรมเนียม')}</p>
      <dl className="kv" style={{ marginTop: 12 }}>
        <dt>{fx.t('Debt payments now', 'ค่างวดหนี้ปัจจุบัน')}</dt><dd>{fx.money(C.debtPay)} ({fx.pct(C.debtPay / b.income)})</dd>
        <dt>{fx.t('Monthly payment room', 'ค่างวดที่ผ่อนเพิ่มได้')}</dt><dd>{fx.money(b.room)}</dd>
        <dt>{fx.t('Maximum loan', 'วงเงินกู้สูงสุด')}</dt><dd>{fx.money(b.maxLoan)}</dd>
        <dt>{fx.t('Price your income supports', 'ราคาตามกำลังผ่อน')}</dt><dd>{fx.money(b.priceByLoan)}</dd>
        <dt>{fx.t('Cash available for down payment', 'เงินสดที่ใช้ดาวน์ได้')}</dt><dd>{fx.money(b.cash)}</dd>
        <dt>{fx.t('Price your cash supports', 'ราคาตามเงินดาวน์')}</dt><dd>{isFinite(b.priceByCash) ? fx.money(b.priceByCash) : fx.t('No limit', 'ไม่จำกัด')}</dd>
        <div className="sep" />
        <dt>{fx.t('Loan at that price', 'วงเงินกู้ที่ราคานี้')}</dt><dd>{fx.money(b.loan)}</dd>
        <dt>{fx.t('Term used', 'ระยะเวลาที่ใช้คำนวณ')}</dt><dd>{b.years} {fx.t('years', 'ปี')}</dd>
        <dt>{fx.t('Payment per 1,000,000 borrowed', 'ค่างวดต่อเงินกู้ 1 ล้าน')}</dt><dd>{fx.money(b.per1m)}</dd>
      </dl>
      {b.capped ? <p className="note" style={{ marginTop: 8 }}>{fx.t(`Term shortened to ${b.ageCap} years so the loan ends by age 70.`, `ลดระยะเวลากู้เหลือ ${b.ageCap} ปี เพื่อให้ผ่อนหมดภายในอายุ 70 ปี`)}</p> : null}
      {!b.room ? <p className="note" style={{ marginTop: 8, color: 'var(--bad)' }}>{fx.t('Your current debt payments already use the full limit. Paying down debt is the fastest way to raise your borrowing power.', 'ค่างวดหนี้ปัจจุบันเต็มเพดานแล้ว การลดหนี้คือวิธีที่เร็วที่สุดในการเพิ่มกำลังกู้')}</p> : null}
      {ck ? (
        <div className="card" style={{ marginTop: 14, background: 'var(--sunken)' }}>
          <h3>{fx.t('At', 'ที่ราคา')} {fx.money(ck.p)}</h3>
          <dl className="kv" style={{ marginTop: 6 }}>
            <dt>{fx.t('Loan', 'วงเงินกู้')}</dt><dd>{fx.money(ck.l)}</dd>
            <dt>{fx.t('Monthly payment', 'ค่างวดต่อเดือน')}</dt><dd>{fx.money(ck.pay)}</dd>
            <dt>{fx.t('DSR after purchase', 'DSR หลังกู้')}</dt><dd><span className={'pill ' + (ck.dsrOk ? 'good' : 'bad')}>{fx.pct(ck.newDsr)}</span></dd>
            <dt>{fx.t('Cash needed upfront', 'เงินสดที่ต้องใช้')}</dt><dd><span className={'pill ' + (ck.cashOk ? 'good' : 'bad')}>{fx.money(ck.needCash)}</span></dd>
          </dl>
          <p className="note" style={{ marginTop: 6 }}>
            {ck.dsrOk && ck.cashOk
              ? fx.t('Within your limits.', 'อยู่ในกำลังที่รับได้')
              : !ck.dsrOk
                ? fx.t('The payment would push debt payments above your limit.', 'ค่างวดจะทำให้ภาระหนี้เกินเพดานที่ตั้งไว้')
                : fx.t(`You would need ${fx.money(ck.needCash - b.cash)} more cash without touching your emergency fund.`, `ต้องมีเงินสดเพิ่มอีก ${fx.money(ck.needCash - b.cash)} โดยไม่ใช้เงินสำรองฉุกเฉิน`)}
          </p>
        </div>
      ) : null}
    </>
  );
}
