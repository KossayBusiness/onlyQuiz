import React from 'react';

interface SeverityOption {
  value: number;
  label: string;
  color: string;
}

interface SeveritySelectionProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (id: string, value: number) => void;
}

const SeveritySelection: React.FC<SeveritySelectionProps> = ({
  id,
  name,
  label,
  value,
  onChange
}) => {
  // Options prédéfinies pour simplifier le choix
  const severityOptions: SeverityOption[] = [
    { value: 0, label: 'Absent', color: 'bg-neutral-100 border-neutral-200' },
    { value: 3, label: 'Léger', color: 'bg-green-50 border-green-200' },
    { value: 6, label: 'Modéré', color: 'bg-yellow-50 border-yellow-200' },
    { value: 9, label: 'Sévère', color: 'bg-red-50 border-red-200' }
  ];

  const handleOptionClick = (optionValue: number) => {
    onChange(id, optionValue);
  };

  return (
    <div className="symptom-item mb-4">
      <div className="mb-2">
        <label className="block text-sm font-medium text-neutral-700" htmlFor={`severity-${id}`}>{label}</label>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {severityOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${option.color} border rounded-lg p-3 text-center transition-all ${
              value === option.value 
                ? 'ring-2 ring-primary-500 font-medium' 
                : 'hover:bg-opacity-80'
            }`}
            onClick={() => handleOptionClick(option.value)}
          >
            <span className="block text-sm">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeveritySelection;