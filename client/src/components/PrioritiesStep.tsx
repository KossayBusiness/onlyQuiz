import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Info, Check, CheckCircle2, Pill, X, Meh, AlertCircle,
  Heart, Zap, Moon, Brain, ShieldCheck, Scale, Sparkles, Utensils,
  Clock
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PrioritiesStepProps {
  quizData: {
    objectives: string[];
    supplementHistory: string;
    mainConcern: string;
    mainConcerns?: string[];
    [key: string]: any;
  };
  setQuizData: React.Dispatch<React.SetStateAction<any>>;
  OBJECTIVE_ICONS: Record<string, React.ReactNode>;
}

const PrioritiesStep = ({ quizData, setQuizData, OBJECTIVE_ICONS }: PrioritiesStepProps) => {
  // Fonction pour mettre à jour les objectifs
  const updateObjectives = (objective: string, isSelected: boolean) => {
    setQuizData((prev: any) => {
      if (isSelected) {
        return { ...prev, objectives: [...prev.objectives, objective] };
      } else {
        return { ...prev, objectives: prev.objectives.filter((o: string) => o !== objective) };
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 rounded-lg border-l-4 border-violet-400">
        <h2 className="text-xl font-medium mb-2 text-violet-800 flex items-center">
          <Star className="mr-2 text-violet-500 h-5 w-5" />
          Objectifs et Priorités
        </h2>
        <p className="text-gray-600">Sélectionnez vos objectifs et priorités pour personnaliser vos recommandations.</p>
      </div>
      
      {/* Health Goals Section */}
      <div>
        <h3 className="text-lg font-medium text-violet-900 mb-3 flex items-center">
          <Star className="w-5 h-5 mr-2 text-violet-500" />
          Quels sont vos objectifs de santé principaux ?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'energy', label: 'Plus d\'énergie', icon: <Zap className="h-4 w-4 text-amber-500" /> },
            { id: 'sleep', label: 'Mieux dormir', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
            { id: 'concentration', label: 'Améliorer la concentration', icon: <Brain className="h-4 w-4 text-blue-500" /> },
            { id: 'immunity', label: 'Renforcer l\'immunité', icon: <ShieldCheck className="h-4 w-4 text-teal-500" /> },
            { id: 'stress', label: 'Réduire le stress', icon: <Heart className="h-4 w-4 text-rose-500" /> },
            { id: 'digestion', label: 'Améliorer la digestion', icon: <Utensils className="h-4 w-4 text-purple-500" /> },
            { id: 'skin', label: 'Améliorer la peau', icon: <Sparkles className="h-4 w-4 text-pink-500" /> },
            { id: 'weight', label: 'Équilibrer le poids', icon: <Scale className="h-4 w-4 text-gray-500" /> },
          ].map((objective) => (
            <div key={objective.id} className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg flex items-start cursor-pointer border ${
                  quizData.objectives.includes(objective.label)
                    ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => updateObjectives(objective.label, !quizData.objectives.includes(objective.label))}
              >
                <div className="mr-2 mt-0.5">
                  <div className={`h-5 w-5 rounded flex items-center justify-center ${
                    quizData.objectives.includes(objective.label) 
                      ? 'bg-violet-500 text-white' 
                      : 'border border-gray-300'
                  }`}>
                    {quizData.objectives.includes(objective.label) && 
                      <Check className="h-3.5 w-3.5" />
                    }
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">{objective.icon}</span>
                  <p className="text-gray-900 font-medium">{objective.label}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Advanced Questions - Now part of Priorities */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-indigo-900 flex items-center">
            <Brain className="mr-2 text-indigo-500 h-5 w-5" />
            Informations supplémentaires importantes
          </h3>
          <p className="text-gray-600 text-sm">Ces détails nous aident à affiner vos recommandations de compléments.</p>
        </div>
        
        {/* Supplement History */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center">
            <Pill className="w-5 h-5 mr-2 text-purple-500" />
            Avez-vous déjà essayé des compléments alimentaires ?
          </h3>
          
          <RadioGroup 
            value={quizData.supplementHistory} 
            onValueChange={(value) => setQuizData((prev: any) => ({...prev, supplementHistory: value}))}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {[
              { 
                value: 'never', 
                label: 'Jamais essayé', 
                description: 'Je n\'ai jamais pris de compléments',
                icon: <X className="h-4 w-4 text-gray-500" />
              },
              { 
                value: 'some', 
                label: 'Quelques-uns', 
                description: 'Sans résultats notables',
                icon: <Meh className="h-4 w-4 text-amber-500" />
              },
              { 
                value: 'positive', 
                label: 'Bonne expérience', 
                description: 'Avec des résultats positifs',
                icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
              },
              { 
                value: 'negative', 
                label: 'Expérience négative', 
                description: 'Effets indésirables ou sans bénéfice',
                icon: <AlertCircle className="h-4 w-4 text-red-500" />
              },
            ].map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem 
                  value={option.value} 
                  id={`supp-${option.value}`} 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor={`supp-${option.value}`} 
                  className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer
                    peer-checked:border-purple-400 peer-checked:bg-purple-50 peer-checked:shadow-sm
                    ${quizData.supplementHistory === option.value 
                      ? 'border-purple-400 bg-purple-50 text-purple-800' 
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  <div className="mr-3 flex-shrink-0">
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Main Health Concern - Modifié pour permettre la sélection multiple */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Quelles sont vos préoccupations de santé principales ?
          </h3>
          
          <div className="grid grid-cols-1 gap-2">
            {[
              { 
                value: 'energy', 
                label: 'Niveau d\'énergie', 
                description: 'Je veux me sentir plus énergique',
                icon: <Zap className="h-4 w-4 text-amber-500" />
              },
              { 
                value: 'sleep', 
                label: 'Qualité du sommeil', 
                description: 'Je veux mieux dormir',
                icon: <Moon className="h-4 w-4 text-blue-500" />
              },
              { 
                value: 'mood', 
                label: 'Humeur et stress', 
                description: 'Je veux me sentir plus équilibré(e)',
                icon: <Heart className="h-4 w-4 text-rose-500" />
              },
              { 
                value: 'immunity', 
                label: 'Système immunitaire', 
                description: 'Je veux renforcer mon immunité',
                icon: <ShieldCheck className="h-4 w-4 text-green-500" />
              },
              { 
                value: 'longevity', 
                label: 'Vieillissement en santé', 
                description: 'Je veux préserver ma santé à long terme',
                icon: <Clock className="h-4 w-4 text-purple-500" />
              },
            ].map((option) => {
              // Vérifier si cette préoccupation est sélectionnée
              const isSelected = Array.isArray(quizData.mainConcerns) && quizData.mainConcerns.includes(option.value);
              
              // Fonction pour mettre à jour les préoccupations sélectionnées
              const toggleConcern = () => {
                setQuizData((prev: any) => {
                  // Initialiser le tableau s'il n'existe pas encore
                  const currentConcerns = Array.isArray(prev.mainConcerns) ? [...prev.mainConcerns] : [];
                  
                  // Ajouter ou enlever la préoccupation selon son état actuel
                  if (isSelected) {
                    return {
                      ...prev,
                      mainConcerns: currentConcerns.filter(c => c !== option.value),
                      // Maintenir la compatibilité avec l'ancien format en gardant la première préoccupation comme principale
                      mainConcern: currentConcerns.filter(c => c !== option.value)[0] || ''
                    };
                  } else {
                    const newConcerns = [...currentConcerns, option.value];
                    return {
                      ...prev,
                      mainConcerns: newConcerns,
                      // Maintenir la compatibilité avec l'ancien format
                      mainConcern: newConcerns[0] || ''
                    };
                  }
                });
              };
              
              return (
                <motion.div 
                  key={option.value}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer
                    ${isSelected
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-800 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  onClick={toggleConcern}
                >
                  <div className="mr-3 flex-shrink-0">
                    <div className={`h-5 w-5 rounded flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-500 text-white'
                        : 'border border-gray-300'
                    }`}>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                  <div className="mr-3 flex-shrink-0">
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Message informatif */}
      {quizData.objectives.length > 0 && (
        <motion.div 
          className="mt-6 bg-violet-50 p-4 rounded-lg border border-violet-100 flex items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mr-3 text-violet-500 mt-1">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <p className="text-violet-800 text-sm">
              <span className="font-medium">Vous avez sélectionné {quizData.objectives.length} objectif{quizData.objectives.length > 1 ? 's' : ''}.</span> 
              {' '}Vos objectifs influenceront significativement nos recommandations de compléments personnalisées.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PrioritiesStep;