import { useApp } from '../../state/AppContext.jsx';
import { useUi } from '../../state/UiContext.jsx';
import Field from '../Field.jsx';
import PlanLive from '../PlanLive.jsx';
import RatiosBlock from '../RatiosBlock.jsx';
import SuggestionsBlock from '../SuggestionsBlock.jsx';
import GoalsList from '../GoalsList.jsx';

export default function PlanView() {
  const { S, fx, actions } = useApp();
  const { openGoal } = useUi();
  const P = S.profile;
  const set = (key, value) => actions.setField('profile.' + key, value);

  return (
    <>
      <section className="card">
        <div className="card-h">
          <div>
            <h2>{fx.t('Monthly cash flow', 'กระแสเงินสดรายเดือน')}</h2>
            <p className="sub">{fx.t('The balance sheet shows where you stand; cash flow shows where you are heading.', 'งบดุลบอกว่าคุณอยู่ตรงไหน กระแสเงินสดบอกว่าคุณกำลังไปทางไหน')}</p>
          </div>
        </div>
        <div className="grid g2" style={{ gap: 24 }}>
          <div className="fields">
            <Field id="p-income" label={fx.t('Monthly income before tax', 'รายได้ต่อเดือนก่อนหักภาษี')} value={P.income} onChange={v => set('income', v)} hint={fx.t('Salary or regular business income', 'เงินเดือนหรือรายได้ประจำ')} />
            <Field id="p-other" label={fx.t('Other monthly income', 'รายได้อื่นต่อเดือน')} value={P.otherIncome} onChange={v => set('otherIncome', v)} hint={fx.t('Rent, dividends, side work', 'ค่าเช่า เงินปันผล งานเสริม')} />
            <Field id="p-exp" label={fx.t('Monthly living expenses', 'ค่าใช้จ่ายต่อเดือน')} value={P.expenses} onChange={v => set('expenses', v)} hint={fx.t('Excluding debt payments, which come from Liabilities', 'ไม่รวมค่างวดหนี้ ซึ่งดึงจากแท็บหนี้สิน')} />
            <Field id="p-em" label={fx.t('Emergency fund target (months)', 'เป้าหมายเงินสำรอง (เดือน)')} value={P.emergencyTarget} onChange={v => set('emergencyTarget', v)} />
            <Field id="p-age" label={fx.t('Your age', 'อายุ')} value={P.age} onChange={v => set('age', v)} />
            <Field id="p-ret" label={fx.t('Planned retirement age', 'อายุที่ตั้งใจเกษียณ')} value={P.retireAge} onChange={v => set('retireAge', v)} />
            <Field id="p-dep" label={fx.t('People who depend on you', 'จำนวนผู้อยู่ในอุปการะ')} value={P.dependents} onChange={v => set('dependents', v)} />
          </div>
          <div><PlanLive /></div>
        </div>
      </section>
      <RatiosBlock />
      <SuggestionsBlock />
      <section className="card">
        <div className="card-h">
          <div>
            <h2>{fx.t('Financial goals', 'เป้าหมายทางการเงิน')}</h2>
            <p className="sub">{fx.t('Give each goal a target and a date to see how much to save each month.', 'ตั้งยอดเงินและวันที่ เพื่อดูว่าต้องออมเดือนละเท่าไร')}</p>
          </div>
          <button type="button" className="btn pri" onClick={() => openGoal(null)}>+ {fx.t('Add goal', 'เพิ่มเป้าหมาย')}</button>
        </div>
        <GoalsList />
      </section>
    </>
  );
}
