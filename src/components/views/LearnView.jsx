import { useApp } from '../../state/AppContext.jsx';
import { GROUPS } from '../../lib/categories.js';

export default function LearnView() {
  const { C, fx } = useApp();
  const { t: T, nm } = fx;

  return (
    <div className="learn">
      <section className="card">
        <div className="prose">
          <span className="eyebrow">{T('The basics', 'พื้นฐาน')}</span>
          <h2>{T('What is a personal balance sheet?', 'งบดุลส่วนบุคคลคืออะไร')}</h2>
          <p>{T('A personal balance sheet, also called a statement of financial position, lists everything you own and everything you owe on one specific date. It is a photograph of your finances at a moment in time. The difference between the two is your net worth.', 'งบดุลส่วนบุคคล หรืองบแสดงฐานะการเงิน คือการสรุปสิ่งที่คุณเป็นเจ้าของและหนี้ที่ต้องชำระ ณ วันใดวันหนึ่ง เปรียบเหมือนภาพถ่ายฐานะการเงินในช่วงเวลานั้น ส่วนต่างระหว่างสองอย่างคือความมั่งคั่งสุทธิ')}</p>
          <div className="eq" style={{ marginTop: 8 }}>
            <div style={{ background: 'var(--accent-soft)' }}>{T('Assets', 'สินทรัพย์')}<small>{T('What you own', 'สิ่งที่คุณมี')}</small></div>
            <span className="op">=</span>
            <div style={{ background: 'var(--bad-soft)' }}>{T('Liabilities', 'หนี้สิน')}<small>{T('What you owe', 'สิ่งที่คุณต้องจ่าย')}</small></div>
            <span className="op">+</span>
            <div style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>{T('Net worth', 'ความมั่งคั่งสุทธิ')}<small>{T('What is truly yours', 'ส่วนที่เป็นของคุณจริง')}</small></div>
          </div>
          <p>{T(
            `Your sheet today: ${fx.money(C.totalA)} = ${fx.money(C.totalL)} + ${fx.money(C.nw)}. Both sides always match, which is why it is called a balance sheet.`,
            `งบดุลของคุณวันนี้: ${fx.money(C.totalA)} = ${fx.money(C.totalL)} + ${fx.money(C.nw)} ทั้งสองฝั่งเท่ากันเสมอ จึงเรียกว่างบดุล`
          )}</p>
        </div>
      </section>
      <section className="card">
        <div className="prose">
          <h2>{T('Why it matters', 'ทำไมจึงสำคัญ')}</h2>
          <ul>
            <li>{T('It shows whether you are actually getting wealthier. A high income with high debt can still mean a low net worth.', 'บอกว่าคุณมั่งคั่งขึ้นจริงหรือไม่ รายได้สูงแต่หนี้สูง ความมั่งคั่งสุทธิก็อาจต่ำ')}</li>
            <li>{T('It reveals risk: too little cash for emergencies, too much debt, or too much money in one place.', 'ชี้ให้เห็นความเสี่ยง เช่น เงินสำรองไม่พอ หนี้มากเกินไป หรือลงทุนกระจุกตัว')}</li>
            <li>{T('Banks read the same numbers when you apply for a mortgage or car loan.', 'ธนาคารใช้ตัวเลขเหล่านี้พิจารณาเมื่อคุณขอสินเชื่อบ้านหรือรถ')}</li>
            <li>{T('It is the starting point of every financial plan: you need to know where you are before deciding where to go.', 'เป็นจุดเริ่มต้นของการวางแผนการเงิน ต้องรู้ว่าอยู่ตรงไหนก่อนจะกำหนดว่าจะไปที่ใด')}</li>
          </ul>
        </div>
      </section>
      <div className="grid g2">
        <section className="card">
          <div className="prose">
            <h2>{T('Three kinds of assets', 'สินทรัพย์ 3 ประเภท')}</h2>
            {['liquid', 'invest', 'personal'].map(g => (
              <p key={g}>
                <b style={{ color: GROUPS[g].c }}>{nm(GROUPS[g].n)}</b><br />
                {nm(GROUPS[g].d)}. {g === 'liquid'
                  ? T('Savings, fixed deposits, money market funds. This is your safety net.', 'เงินฝาก เงินฝากประจำ กองทุนตลาดเงิน เป็นตาข่ายรองรับยามฉุกเฉิน')
                  : g === 'invest'
                    ? T('Stocks, funds, bonds, retirement funds, gold, rental property. These grow your wealth.', 'หุ้น กองทุน พันธบัตร กองทุนเกษียณ ทองคำ อสังหาฯ ให้เช่า ช่วยให้ความมั่งคั่งเติบโต')
                    : T('Your home, car, and belongings. They have value but usually do not earn money, and cars lose value every year.', 'บ้าน รถ ของใช้ มีมูลค่าแต่ไม่สร้างรายได้ และรถจะเสื่อมราคาทุกปี')}
              </p>
            ))}
          </div>
        </section>
        <section className="card">
          <div className="prose">
            <h2>{T('Two kinds of liabilities', 'หนี้สิน 2 ประเภท')}</h2>
            <p><b>{nm(GROUPS.short.n)}</b><br />{T('Credit cards, cash cards, bills and anything due within 12 months. These usually carry the highest interest.', 'บัตรเครดิต บัตรกดเงินสด ค่าใช้จ่ายค้างจ่าย และหนี้ที่ต้องชำระภายใน 12 เดือน มักมีดอกเบี้ยสูงที่สุด')}</p>
            <p><b>{nm(GROUPS.long.n)}</b><br />{T('Mortgages, car loans and student loans repaid over years. The payments due in the next 12 months count toward your liquidity needs.', 'สินเชื่อบ้าน รถ และเงินกู้การศึกษาที่ผ่อนหลายปี ค่างวดใน 12 เดือนข้างหน้านับรวมในความต้องการสภาพคล่อง')}</p>
            <p><b>{T('Net worth (equity)', 'ความมั่งคั่งสุทธิ (ส่วนของเจ้าของ)')}</b><br />{T('What would be left if you sold everything and paid every debt. Growing it steadily is the goal.', 'สิ่งที่เหลือหากขายทุกอย่างและชำระหนี้ทั้งหมด เป้าหมายคือทำให้เพิ่มขึ้นอย่างสม่ำเสมอ')}</p>
          </div>
        </section>
      </div>
      <section className="card">
        <h2>{T('Key ratios and healthy ranges', 'อัตราส่วนสำคัญและเกณฑ์ที่ดี')}</h2>
        <div className="scroll" style={{ marginTop: 10 }}>
          <table className="ref">
            <thead><tr><th>{T('Ratio', 'อัตราส่วน')}</th><th>{T('Formula', 'สูตร')}</th><th>{T('Healthy range', 'เกณฑ์ที่ดี')}</th><th>{T('Yours', 'ของคุณ')}</th></tr></thead>
            <tbody>
              {C.ratios.map(r => (
                <tr key={r.k}><td>{r.n}</td><td>{r.f}</td><td>{r.tgt}</td><td className="num"><span className={'pill ' + r.s}>{r.show}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="grid g2">
        <section className="card">
          <div className="prose">
            <h2>{T('Balance sheet vs cash flow', 'งบดุลกับงบกระแสเงินสด')}</h2>
            <p>{T('The balance sheet is a snapshot on one date. The cash flow statement (income and expenses) covers a period, such as a month. Saving from your cash flow is what grows the balance sheet; spending more than you earn shrinks it.', 'งบดุลคือภาพ ณ วันใดวันหนึ่ง ส่วนงบกระแสเงินสด (รายรับรายจ่าย) ครอบคลุมช่วงเวลา เช่น หนึ่งเดือน เงินออมจากกระแสเงินสดทำให้งบดุลเติบโต ส่วนการใช้จ่ายเกินรายได้ทำให้หดตัว')}</p>
          </div>
        </section>
        <section className="card">
          <div className="prose">
            <h2>{T('Tips for accurate numbers', 'เคล็ดลับให้ตัวเลขแม่นยำ')}</h2>
            <ul>
              <li>{T('Use market value on the statement date: what you could sell it for today.', 'ใช้มูลค่าตลาด ณ วันที่จัดทำ คือราคาที่ขายได้วันนี้')}</li>
              <li>{T('For loans, use the outstanding balance from your latest statement.', 'สำหรับหนี้ ใช้ยอดคงค้างจากใบแจ้งยอดล่าสุด')}</li>
              <li>{T('For life insurance, use the cash surrender value, not the sum assured.', 'ประกันชีวิตใช้มูลค่าเวนคืนเงินสด ไม่ใช่ทุนประกัน')}</li>
              <li>{T('Update every 6–12 months and save a snapshot so you can track progress.', 'อัปเดตทุก 6–12 เดือน และบันทึกสแนปช็อตเพื่อติดตามความก้าวหน้า')}</li>
            </ul>
          </div>
        </section>
      </div>
      <section className="card">
        <div className="prose">
          <h2>{T('How to use this app', 'วิธีใช้แอปนี้')}</h2>
          <ol style={{ margin: 0, paddingLeft: '1.2em', display: 'grid', gap: 4 }}>
            <li>{T('Add every asset in Assets, with today’s value.', 'เพิ่มสินทรัพย์ทั้งหมดในแท็บสินทรัพย์ พร้อมมูลค่าวันนี้')}</li>
            <li>{T('Add every debt in Liabilities, with balance, rate and monthly payment.', 'เพิ่มหนี้ทั้งหมดในแท็บหนี้สิน พร้อมยอดคงค้าง ดอกเบี้ย และค่างวด')}</li>
            <li>{T('Fill in income and spending in Plan to unlock ratios and suggestions.', 'กรอกรายได้และค่าใช้จ่ายในแท็บแผนการเงิน เพื่อดูอัตราส่วนและคำแนะนำ')}</li>
            <li>{T('Check Borrowing power before applying for a home or car loan.', 'ตรวจสอบกำลังกู้ก่อนยื่นขอสินเชื่อบ้านหรือรถ')}</li>
            <li>{T('Save a snapshot, then come back in six months to compare.', 'บันทึกสแนปช็อต แล้วกลับมาเปรียบเทียบในอีก 6 เดือน')}</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
