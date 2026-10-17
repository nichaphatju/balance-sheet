import { useApp } from '../state/AppContext.jsx';

export default function SampleBanner() {
  const { S, fx, actions } = useApp();
  if (!S.isSample) return null;

  return (
    <div className="banner">
      <p>
        {fx.t('These are ', 'ตัวเลขนี้เป็น')}
        <b>{fx.t('example figures', 'ข้อมูลตัวอย่าง')}</b>
        {fx.t(' so you can see how the app works. Your own data is saved only in this browser.', ' เพื่อให้เห็นการทำงานของแอป ข้อมูลของคุณจะบันทึกไว้ในเบราว์เซอร์นี้เท่านั้น')}
      </p>
      <button type="button" className="btn pri" onClick={actions.startOwn}>
        {fx.t('Start with my own data', 'เริ่มกรอกข้อมูลของฉัน')}
      </button>
    </div>
  );
}
