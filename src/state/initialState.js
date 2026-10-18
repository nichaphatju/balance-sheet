import { uid } from '../lib/format.js';

export const KEY = 'personal-balance-sheet.v1';
export const TODAY = new Date().toISOString().slice(0, 10);

export function blank() {
  return {
    v: 1,
    lang: (navigator.language || '').toLowerCase().startsWith('th') ? 'th' : 'en',
    currency: 'THB',
    tab: 'overview',
    isSample: false,
    owner: '',
    asOf: TODAY,
    lastBackupAt: null,
    profile: { income: '', otherIncome: '', expenses: '', age: '', retireAge: 60, dependents: 0, emergencyTarget: 6 },
    assets: [],
    liabilities: [],
    goals: [],
    snapshots: [],
    borrow: { purpose: 'home', dsr: 40, rate: 6, years: 30, ltv: 90, costs: 3, price: '' }
  };
}

export function sample() {
  const s = blank();
  s.isSample = true;
  s.owner = '';
  s.profile = { income: 95000, otherIncome: 5000, expenses: 38000, age: 34, retireAge: 60, dependents: 1, emergencyTarget: 6 };
  const A = (cat, name, value, cost, rate, inst, note) => ({ id: uid(), cat, name, value, cost: cost ?? '', rate: rate ?? '', inst: inst || '', note: note || '' });
  s.assets = [
    A('cash', 'Savings account', 220000, null, 0.5, 'KBank'),
    A('fixed', '12-month fixed deposit', 250000, null, 1.6, 'SCB'),
    A('mmf', 'Money market fund', 80000, 80000, 1.8, ''),
    A('stock', 'Thai stocks (SET)', 320000, 280000, null, 'Broker'),
    A('fund', 'Global equity fund', 210000, 190000, null, ''),
    A('retire', 'Provident fund (PVD)', 450000, 380000, null, 'Employer'),
    A('retire', 'RMF', 120000, 110000, null, ''),
    A('retire', 'Thai ESG / SSF', 80000, 80000, null, ''),
    A('gold', 'Gold bars (2 baht weight)', 95000, 70000, null, ''),
    A('home', 'Condo', 2800000, 2500000, null, 'Bangkok', 'Estimated market value'),
    A('vehicle', 'Car', 520000, 850000, null, '', 'Bought 2023')
  ];
  const L = (cat, name, balance, rate, payment, months, lender) => ({ id: uid(), cat, name, balance, rate, payment, months: months ?? '', lender: lender || '', note: '' });
  s.liabilities = [
    L('mortgage', 'Condo mortgage', 1950000, 6.1, 14500, 216, 'Bank'),
    L('car', 'Car loan', 310000, 5.8, 9800, 34, 'Leasing'),
    L('card', 'Credit card', 28000, 16, 5000, null, ''),
    L('personal', 'Personal loan', 60000, 22, 4200, 16, '')
  ];
  s.goals = [
    { id: uid(), name: 'Trip to Japan', target: 120000, saved: 30000, date: '2027-10-01' },
    { id: uid(), name: 'Child education fund', target: 1000000, saved: 150000, date: '2040-05-01' }
  ];
  s.snapshots = [
    { date: '2025-04-30', a: 4410000, l: 2690000 },
    { date: '2025-10-31', a: 4620000, l: 2580000 },
    { date: '2026-04-30', a: 4790000, l: 2460000 }
  ];
  return s;
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const d = JSON.parse(raw); if (d && d.v === 1) return Object.assign(blank(), d); }
  } catch (e) { /* ignore unreadable storage */ }
  return null;
}

export function persist(S) {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or unavailable */ }
}
