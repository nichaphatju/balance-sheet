import { acat, lcat } from './categories.js';

function cell(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function row(cells) {
  return cells.map(cell).join(',') + '\r\n';
}

function section(title, header, rows) {
  let out = row([title]) + row(header);
  out += rows.length ? rows.map(row).join('') : row(['(none)']);
  return out + '\r\n';
}

export function buildCsv(S, C, fx) {
  let out = '';

  out += section(
    fx.t('Summary', 'สรุป'),
    [fx.t('Field', 'รายการ'), fx.t('Value', 'ค่า')],
    [
      [fx.t('Owner', 'เจ้าของ'), S.owner || ''],
      [fx.t('As of', 'ณ วันที่'), S.asOf || ''],
      [fx.t('Currency', 'สกุลเงิน'), S.currency],
      [fx.t('Total assets', 'สินทรัพย์รวม'), C.totalA],
      [fx.t('Total liabilities', 'หนี้สินรวม'), C.totalL],
      [fx.t('Net worth', 'ความมั่งคั่งสุทธิ'), C.nw]
    ]
  );

  out += section(
    fx.t('Assets', 'สินทรัพย์'),
    [fx.t('Category', 'ประเภท'), fx.t('Name', 'ชื่อรายการ'), fx.t('Value', 'มูลค่า'), fx.t('Cost', 'ต้นทุน'), fx.t('Rate %', 'อัตรา %'), fx.t('Held at', 'ที่ตั้ง/สถาบัน'), fx.t('Notes', 'หมายเหตุ')],
    S.assets.map(a => [fx.nm(acat(a.cat).n), a.name, a.value, a.cost, a.rate, a.inst, a.note])
  );

  out += section(
    fx.t('Liabilities', 'หนี้สิน'),
    [fx.t('Category', 'ประเภท'), fx.t('Name', 'ชื่อรายการ'), fx.t('Balance', 'ยอดคงค้าง'), fx.t('Rate %', 'อัตรา %'), fx.t('Monthly payment', 'ค่างวดต่อเดือน'), fx.t('Months remaining', 'จำนวนเดือนที่เหลือ'), fx.t('Lender', 'ผู้ให้กู้'), fx.t('Notes', 'หมายเหตุ')],
    S.liabilities.map(l => [fx.nm(lcat(l.cat).n), l.name, l.balance, l.rate, l.payment, l.months, l.lender, l.note])
  );

  out += section(
    fx.t('Goals', 'เป้าหมาย'),
    [fx.t('Goal', 'เป้าหมาย'), fx.t('Target amount', 'จำนวนเงินเป้าหมาย'), fx.t('Saved so far', 'ออมแล้ว'), fx.t('Target date', 'วันที่ต้องการ')],
    S.goals.map(g => [g.name, g.target, g.saved, g.date])
  );

  out += section(
    fx.t('Net worth snapshots', 'สแนปช็อตความมั่งคั่งสุทธิ'),
    [fx.t('Date', 'วันที่'), fx.t('Total assets', 'สินทรัพย์รวม'), fx.t('Total liabilities', 'หนี้สินรวม'), fx.t('Net worth', 'ความมั่งคั่งสุทธิ')],
    S.snapshots.slice().sort((a, b) => a.date.localeCompare(b.date)).map(s => [s.date, s.a, s.l, s.a - s.l])
  );

  return out;
}

export function downloadCsv(filename, csvText) {
  const blob = new Blob(['﻿' + csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
