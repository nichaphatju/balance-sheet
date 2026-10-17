export const GROUPS = {
  liquid:   { c: 'var(--c-liquid)',   n: ['Liquid assets', 'สินทรัพย์สภาพคล่อง'], d: ['Cash or near-cash you can use within days', 'เงินสดหรือเทียบเท่าเงินสดที่ใช้ได้ทันที'] },
  invest:   { c: 'var(--c-invest)',   n: ['Investment assets', 'สินทรัพย์เพื่อการลงทุน'], d: ['Held to grow wealth or produce income', 'ถือไว้เพื่อสร้างผลตอบแทนหรือรายได้'] },
  personal: { c: 'var(--c-personal)', n: ['Personal-use assets', 'สินทรัพย์ใช้ส่วนตัว'], d: ['Things you use, usually not sold for income', 'ของที่ใช้ในชีวิตประจำวัน ไม่ได้มีไว้หารายได้'] },
  short:    { c: 'var(--c-debt)',     n: ['Short-term liabilities', 'หนี้สินระยะสั้น'], d: ['Due within 12 months', 'ครบกำหนดชำระภายใน 1 ปี'] },
  long:     { c: 'var(--c-debt)',     n: ['Long-term liabilities', 'หนี้สินระยะยาว'], d: ['Repaid over more than 12 months', 'ผ่อนชำระนานกว่า 1 ปี'] }
};

export const ACATS = [
  ['cash', 'liquid', 'Cash & bank deposits', 'เงินสดและเงินฝากออมทรัพย์'],
  ['fixed', 'liquid', 'Fixed deposits', 'เงินฝากประจำ'],
  ['mmf', 'liquid', 'Money market funds', 'กองทุนรวมตลาดเงิน'],
  ['stock', 'invest', 'Stocks', 'หุ้น'],
  ['fund', 'invest', 'Mutual funds & ETFs', 'กองทุนรวมและ ETF'],
  ['bond', 'invest', 'Bonds & debentures', 'พันธบัตรและหุ้นกู้'],
  ['retire', 'invest', 'Retirement funds (PVD, RMF, SSF, pension)', 'กองทุนเพื่อการเกษียณ (PVD, RMF, SSF, บำนาญ)'],
  ['insure', 'invest', 'Life insurance cash value', 'มูลค่าเวนคืนกรมธรรม์ประกันชีวิต'],
  ['gold', 'invest', 'Gold & commodities', 'ทองคำและสินค้าโภคภัณฑ์'],
  ['crypto', 'invest', 'Crypto & digital assets', 'คริปโตและสินทรัพย์ดิจิทัล'],
  ['property', 'invest', 'Investment property', 'อสังหาริมทรัพย์เพื่อการลงทุน'],
  ['business', 'invest', 'Business ownership', 'ส่วนของเจ้าของในธุรกิจ'],
  ['lent', 'invest', 'Money lent to others', 'เงินให้ผู้อื่นกู้ยืม'],
  ['home', 'personal', 'Home you live in', 'บ้านหรือคอนโดที่อยู่อาศัย'],
  ['vehicle', 'personal', 'Vehicles', 'ยานพาหนะ'],
  ['belong', 'personal', 'Jewellery, belongings & collectibles', 'เครื่องประดับ ของใช้ และของสะสม'],
  ['aother', 'personal', 'Other assets', 'สินทรัพย์อื่น']
].map(([k, g, en, th]) => ({ k, g, n: [en, th] }));

export const LCATS = [
  ['card', 'short', 'Credit cards', 'บัตรเครดิต'],
  ['personal', 'short', 'Personal loans & cash cards', 'สินเชื่อส่วนบุคคลและบัตรกดเงินสด'],
  ['family', 'short', 'Loans from family or friends', 'เงินยืมจากครอบครัวหรือเพื่อน'],
  ['bills', 'short', 'Unpaid bills & taxes', 'ค่าใช้จ่ายและภาษีค้างจ่าย'],
  ['mortgage', 'long', 'Mortgage', 'สินเชื่อบ้าน'],
  ['car', 'long', 'Car & motorbike loans', 'สินเชื่อรถยนต์และจักรยานยนต์'],
  ['student', 'long', 'Student loans (e.g. กยศ.)', 'เงินกู้เพื่อการศึกษา (กยศ.)'],
  ['biz', 'long', 'Business loans', 'สินเชื่อธุรกิจ'],
  ['lother', 'long', 'Other loans', 'หนี้สินอื่น']
].map(([k, g, en, th]) => ({ k, g, n: [en, th] }));

export const acat = k => ACATS.find(c => c.k === k) || ACATS[ACATS.length - 1];
export const lcat = k => LCATS.find(c => c.k === k) || LCATS[LCATS.length - 1];

export const CURRENCIES = ['THB', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'CNY', 'HKD', 'AUD'];

export const PURPOSE = {
  home: { rate: 6, years: 30, ltv: 90, costs: 3, maxYears: 40 },
  car: { rate: 5.5, years: 6, ltv: 80, costs: 1, maxYears: 8 },
  other: { rate: 12, years: 5, ltv: 100, costs: 0, maxYears: 10 }
};
