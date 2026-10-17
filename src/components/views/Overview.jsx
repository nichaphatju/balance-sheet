import KpiTiles from '../KpiTiles.jsx';
import Statement from '../Statement.jsx';
import BalanceBars from '../BalanceBars.jsx';
import Allocation from '../Allocation.jsx';
import SuggestionsBlock from '../SuggestionsBlock.jsx';
import History from '../History.jsx';
import BorrowTeaser from '../BorrowTeaser.jsx';
import RatiosBlock from '../RatiosBlock.jsx';

export default function Overview() {
  return (
    <>
      <KpiTiles />
      <Statement />
      <div className="grid g2"><BalanceBars /><Allocation /></div>
      <SuggestionsBlock limit={3} />
      <div className="grid g2"><History /><BorrowTeaser /></div>
      <RatiosBlock />
    </>
  );
}
