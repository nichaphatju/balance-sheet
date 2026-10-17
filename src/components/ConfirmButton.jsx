import { useEffect, useRef, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';

/** A button that requires a second click within 3s to actually fire, to guard destructive actions. */
export default function ConfirmButton({ className, onConfirm, children }) {
  const { fx } = useApp();
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = () => {
    if (armed) { setArmed(false); clearTimeout(timer.current); onConfirm(); return; }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), 3000);
  };

  return (
    <button type="button" className={(className || '') + (armed ? ' armed' : '')} onClick={onClick}>
      {armed ? fx.t('Tap again to confirm', 'กดอีกครั้งเพื่อยืนยัน') : children}
    </button>
  );
}
