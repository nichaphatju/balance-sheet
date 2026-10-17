import { useApp } from '../state/AppContext.jsx';
import { useUi } from '../state/UiContext.jsx';
import { TABS } from '../lib/tabs.js';

export default function Header() {
  const { S, fx, actions } = useApp();
  const { openSettings } = useUi();

  return (
    <header className="top">
      <div className="wrap">
        <div className="top-row">
          <div className="brand">
            <div className="mark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect x="1" y="3" width="6" height="11" rx="1" fill="var(--accent-ink)" />
                <rect x="9" y="3" width="6" height="5" rx="1" fill="var(--accent-ink)" opacity=".6" />
                <rect x="9" y="9" width="6" height="5" rx="1" fill="var(--accent-ink)" />
              </svg>
            </div>
            <div>
              <h1>{fx.t('Personal Balance Sheet', 'งบดุลส่วนบุคคล')}</h1>
              <small>{fx.t('Statement of financial position', 'งบแสดงฐานะการเงิน')}{S.owner ? ' · ' + S.owner : ''}</small>
            </div>
          </div>
          <div className="ctrls">
            <div className="seg" role="group" aria-label="Language">
              <button type="button" aria-pressed={S.lang === 'en'} onClick={() => actions.setLang('en')}>EN</button>
              <button type="button" aria-pressed={S.lang === 'th'} onClick={() => actions.setLang('th')}>ไทย</button>
            </div>
            <button type="button" className="iconbtn" onClick={openSettings}>{fx.t('Settings & data', 'ตั้งค่าและข้อมูล')}</button>
          </div>
        </div>
        <nav className="tabs" role="tablist">
          {TABS.map(([k, en, th]) => (
            <button key={k} type="button" role="tab" aria-selected={S.tab === k} onClick={() => { actions.setTab(k); window.scrollTo({ top: 0 }); }}>
              {S.lang === 'th' ? th : en}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
