import React from 'react';
import { Label } from "@/components/ui/label";
import { activityLevels, dietTypes, dietaryPatterns } from '@/data/questionsData';
import { UserProfile } from '@/utils/types';
import { Activity, Utensils, AlertCircle } from 'lucide-react';

interface Step4Props {
  userProfile: UserProfile;
  updateProfile: (key: string, value: any) => void;
  updateDietaryPattern: (pattern: string, checked: boolean) => void;
}

const Step4Lifestyle: React.FC<Step4Props> = ({ userProfile, updateProfile, updateDietaryPattern }) => {
  return (
    <div className="quiz-step">
      <h3 className="font-heading font-semibold text-xl mb-4 text-neutral-800">Votre style de vie</h3>
      <p className="text-neutral-600 mb-6">Parlez-nous de vos habitudes quotidiennes.</p>
      
      <div className="space-y-8">
        {/* Niveau d'activité physique */}
        <div>
          <div className="flex items-center mb-3">
            <Activity className="h-5 w-5 text-primary-500 mr-2" />
            <Label className="block text-sm font-medium text-neutral-700">Niveau d'activité physique</Label>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {activityLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                className={`p-3 border rounded-lg text-center transition-all ${
                  userProfile.activityLevel === level.value
                    ? 'bg-green-50 border-green-300 ring-2 ring-green-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-green-50'
                }`}
                onClick={() => updateProfile('activityLevel', level.value)}
              >
                <span className="block text-sm font-medium">{level.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Régime alimentaire */}
        <div>
          <div className="flex items-center mb-3">
            <Utensils className="h-5 w-5 text-primary-500 mr-2" />
            <Label className="block text-sm font-medium text-neutral-700">Type d'alimentation</Label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {dietTypes.map((diet) => (
              <button
                key={diet.value}
                type="button"
                className={`p-3 border rounded-lg text-center transition-all ${
                  userProfile.dietType === diet.value
                    ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-blue-50'
                }`}
                onClick={() => updateProfile('dietType', diet.value)}
              >
                <span className="block text-sm font-medium">{diet.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Habitudes alimentaires */}
        <div>
          <div className="flex items-center mb-3">
            <AlertCircle className="h-5 w-5 text-primary-500 mr-2" />
            <Label className="block text-sm font-medium text-neutral-700">
              Habitudes alimentaires (sélectionnez celles qui s'appliquent)
            </Label>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dietaryPatterns.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                className={`p-3 border rounded-lg text-left transition-all ${
                  userProfile.dietaryPatterns?.includes(pattern.id)
                    ? 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-yellow-50'
                }`}
                onClick={() => updateDietaryPattern(
                  pattern.id, 
                  !userProfile.dietaryPatterns?.includes(pattern.id)
                )}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${
                    userProfile.dietaryPatterns?.includes(pattern.id)
                      ? 'bg-yellow-500 border-yellow-600'
                      : 'bg-white border-neutral-300'
                  }`}>
                    {userProfile.dietaryPatterns?.includes(pattern.id) && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <span className="text-sm">{pattern.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Lifestyle;
