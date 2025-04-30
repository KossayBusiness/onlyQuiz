import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { existingConditions } from '@/data/questionsData';
import { UserProfile } from '@/utils/types';
import { Heart, Pill, AlertOctagon, Plus, X } from 'lucide-react';

interface Step5Props {
  userProfile: UserProfile;
  updateProfile: (key: string, value: any) => void;
  updateCondition: (condition: string, checked: boolean) => void;
}

const Step5MedicalHistory: React.FC<Step5Props> = ({ 
  userProfile, 
  updateProfile, 
  updateCondition 
}) => {
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  
  const addMedication = () => {
    if (newMedication.trim()) {
      const updatedMedications = [...userProfile.medications, newMedication.trim()];
      updateProfile('medications', updatedMedications);
      setNewMedication('');
    }
  };
  
  const removeMedication = (index: number) => {
    const updatedMedications = userProfile.medications.filter((_, idx) => idx !== index);
    updateProfile('medications', updatedMedications);
  };
  
  const addAllergy = () => {
    if (newAllergy.trim()) {
      const updatedAllergies = [...userProfile.allergies, newAllergy.trim()];
      updateProfile('allergies', updatedAllergies);
      setNewAllergy('');
    }
  };
  
  const removeAllergy = (index: number) => {
    const updatedAllergies = userProfile.allergies.filter((_, idx) => idx !== index);
    updateProfile('allergies', updatedAllergies);
  };
  
  return (
    <div className="quiz-step">
      <h3 className="font-heading font-semibold text-xl mb-4 text-neutral-800">Vos antécédents médicaux</h3>
      <p className="text-neutral-600 mb-6">Ces informations nous permettront de personnaliser davantage vos recommandations.</p>
      
      <div className="space-y-8">
        {/* Conditions médicales */}
        <div>
          <div className="flex items-center mb-3">
            <Heart className="h-5 w-5 text-primary-500 mr-2" />
            <Label className="block text-sm font-medium text-neutral-700">
              Conditions médicales (sélectionnez celles qui s'appliquent)
            </Label>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {existingConditions.map((condition) => (
              <button
                key={condition.id}
                type="button"
                className={`p-3 border rounded-lg text-left transition-all ${
                  userProfile.existingConditions.includes(condition.id)
                    ? 'bg-red-50 border-red-300 ring-2 ring-red-500' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-red-50'
                }`}
                onClick={() => updateCondition(
                  condition.id, 
                  !userProfile.existingConditions.includes(condition.id)
                )}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${
                    userProfile.existingConditions.includes(condition.id)
                      ? 'bg-red-500 border-red-600'
                      : 'bg-white border-neutral-300'
                  }`}>
                    {userProfile.existingConditions.includes(condition.id) && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <span className="text-sm">{condition.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Médicaments */}
        <div>
          <div className="flex items-center mb-3">
            <Pill className="h-5 w-5 text-primary-500 mr-2" />
            <Label className="block text-sm font-medium text-neutral-700">
              Médicaments actuels
            </Label>
          </div>
          
          <div className="space-y-3">
            <div className="flex">
              <Input
                type="text"
                placeholder="Ajouter un médicament..."
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                className="flex-1 rounded-r-none focus:z-10"
              />
              <Button 
                type="button" 
                onClick={addMedication}
                className="rounded-l-none bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {userProfile.medications.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {userProfile.medications.map((med, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>{med}</span>
                    <button 
                      type="button" 
                      className="ml-2 focus:outline-none"
                      onClick={() => removeMedication(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 mt-1">Aucun médicament ajouté</p>
            )}
          </div>
        </div>
        
        {/* Allergies */}
        <div>
          <div className="flex items-center mb-3">
            <AlertOctagon className="h-5 w-5 text-primary-500 mr-2" />
            <Label className="block text-sm font-medium text-neutral-700">
              Allergies connues
            </Label>
          </div>
          
          <div className="space-y-3">
            <div className="flex">
              <Input
                type="text"
                placeholder="Ajouter une allergie..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                className="flex-1 rounded-r-none focus:z-10"
              />
              <Button 
                type="button" 
                onClick={addAllergy}
                className="rounded-l-none bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {userProfile.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {userProfile.allergies.map((allergy, index) => (
                  <div 
                    key={index} 
                    className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>{allergy}</span>
                    <button 
                      type="button" 
                      className="ml-2 focus:outline-none"
                      onClick={() => removeAllergy(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 mt-1">Aucune allergie ajoutée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5MedicalHistory;
