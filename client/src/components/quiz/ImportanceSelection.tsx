import React from 'react';

interface ImportanceOption {
  value: number;
  label: string;
  color: string;
}

interface ImportanceSelectionProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (id: string, value: number) => void;
}

const ImportanceSelection: React.FC<ImportanceSelectionProps> = ({
  id,
  name,
  label,
  value,
  onChange
}) => {
  // Options prédéfinies pour simplifier le choix
  const importanceOptions: ImportanceOption[] = [
    { value: 0, label: 'Pas important', color: 'bg-neutral-100 border-neutral-200' },
    { value: 4, label: 'Peu important', color: 'bg-blue-50 border-blue-200' },
    { value: 7, label: 'Important', color: 'bg-indigo-50 border-indigo-200' },
    { value: 10, label: 'Très important', color: 'bg-purple-50 border-purple-200' }
  ];

  const handleOptionClick = (optionValue: number) => {
    onChange(id, optionValue);
  };

  return (
    <div className="goal-item mb-4">
      <div className="mb-2">
        <label className="block text-sm font-medium text-neutral-700" htmlFor={`importance-${id}`}>{label}</label>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {importanceOptions.map((option) => (
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

export default ImportanceSelection;