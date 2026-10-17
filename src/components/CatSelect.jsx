import Field from './Field.jsx';
import { GROUPS } from '../lib/categories.js';
import { useApp } from '../state/AppContext.jsx';

export default function CatSelect({ id, label, cats, value, onChange, kind }) {
  const { fx } = useApp();
  const groupKeys = kind === 'a' ? ['liquid', 'invest', 'personal'] : ['short', 'long'];

  return (
    <Field id={id} label={label} wide>
      <select id={id} name={id} value={value} onChange={e => onChange(e.target.value)}>
        {groupKeys.map(g => (
          <optgroup key={g} label={fx.nm(GROUPS[g].n)}>
            {cats.filter(c => c.g === g).map(c => (
              <option key={c.k} value={c.k}>{fx.nm(c.n)}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </Field>
  );
}
