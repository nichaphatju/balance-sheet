import { useApp } from '../../state/AppContext.jsx';
import { PURPOSE } from '../../lib/categories.js';
import Field from '../Field.jsx';
import BorrowLive from '../BorrowLive.jsx';

const PURPOSES = ['home', 'car', 'other'];

export default function BorrowView() {
  const { S, C, fx, actions } = useApp();
  const B = S.borrow;
  const set = (key, value) => actions.setField('borrow.' + key, value);
  const labels = { home: fx.t('Home', 'บ้าน/คอนโด'), car: fx.t('Car', 'รถยนต์'), other: fx.t('Other loan', 'สินเชื่ออื่น') };

  return (
    <>
      <section className="card">
        <div className="card-h">
          <div>
            <h2>{fx.t('How much can I borrow or buy?', 'กู้ได้เท่าไร ซื้อได้แค่ไหน')}</h2>
            <p className="sub">{fx.t('Banks look at how much of your income already goes to debt, and whether you have cash for the down payment.', 'ธนาคารพิจารณาว่ารายได้ของคุณถูกใช้ผ่อนหนี้ไปแล้วเท่าไร และมีเงินดาวน์เพียงพอหรือไม่')}</p>
          </div>
          <div className="seg" role="group">
            {PURPOSES.map(k => (
              <button key={k} type="button" aria-pressed={B.purpose === k} onClick={() => actions.setPurpose(k, PURPOSE[k])}>{labels[k]}</button>
            ))}
          </div>
        </div>
        <div className="grid g2" style={{ gap: 24 }}>
          <div className="fields">
            <Field id="b-income" label={fx.t('Monthly income (from Plan)', 'รายได้ต่อเดือน (จากแผนการเงิน)')} value={C.income} onChange={v => actions.setTotalIncome(v)} hint={fx.t('Total income; other income is added on top', 'รายได้รวมจะบวกรายได้อื่นด้วย')} />
            <Field id="b-dsr" label={fx.t('Max share of income for all debts (%)', 'สัดส่วนผ่อนหนี้สูงสุดต่อรายได้ (%)')} value={B.dsr} onChange={v => set('dsr', v)} hint={fx.t('Thai banks often allow 40–70% by income level; 40% is a safer plan', 'ธนาคารมักให้ 40–70% ตามระดับรายได้ ใช้ 40% จะปลอดภัยกว่า')} />
            <Field id="b-rate" label={fx.t('Interest rate (% per year, effective)', 'อัตราดอกเบี้ยเฉลี่ย (% ต่อปี)')} value={B.rate} onChange={v => set('rate', v)} hint={B.purpose === 'car' ? fx.t('Car loans are often quoted as a flat rate; the effective rate is roughly 1.8× the flat rate', 'สินเชื่อรถมักคิดดอกเบี้ยแบบคงที่ (flat) ซึ่งเทียบเป็นอัตราที่แท้จริงประมาณ 1.8 เท่า') : fx.t('Use the average over the loan, not just the teaser rate', 'ใช้ดอกเบี้ยเฉลี่ยตลอดสัญญา ไม่ใช่เฉพาะช่วงโปรโมชัน')} />
            <Field id="b-years" label={fx.t('Loan term (years)', 'ระยะเวลากู้ (ปี)')} value={B.years} onChange={v => set('years', v)} />
            <Field id="b-ltv" label={fx.t('Loan-to-value (%)', 'สัดส่วนวงเงินกู้ต่อราคา LTV (%)')} value={B.ltv} onChange={v => set('ltv', v)} hint={fx.t('Share of the price the bank lends; the rest is your down payment', 'สัดส่วนที่ธนาคารให้กู้ ส่วนที่เหลือคือเงินดาวน์')} />
            <Field id="b-costs" label={fx.t('Fees & transfer costs (% of price)', 'ค่าธรรมเนียมและค่าโอน (% ของราคา)')} value={B.costs} onChange={v => set('costs', v)} />
            <Field id="b-price" label={fx.t('Check a specific price', 'ตรวจสอบราคาที่สนใจ')} value={B.price} onChange={v => set('price', v)} ph={fx.t('e.g. 3,500,000', 'เช่น 3500000')} wide />
          </div>
          <div><BorrowLive /></div>
        </div>
      </section>
      <section className="card">
        <h2>{fx.t('How this estimate works', 'วิธีคำนวณ')}</h2>
        <div className="prose" style={{ marginTop: 8 }}>
          <ul>
            <li>{fx.t('Payment room = income × max debt share − your current debt payments.', 'ค่างวดที่ผ่อนเพิ่มได้ = รายได้ × สัดส่วนผ่อนหนี้สูงสุด − ค่างวดหนี้เดิม')}</li>
            <li>{fx.t('Maximum loan = the amount that payment repays over the term at the interest rate.', 'วงเงินกู้สูงสุด = ยอดเงินที่ค่างวดนั้นผ่อนหมดได้ภายในระยะเวลาและดอกเบี้ยที่กำหนด')}</li>
            <li>{fx.t(`Cash for the down payment = liquid assets minus your ${C.target}-month emergency fund, which should stay untouched.`, `เงินดาวน์ที่ใช้ได้ = สินทรัพย์สภาพคล่อง หักเงินสำรองฉุกเฉิน ${C.target} เดือน ซึ่งไม่ควรนำมาใช้`)}</li>
            <li>{fx.t('The affordable price is the lower of what your income supports and what your cash supports.', 'ราคาที่ซื้อได้คือค่าที่ต่ำกว่าระหว่างกำลังผ่อนจากรายได้ กับกำลังจ่ายเงินดาวน์')}</li>
            <li>{fx.t('Banks usually want the loan repaid by about age 65–70, and LTV limits are set by the Bank of Thailand and change over time. Confirm with your bank.', 'ธนาคารมักกำหนดให้ผ่อนหมดภายในอายุราว 65–70 ปี และเกณฑ์ LTV กำหนดโดยธนาคารแห่งประเทศไทยซึ่งปรับเปลี่ยนได้ ควรสอบถามธนาคารอีกครั้ง')}</li>
          </ul>
        </div>
      </section>
    </>
  );
}
