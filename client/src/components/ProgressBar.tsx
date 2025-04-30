import React from 'react';
import { Goal, Target, Activity, User, Stethoscope } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  // Définition des étapes du quiz avec icônes et titres
  const steps = [
    { icon: <Goal className="h-5 w-5" />, title: "Objectifs" },
    { icon: <Target className="h-5 w-5" />, title: "Symptômes" },
    { icon: <Activity className="h-5 w-5" />, title: "Style de vie" },
    { icon: <User className="h-5 w-5" />, title: "Profil" },
    { icon: <Stethoscope className="h-5 w-5" />, title: "Antécédents" }
  ];
  
  return (
    <div className="px-6 py-4 bg-primary-500 text-white">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg">Quiz Santé Personnalisé</h2>
        <div className="text-sm hidden md:block">Étape <span>{currentStep}</span> sur <span>{totalSteps}</span></div>
      </div>
      
      {/* Barre de progression */}
      <div className="w-full bg-white/30 rounded-full h-2.5 mt-2 mb-4">
        <div 
          className="bg-white h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Étapes visuelles */}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center transition-all ${
              currentStep === index + 1 
                ? 'text-white scale-110' 
                : currentStep > index + 1 
                  ? 'text-white/70' 
                  : 'text-white/50'
            }`}
          >
            <div className={`flex items-center justify-center rounded-full p-1 mb-1 ${
              currentStep === index + 1 
                ? 'bg-white text-primary-500' 
                : currentStep > index + 1 
                  ? 'bg-white/50 text-primary-500' 
                  : 'bg-white/30 text-white/70'
            }`}>
              {step.icon}
            </div>
            <span className="text-xs font-medium hidden md:block">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
