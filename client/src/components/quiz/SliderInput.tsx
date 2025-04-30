import React from 'react';

interface SliderInputProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (id: string, value: number) => void;
  minLabel?: string;
  midLabel?: string;
  maxLabel?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  minLabel = 'Absent',
  midLabel = 'Modéré',
  maxLabel = 'Sévère'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(id, parseInt(e.target.value));
  };

  return (
    <div className="symptom-item">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-neutral-700" htmlFor={`slider-${id}`}>{label}</label>
        <span className="text-sm font-medium text-primary-600 symptom-value">{value}</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="10" 
        value={value} 
        className="range-slider w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer" 
        id={`slider-${id}`} 
        name={name}
        onChange={handleChange}
      />
      <div className="flex justify-between text-xs text-neutral-500 mt-1">
        <span>{minLabel}</span>
        <span>{midLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

export default SliderInput;
