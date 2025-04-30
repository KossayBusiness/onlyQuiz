import React from 'react';
import ImportanceSelection from './ImportanceSelection';
import { goals } from '@/data/questionsData';
import { UserProfile } from '@/utils/types';

interface Step3Props {
  userProfile: UserProfile;
  updateGoal: (goalId: string, value: number) => void;
}

const Step3Goals: React.FC<Step3Props> = ({ userProfile, updateGoal }) => {
  return (
    <div className="quiz-step">
      <h3 className="font-heading font-semibold text-xl mb-4 text-neutral-800">Vos objectifs de santé</h3>
      
      <p className="text-neutral-600 mb-6">Sélectionnez l'importance de chaque objectif pour votre santé.</p>
      
      <div className="space-y-5">
        {goals.map((goal) => (
          <ImportanceSelection
            key={goal.id}
            id={goal.id}
            name={`goals.${goal.id}`}
            label={goal.label}
            value={userProfile.goals[goal.id] || 0}
            onChange={updateGoal}
          />
        ))}
      </div>
    </div>
  );
};

export default Step3Goals;
