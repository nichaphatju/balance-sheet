import { GROUPS, acat, lcat } from './categories.js';
import { num, money, pct, monthsUntil } from './format.js';

export function pmt(principal, ratePct, months) {
  const r = ratePct / 100 / 12;
  if (months <= 0) return 0;
  return r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function pv(payment, ratePct, months) {
  const r = ratePct / 100 / 12;
  if (months <= 0 || payment <= 0) return 0;
  return r === 0 ? payment * months : (payment * (1 - Math.pow(1 + r, -months))) / r;
}

/** Computes the full set of derived figures (totals, ratios, score) from state S. */
export function calc(S) {
  const tx = (en, th) => (S.lang === 'th' ? th : en);
  const nm = arr => arr[S.lang === 'th' ? 1 : 0];

  const g = { liquid: 0, invest: 0, personal: 0 }, byCat = {};
  S.assets.forEach(a => { const c = acat(a.cat), v = num(a.value); g[c.g] += v; byCat[c.k] = (byCat[c.k] || 0) + v; });
  const totalA = g.liquid + g.invest + g.personal;

  let short = 0, long = 0, debtPay = 0, due12 = 0; const byL = {};
  S.liabilities.forEach(l => {
    const c = lcat(l.cat), b = num(l.balance), p = num(l.payment);
    if (c.g === 'short') { short += b; due12 += b; } else { long += b; due12 += Math.min(b, p * 12); }
    debtPay += p; byL[c.k] = (byL[c.k] || 0) + b;
  });
  const totalL = short + long, nw = totalA - totalL;

  const P = S.profile, income = num(P.income) + num(P.otherIncome), expenses = num(P.expenses);
  const outflow = expenses + debtPay, surplus = income - outflow;
  const target = num(P.emergencyTarget) || 6;
  const st = (ok, mid, v) => (v === null ? 'na' : ok ? 'good' : mid ? 'warn' : 'bad');
  const em = outflow > 0 ? g.liquid / outflow : null;
  const cr = due12 > 0 ? g.liquid / due12 : (S.assets.length ? Infinity : null);
  const da = totalA > 0 ? totalL / totalA : null;
  const dsr = income > 0 ? debtPay / income : null;
  const sr = income > 0 ? surplus / income : null;
  const ir = totalA > 0 ? (nw > 0 ? g.invest / nw : 0) : null;

  const ratios = [
    { k: 'em', n: tx('Emergency fund', 'เงินสำรองฉุกเฉิน'), v: em, show: em === null ? '–' : em.toFixed(1) + tx(' mo', ' เดือน'),
      tgt: tx(`Aim for ${target}+ months of spending`, `ควรมี ${target} เดือนขึ้นไป`), s: st(em >= target, em >= 3, em),
      f: tx('Liquid assets ÷ monthly spending (incl. debt payments)', 'สินทรัพย์สภาพคล่อง ÷ ค่าใช้จ่ายต่อเดือน (รวมค่างวดหนี้)') },
    { k: 'cr', n: tx('Liquidity ratio', 'อัตราส่วนสภาพคล่อง'), v: cr, show: cr === null ? '–' : cr === Infinity ? tx('No debt due', 'ไม่มีหนี้ครบกำหนด') : cr.toFixed(2) + '×',
      tgt: tx('1.0× or more', 'ควรมากกว่า 1 เท่า'), s: st(cr >= 1, cr >= 0.5, cr),
      f: tx('Liquid assets ÷ debts due in the next 12 months', 'สินทรัพย์สภาพคล่อง ÷ หนี้ที่ต้องชำระใน 12 เดือน') },
    { k: 'da', n: tx('Debt to assets', 'หนี้สินต่อสินทรัพย์'), v: da, show: pct(da),
      tgt: tx('50% or less', 'ไม่ควรเกิน 50%'), s: st(da <= 0.5, da <= 0.75, da),
      f: tx('Total liabilities ÷ total assets', 'หนี้สินรวม ÷ สินทรัพย์รวม') },
    { k: 'dsr', n: tx('Debt service ratio (DSR)', 'ภาระหนี้ต่อรายได้ (DSR)'), v: dsr, show: pct(dsr),
      tgt: tx('35–40% or less', 'ไม่ควรเกิน 35–40%'), s: st(dsr <= 0.35, dsr <= 0.45, dsr),
      f: tx('Monthly debt payments ÷ monthly income', 'ค่างวดหนี้ต่อเดือน ÷ รายได้ต่อเดือน') },
    { k: 'sr', n: tx('Savings rate', 'อัตราการออม'), v: sr, show: pct(sr),
      tgt: tx('10–20% or more', 'ควรออม 10–20% ขึ้นไป'), s: st(sr >= 0.1, sr >= 0, sr),
      f: tx('(Income − spending − debt payments) ÷ income', '(รายได้ − ค่าใช้จ่าย − ค่างวด) ÷ รายได้') },
    { k: 'ir', n: tx('Investment to net worth', 'สินทรัพย์ลงทุนต่อความมั่งคั่งสุทธิ'), v: ir, show: nw <= 0 && totalA > 0 ? tx('Net worth ≤ 0', 'ความมั่งคั่ง ≤ 0') : pct(ir),
      tgt: tx('50% or more', 'ควรมากกว่า 50%'), s: st(ir >= 0.5, ir >= 0.25, ir),
      f: tx('Investment assets ÷ net worth', 'สินทรัพย์เพื่อการลงทุน ÷ ความมั่งคั่งสุทธิ') }
  ];
  const scored = ratios.filter(r => r.s !== 'na');
  const score = scored.length ? Math.round(scored.reduce((s, r) => s + (r.s === 'good' ? 100 : r.s === 'warn' ? 60 : 20), 0) / scored.length) : null;

  return { g, byCat, byL, totalA, short, long, totalL, nw, debtPay, due12, income, expenses, outflow, surplus, target, ratios, score, em, dsr, sr, da, ir };
}

/** Rule-based suggestions, ordered worst-first. Pure function of state + calc() output. */
export function suggestions(S, C) {
  const tx = (en, th) => (S.lang === 'th' ? th : en);
  const nm = arr => arr[S.lang === 'th' ? 1 : 0];
  const mon = n => money(S.lang, S.currency, n);

  const out = [], add = (s, t, b) => out.push({ s, t, b });
  const P = S.profile;
  if (!S.assets.length && !S.liabilities.length) {
    add('info', tx('Start by listing what you own and owe', 'เริ่มจากบันทึกสิ่งที่มีและหนี้ที่ต้องจ่าย'),
      tx('Add your bank accounts, investments, home, vehicles and every debt. Rough values are fine for a first pass.', 'เพิ่มบัญชีเงินฝาก การลงทุน บ้าน รถ และหนี้ทุกก้อน ใช้ตัวเลขโดยประมาณก่อนได้'));
    return out;
  }
  if (!C.income) add('info', tx('Add your monthly income and spending', 'เพิ่มรายได้และค่าใช้จ่ายต่อเดือน'), tx('Open the Plan tab and fill in income and living costs. Savings rate, DSR, emergency fund and borrowing capacity all depend on them.', 'ไปที่แท็บแผนการเงิน แล้วกรอกรายได้และค่าใช้จ่าย เพื่อคำนวณอัตราการออม DSR เงินสำรองฉุกเฉิน และกำลังกู้'));
  if (C.nw < 0) add('bad', tx('Your debts are larger than your assets', 'หนี้สินมากกว่าสินทรัพย์'), tx(`Net worth is ${mon(C.nw)}. Pause new borrowing, cut non-essential spending and direct every spare baht to the most expensive debt first.`, `ความมั่งคั่งสุทธิติดลบ ${mon(C.nw)} ควรงดก่อหนี้ใหม่ ลดรายจ่ายที่ไม่จำเป็น และนำเงินส่วนเกินไปปิดหนี้ดอกเบี้ยสูงก่อน`));

  const hi = S.liabilities.filter(l => num(l.rate) >= 12 && num(l.balance) > 0).sort((a, b) => num(b.rate) - num(a.rate));
  if (hi.length) {
    const tot = hi.reduce((s, l) => s + num(l.balance), 0), first = hi[0];
    add('bad', tx(`Pay off high-interest debt: ${mon(tot)}`, `เร่งปิดหนี้ดอกเบี้ยสูง ${mon(tot)}`),
      tx(`Start with "${first.name}" at ${num(first.rate)}% a year, then the next highest rate (the avalanche method). No investment reliably beats a guaranteed ${num(first.rate)}%. Ask your bank about a debt consolidation or refinance programme.`,
         `เริ่มจาก "${first.name}" ดอกเบี้ย ${num(first.rate)}% ต่อปี แล้วไล่ไปหนี้ที่ดอกเบี้ยสูงรองลงมา ไม่มีการลงทุนใดให้ผลตอบแทนแน่นอนเท่ากับการประหยัดดอกเบี้ย ${num(first.rate)}% ลองสอบถามโครงการรวมหนี้หรือรีไฟแนนซ์กับธนาคาร`));
  }

  if (C.em !== null) {
    const need = C.target * C.outflow - C.g.liquid;
    if (C.em < 3) add('bad', tx('Build your emergency fund', 'สร้างเงินสำรองฉุกเฉิน'), tx(`You have ${C.em.toFixed(1)} months of spending in liquid assets. Set aside ${mon(need)} more in a savings account or money market fund to reach ${C.target} months.`, `ตอนนี้มีเงินสำรอง ${C.em.toFixed(1)} เดือน ควรเก็บเพิ่มอีก ${mon(need)} ในบัญชีออมทรัพย์หรือกองทุนตลาดเงิน ให้ครบ ${C.target} เดือน`));
    else if (C.em < C.target) add('warn', tx('Top up your emergency fund', 'เติมเงินสำรองฉุกเฉินให้ครบ'), tx(`${C.em.toFixed(1)} months covered. ${mon(need)} more reaches your ${C.target}-month target.`, `มีเงินสำรอง ${C.em.toFixed(1)} เดือน เก็บเพิ่มอีก ${mon(need)} จะครบเป้าหมาย ${C.target} เดือน`));
    else if (C.em > 12) add('info', tx('Put idle cash to work', 'นำเงินสดส่วนเกินไปลงทุน'), tx(`Your liquid assets cover ${C.em.toFixed(0)} months. Keeping ${C.target} months and investing about ${mon(-need)} could earn more than deposit rates.`, `สินทรัพย์สภาพคล่องพอใช้ ${C.em.toFixed(0)} เดือน หากเก็บไว้ ${C.target} เดือน แล้วนำส่วนเกินประมาณ ${mon(-need)} ไปลงทุน อาจได้ผลตอบแทนสูงกว่าดอกเบี้ยเงินฝาก`));
  }

  if (C.dsr !== null) {
    if (C.dsr > 0.45) add('bad', tx('Debt payments take too much of your income', 'ภาระผ่อนหนี้สูงเกินไป'), tx(`${pct(C.dsr)} of income goes to debt payments. Avoid new loans, and look at refinancing or extending terms to bring it under 40%. Banks may decline new credit at this level.`, `ค่างวดหนี้คิดเป็น ${pct(C.dsr)} ของรายได้ ควรงดกู้เพิ่ม และพิจารณารีไฟแนนซ์หรือขยายระยะเวลาผ่อนให้ต่ำกว่า 40% ระดับนี้ธนาคารอาจไม่อนุมัติสินเชื่อใหม่`));
    else if (C.dsr > 0.35) add('warn', tx('Debt payments are close to the limit', 'ภาระผ่อนหนี้ใกล้เพดาน'), tx(`DSR is ${pct(C.dsr)}. Keep it below 35–40% before taking on a mortgage or car loan.`, `DSR อยู่ที่ ${pct(C.dsr)} ควรลดให้ต่ำกว่า 35–40% ก่อนกู้บ้านหรือรถ`));
  }

  if (C.sr !== null) {
    if (C.sr < 0) add('bad', tx('You spend more than you earn', 'รายจ่ายมากกว่ารายได้'), tx(`The monthly shortfall is ${mon(-C.surplus)}. List your expenses and cut the largest non-essential ones first.`, `ขาดดุลเดือนละ ${mon(-C.surplus)} ลองจดรายจ่ายและตัดรายการที่ไม่จำเป็นที่ใหญ่ที่สุดก่อน`));
    else if (C.sr < 0.1) add('warn', tx('Raise your savings rate to 10%', 'เพิ่มอัตราการออมเป็น 10%'), tx(`You save ${pct(C.sr)} of income. Saving ${mon(C.income * 0.1)} a month automatically on payday is a good first target.`, `ตอนนี้ออม ${pct(C.sr)} ของรายได้ ลองตั้งโอนอัตโนมัติวันเงินเดือนออกเดือนละ ${mon(C.income * 0.1)}`));
  }

  if (C.da !== null && C.da > 0.5) add(C.da > 0.75 ? 'bad' : 'warn', tx('Reduce debt relative to assets', 'ลดสัดส่วนหนี้ต่อสินทรัพย์'), tx(`Debts are ${pct(C.da)} of your assets. Below 50% gives you a cushion if asset prices fall.`, `หนี้สินคิดเป็น ${pct(C.da)} ของสินทรัพย์ ควรต่ำกว่า 50% เพื่อรองรับกรณีราคาสินทรัพย์ลดลง`));
  if (C.nw > 0 && C.ir !== null && C.ir < 0.5) add('warn', tx('Grow your investment assets', 'เพิ่มสินทรัพย์เพื่อการลงทุน'), tx(`Investments are ${pct(C.ir)} of net worth; much of your wealth sits in things you use. Investing a fixed amount every month (DCA) in diversified funds builds this over time.`, `สินทรัพย์ลงทุนคิดเป็น ${pct(C.ir)} ของความมั่งคั่งสุทธิ ความมั่งคั่งส่วนใหญ่อยู่ในของใช้ส่วนตัว การลงทุนสม่ำเสมอทุกเดือน (DCA) ในกองทุนที่กระจายความเสี่ยงช่วยเพิ่มสัดส่วนนี้ได้`));
  if (!S.assets.some(a => a.cat === 'retire') && num(P.age) < num(P.retireAge || 60)) add('warn', tx('Start saving for retirement', 'เริ่มออมเพื่อเกษียณ'), tx('You have no retirement funds listed. In Thailand, provident fund (PVD), RMF and Thai ESG contributions are tax-deductible within limits, so you save tax while you save for later.', 'ยังไม่มีกองทุนเพื่อการเกษียณ ในไทยเงินสะสม PVD, RMF และ Thai ESG ลดหย่อนภาษีได้ตามเกณฑ์ ช่วยทั้งออมและประหยัดภาษี'));
  if (num(P.dependents) > 0 && !S.assets.some(a => a.cat === 'insure')) add('warn', tx('Protect the people who depend on you', 'วางแผนคุ้มครองคนที่พึ่งพาคุณ'), tx(`You have ${num(P.dependents)} dependant(s) and no life insurance listed. A common guide is cover worth your debts plus 5–10 years of income. Pure term insurance is the cheapest way to get it.`, `คุณมีผู้อยู่ในอุปการะ ${num(P.dependents)} คน แต่ยังไม่มีประกันชีวิต แนวทางทั่วไปคือทุนประกันเท่ากับหนี้สินรวมกับรายได้ 5–10 ปี ประกันแบบชั่วระยะเวลามีเบี้ยถูกที่สุด`));

  const investable = C.g.liquid + C.g.invest;
  if (investable > 0) {
    const top = Object.entries(C.byCat).filter(([k]) => ['liquid', 'invest'].includes(acat(k).g) && !['cash', 'fixed', 'mmf', 'retire'].includes(k)).sort((a, b) => b[1] - a[1])[0];
    if (top && top[1] / investable > 0.5) add('warn', tx('Spread your investments', 'กระจายการลงทุน'), tx(`${nm(acat(top[0]).n)} make up ${pct(top[1] / investable)} of your liquid and investment assets. Spreading across asset types lowers the risk of one bad year.`, `${nm(acat(top[0]).n)} คิดเป็น ${pct(top[1] / investable)} ของสินทรัพย์สภาพคล่องและสินทรัพย์ลงทุน การกระจายไปหลายประเภทช่วยลดความเสี่ยง`));
    if ((C.byCat.crypto || 0) / investable > 0.1) add('warn', tx('Keep speculative assets small', 'จำกัดสัดส่วนสินทรัพย์เก็งกำไร'), tx(`Crypto is ${pct((C.byCat.crypto || 0) / investable)} of your investable assets. Many planners keep high-volatility assets under 5–10%.`, `คริปโตคิดเป็น ${pct((C.byCat.crypto || 0) / investable)} ของสินทรัพย์ลงทุน นักวางแผนการเงินมักแนะนำไม่เกิน 5–10%`));
  }

  const goalNeed = S.goals.reduce((s, g) => s + Math.max(0, num(g.target) - num(g.saved)) / monthsUntil(g.date), 0);
  if (goalNeed > 0 && C.income > 0 && goalNeed > Math.max(0, C.surplus)) add('warn', tx('Your goals need more than you save', 'เป้าหมายต้องใช้เงินมากกว่าที่ออมได้'), tx(`Your goals need about ${mon(goalNeed)} a month, but you have ${mon(Math.max(0, C.surplus))} left after spending. Push a target date back, lower a target, or raise income.`, `เป้าหมายต้องออมราว ${mon(goalNeed)} ต่อเดือน แต่มีเงินเหลือ ${mon(Math.max(0, C.surplus))} ลองเลื่อนวันเป้าหมาย ลดยอดเป้าหมาย หรือเพิ่มรายได้`));

  const last = S.snapshots.map(s => s.date).sort().pop();
  if (!last || (Date.now() - new Date(last).getTime()) / 864e5 > 180) add('info', tx('Save a snapshot of today’s balance sheet', 'บันทึกงบดุลของวันนี้'), tx('Snapshots let you see whether net worth is rising. Update your balance sheet every 6–12 months, or after a big event such as buying a home.', 'การบันทึกไว้ช่วยให้เห็นว่าความมั่งคั่งเพิ่มขึ้นหรือไม่ ควรอัปเดตทุก 6–12 เดือน หรือเมื่อมีเหตุการณ์สำคัญ เช่น ซื้อบ้าน'));
  if (!out.some(o => o.s === 'bad' || o.s === 'warn')) add('good', tx('Your finances look healthy', 'สถานะการเงินอยู่ในเกณฑ์ดี'), tx('All key ratios are within healthy ranges. Keep investing regularly and review once or twice a year.', 'อัตราส่วนสำคัญอยู่ในเกณฑ์ดี ลงทุนต่อเนื่องและทบทวนปีละ 1–2 ครั้ง'));

  const order = { bad: 0, warn: 1, info: 2, good: 3 };
  return out.sort((a, b) => order[a.s] - order[b.s]);
}

/** Borrowing-power estimate for a given purpose/profile combination. */
export function borrowCalc(S, C, B = S.borrow) {
  const income = C.income, age = num(S.profile.age);
  const dsr = num(B.dsr) / 100, rate = num(B.rate), ltv = Math.min(1, num(B.ltv) / 100), costs = num(B.costs) / 100;
  let years = num(B.years);
  const ageCap = age ? Math.max(0, 70 - age) : null;
  const capped = ageCap !== null && B.purpose === 'home' && years > ageCap;
  if (capped) years = ageCap;
  const n = Math.round(years * 12);
  const room = Math.max(0, income * dsr - C.debtPay);
  const maxLoan = pv(room, rate, n);
  const priceByLoan = ltv > 0 ? maxLoan / ltv : 0;
  const reserve = C.target * C.outflow;
  const cash = Math.max(0, C.g.liquid - reserve);
  const upfront = (1 - ltv) + costs;
  const priceByCash = upfront > 0 ? cash / upfront : Infinity;
  const price = Math.min(priceByLoan, priceByCash);
  const loan = price * ltv;
  const limit = priceByLoan <= priceByCash ? 'income' : 'cash';
  let check = null;
  const p = num(B.price);
  if (p > 0) {
    const l = p * ltv, pay = pmt(l, rate, n), newDsr = income > 0 ? (C.debtPay + pay) / income : Infinity, needCash = p * upfront;
    check = { p, l, pay, newDsr, needCash, cashOk: needCash <= cash, dsrOk: newDsr <= dsr };
  }
  return { income, room, maxLoan, priceByLoan, priceByCash, price, loan, limit, cash, reserve, years, capped, ageCap, n, rate, ltv, costs, dsr, check, per1m: pmt(1e6, rate, n) };
}
