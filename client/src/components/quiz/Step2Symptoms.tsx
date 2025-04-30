import React from 'react';
import SeveritySelection from './SeveritySelection';
import { symptoms } from '@/data/questionsData';
import { UserProfile } from '@/utils/types';

interface Step2Props {
  userProfile: UserProfile;
  updateSymptom: (symptomId: string, value: number) => void;
}

const Step2Symptoms: React.FC<Step2Props> = ({ userProfile, updateSymptom }) => {
  return (
    <div className="quiz-step">
      <h3 className="font-heading font-semibold text-xl mb-4 text-neutral-800">Vos symptômes et préoccupations</h3>
      
      <p className="text-neutral-600 mb-6">Sélectionnez l'intensité de chaque symptôme que vous ressentez.</p>
      
      <div className="space-y-5">
        {symptoms.map((symptom) => (
          <SeveritySelection
            key={symptom.id}
            id={symptom.id}
            name={`symptoms.${symptom.id}`}
            label={symptom.label}
            value={userProfile.symptoms[symptom.id] || 0}
            onChange={updateSymptom}
          />
        ))}
      </div>
    </div>
  );
};

export default Step2Symptoms;
