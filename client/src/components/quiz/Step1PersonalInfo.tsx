import React from 'react';
import { Label } from "@/components/ui/label";
import { UserProfile } from '@/utils/types';

interface Step1Props {
  userProfile: UserProfile;
  updateProfile: (key: string, value: any) => void;
}

interface AgeGroupOption {
  value: number;
  label: string;
}

interface WeightOption {
  value: number;
  label: string;
  range: string;
}

interface HeightOption {
  value: number;
  label: string;
  range: string;
}

const Step1PersonalInfo: React.FC<Step1Props> = ({ userProfile, updateProfile }) => {
  // Options prédéfinies pour l'âge
  const ageGroups: AgeGroupOption[] = [
    { value: 25, label: "18-30 ans" },
    { value: 40, label: "31-50 ans" },
    { value: 60, label: "51-65 ans" },
    { value: 75, label: "66+ ans" }
  ];

  // Options prédéfinies pour le poids
  const weightOptions: WeightOption[] = [
    { value: 50, label: "Léger", range: "Moins de 60kg" },
    { value: 70, label: "Moyen", range: "60-80kg" },
    { value: 90, label: "Élevé", range: "81-100kg" },
    { value: 110, label: "Très élevé", range: "Plus de 100kg" }
  ];

  // Options prédéfinies pour la taille
  const heightOptions: HeightOption[] = [
    { value: 160, label: "Petite", range: "Moins de 165cm" },
    { value: 170, label: "Moyenne", range: "165-175cm" },
    { value: 180, label: "Grande", range: "176-185cm" },
    { value: 190, label: "Très grande", range: "Plus de 185cm" }
  ];
  
  return (
    <div className="quiz-step">
      <h3 className="font-heading font-semibold text-xl mb-4 text-neutral-800">Votre profil</h3>
      <p className="text-neutral-600 mb-6">Sélectionnez les informations qui correspondent à votre profil.</p>
      
      <div className="space-y-6">
        {/* Sélection du genre */}
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-3">Votre genre</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`p-4 border rounded-lg text-center transition-all ${
                userProfile.gender === 'male' 
                  ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500' 
                  : 'bg-neutral-50 border-neutral-200 hover:bg-blue-50'
              }`}
              onClick={() => updateProfile('gender', 'male')}
            >
              <span className="block text-lg mb-1">♂️</span>
              <span className="block text-sm font-medium">Homme</span>
            </button>
            
            <button
              type="button"
              className={`p-4 border rounded-lg text-center transition-all ${
                userProfile.gender === 'female' 
                  ? 'bg-pink-50 border-pink-300 ring-2 ring-pink-500' 
                  : 'bg-neutral-50 border-neutral-200 hover:bg-pink-50'
              }`}
              onClick={() => updateProfile('gender', 'female')}
            >
              <span className="block text-lg mb-1">♀️</span>
              <span className="block text-sm font-medium">Femme</span>
            </button>
          </div>
        </div>
        
        {/* Groupe d'âge */}
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-3">Votre tranche d'âge</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ageGroups.map((ageGroup) => (
              <button
                key={ageGroup.value}
                type="button"
                className={`p-3 border rounded-lg text-center transition-all ${
                  userProfile.age === ageGroup.value
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-indigo-50'
                }`}
                onClick={() => updateProfile('age', ageGroup.value)}
              >
                <span className="block text-sm font-medium">{ageGroup.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Poids */}
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-3">Votre poids</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {weightOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`p-3 border rounded-lg text-center transition-all ${
                  userProfile.weight === option.value
                    ? 'bg-green-50 border-green-300 ring-2 ring-green-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-green-50'
                }`}
                onClick={() => updateProfile('weight', option.value)}
              >
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-neutral-500 mt-1">{option.range}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Taille */}
        <div>
          <Label className="block text-sm font-medium text-neutral-700 mb-3">Votre taille</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {heightOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`p-3 border rounded-lg text-center transition-all ${
                  userProfile.height === option.value
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-purple-50'
                }`}
                onClick={() => updateProfile('height', option.value)}
              >
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-neutral-500 mt-1">{option.range}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1PersonalInfo;
