import { useApp } from './state/AppContext.jsx';
import { useUi } from './state/UiContext.jsx';
import Header from './components/Header.jsx';
import SampleBanner from './components/SampleBanner.jsx';
import Overview from './components/views/Overview.jsx';
import AssetsView from './components/views/AssetsView.jsx';
import LiabilitiesView from './components/views/LiabilitiesView.jsx';
import PlanView from './components/views/PlanView.jsx';
import BorrowView from './components/views/BorrowView.jsx';
import LearnView from './components/views/LearnView.jsx';
import Sheet from './components/Sheet.jsx';
import Toast from './components/Toast.jsx';

const VIEWS = {
  overview: Overview,
  assets: AssetsView,
  liabilities: LiabilitiesView,
  plan: PlanView,
  borrow: BorrowView,
  learn: LearnView
};

export default function App() {
  const { S } = useApp();
  const { toastMsg } = useUi();
  const View = VIEWS[S.tab] || Overview;

  return (
    <>
      <Header />
      <div className="wrap">
        <main id="app">
          <SampleBanner />
          <View />
        </main>
      </div>
      <Sheet />
      {toastMsg ? <Toast message={toastMsg} /> : null}
    </>
  );
}
