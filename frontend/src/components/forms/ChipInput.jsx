import { useState } from 'react';
import { X } from 'lucide-react';

export default function ChipInput({ value = [], onChange, placeholder = 'Type a skill and press Enter' }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setInput('');
  };

  const remove = (chip) => onChange(value.filter((c) => c !== chip));

  return (
    <div className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white flex flex-wrap gap-2 items-center">
      {value.map((chip) => (
        <span key={chip} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
          {chip}
          <button type="button" onClick={() => remove(chip)}>
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); add(); }
        }}
        onBlur={add}
        placeholder={placeholder}
        className="flex-1 min-w-[140px] outline-none text-sm bg-transparent"
      />
    </div>
  );
}
