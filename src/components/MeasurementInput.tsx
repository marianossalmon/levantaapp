import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

interface MeasurementInputProps {
  x: number;
  y: number;
  value: number | null;
  onChange: (val: number) => void;
  isReferenceScale?: boolean;
  scaleReady?: boolean;
  autoScaledValue?: number | null;
}

export default function MeasurementInput({
  x, y, value, onChange, isReferenceScale, scaleReady, autoScaledValue
}: MeasurementInputProps) {
  const [isEditing, setIsEditing] = useState(value === null);
  const [tempValue, setTempValue] = useState(value ? value.toString() : '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempValue);
    if (!isNaN(parsed) && parsed > 0) {
      onChange(parsed);
      setIsEditing(false);
    }
  };

  const displayValue = value !== null ? value : autoScaledValue;

  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
      style={{ left: x, top: y }}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-1 bg-black p-1 rounded border border-[#00FF00] shadow-md">
          <input
            ref={inputRef}
            type="number"
            step="0.1"
            className="w-16 bg-transparent text-[#00FF00] text-xs font-mono font-bold text-center outline-none ring-0 appearance-none"
            placeholder="cm"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => {
              if (tempValue) handleSubmit({ preventDefault: () => {} } as any);
              else setIsEditing(false);
            }}
          />
          <button type="submit" className="text-black bg-[#00FF00] rounded p-0.5">
            <Check size={14} />
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsEditing(true)}
          className={cn(
            "px-2 py-0.5 rounded text-[12px] font-mono font-bold shadow-md transition-all inline-block",
            value !== null ? "bg-white text-black" : 
            autoScaledValue !== null ? "bg-white text-black" : 
            "bg-black text-[#00FF00] border border-[#00FF00]"
          )}
        >
          {displayValue ? `${displayValue.toFixed(1)} cm` : '? cm'}
        </button>
      )}
    </div>
  );
}
