import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import PrioritiesStep from '../components/PrioritiesStep';
import AnalysisAnimation from '../components/AnalysisAnimation';
import { 
  Battery, BatteryCharging, BookOpen, Brain, Calendar, Coffee, Dumbbell, Heart, 
  Flame, User, Users, Zap, Moon, AlertCircle, Sun, GraduationCap, 
  Pill, Waves, ActivitySquare, Fish, Drumstick, Apple,
  Salad, Utensils, ShieldCheck, Smartphone, Star, HeartPulse, Smile,
  Sparkles, Gauge, Scale, Bot, PanelRightOpen, Eye, EyeOff,
  X, ChevronRight, Info, CheckCircle2, Clock, AlarmClock, Droplet,
  Sunrise, BedDouble, Tablet, Thermometer, Tv, Check, HelpCircle,
  Activity, Sunset, Wind, Leaf, Fingerprint, Hand, DollarSign,
  Wine, Briefcase, Meh, Circle, ArrowUp, Cloud, Lightbulb as LightbulbIcon,
  RefreshCcw, ChevronDown, ChevronUp
} from 'lucide-react';

// Importer le système de normalisation des identifiants
import { 
  normalizeSymptomId, 
  normalizeGoalId, 
  normalizeQuizData 
} from '../utils/normalization';

// Importer les fonctions pour gérer les symptômes et étapes du quiz
import { 
  isSkippableSymptom, 
  canSkipSymptomDetailsStep, 
  needsAdvancedQuestions,
  SKIPPABLE_SYMPTOMS 
} from '../data/skippableSymptoms';

// Importer le système prédictif pour optimiser le quiz
import {
  predictFromUserResponses,
  generatePredictiveQuestions,
  getNextQuestions,
  QuizResponse as PredictiveQuizResponse,
  PredictionResult
} from '../utils/predictiveQuizSystem';

// Definition of quiz steps with icons and descriptions
// Modifié pour inclure une étape démographique et diviser les questions détaillées
const STEPS = [
  { 
    id: "demographics", 
    label: "Profil", 
    icon: <User className="w-5 h-5" />,
    description: "Informations importantes pour des recommandations personnalisées précises."
  },
  { 
    id: "symptoms", 
    label: "Symptômes", 
    icon: <AlertCircle className="w-5 h-5" />,
    description: "Identifiez vos symptômes principaux pour des recommandations précises."
  },
  { 
    id: "symptom-details", 
    label: "Symptômes", 
    icon: <Sparkles className="w-5 h-5" />,
    description: "Précisez l'intensité et la fréquence de vos symptômes."
  },
  { 
    id: "health-details", 
    label: "Habitudes", 
    icon: <Activity className="w-5 h-5" />,
    description: "Quelques questions sur vos habitudes alimentaires et votre santé."
  },
  { 
    id: "lifestyle", 
    label: "Mode de vie", 
    icon: <HeartPulse className="w-5 h-5" />,
    description: "Votre mode de vie influence directement le choix et le dosage des compléments."
  },
  { 
    id: "priorities", 
    label: "Priorités", 
    icon: <Star className="w-5 h-5" />,
    description: "Vos objectifs et besoins spécifiques pour optimiser les recommandations finales."
  }
];

// Mapping symptoms with their icons
const SYMPTOM_ICONS: Record<string, React.ReactNode> = {
  // Labels français pour les symptômes
  'Fatigue': <Zap className="w-4 h-4 text-blue-500" />,
  'Troubles du sommeil': <Moon className="w-4 h-4 text-indigo-500" />,
  'Stress/Anxiété': <Heart className="w-4 h-4 text-amber-500" />,
  'Problèmes digestifs': <Utensils className="w-4 h-4 text-teal-500" />,
  'Douleurs articulaires': <Dumbbell className="w-4 h-4 text-rose-500" />,
  'Problèmes de peau': <Sparkles className="w-4 h-4 text-purple-500" />,
  'Maux de tête': <AlertCircle className="w-4 h-4 text-red-500" />,
  'Sautes d\'humeur': <Smile className="w-4 h-4 text-orange-500" />,
  'Sensibilité au froid': <Sun className="w-4 h-4 text-yellow-500" />,
  'Manque de concentration': <Brain className="w-4 h-4 text-cyan-500" />,
  'Fringales': <Apple className="w-4 h-4 text-green-500" />,
  'Cheveux/ongles cassants': <Sparkles className="w-4 h-4 text-fuchsia-500" />,
  'Manque d\'énergie': <Battery className="w-4 h-4 text-amber-500" />,
  'Ballonnements': <Utensils className="w-4 h-4 text-emerald-500" />,
  'Faible immunité': <ShieldCheck className="w-4 h-4 text-blue-500" />,
  
  // Garder aussi les versions anglaises pour la compatibilité avec le code existant
  'Sleep issues': <Moon className="w-4 h-4 text-indigo-500" />,
  'Stress/Anxiety': <Heart className="w-4 h-4 text-amber-500" />,
  'Digestive problems': <Utensils className="w-4 h-4 text-teal-500" />,
  'Joint pain': <Dumbbell className="w-4 h-4 text-rose-500" />,
  'Skin problems': <Sparkles className="w-4 h-4 text-purple-500" />,
  'Headaches': <AlertCircle className="w-4 h-4 text-red-500" />,
  'Mood swings': <Smile className="w-4 h-4 text-orange-500" />,
  'Cold sensitivity': <Sun className="w-4 h-4 text-yellow-500" />,
  'Lack of concentration': <Brain className="w-4 h-4 text-cyan-500" />,
  'Food cravings': <Apple className="w-4 h-4 text-green-500" />,
  'Brittle hair/nails': <Sparkles className="w-4 h-4 text-fuchsia-500" />,
  'Low energy': <Battery className="w-4 h-4 text-amber-500" />,
  'Bloating': <Utensils className="w-4 h-4 text-emerald-500" />,
  'Poor immunity': <ShieldCheck className="w-4 h-4 text-blue-500" />,
};

// Mapping goals with their icons
const OBJECTIVE_ICONS: Record<string, React.ReactNode> = {
  'More energy': <Zap className="w-4 h-4 text-amber-500" />,
  'Better sleep': <Moon className="w-4 h-4 text-indigo-500" />,
  'Improve concentration': <Brain className="w-4 h-4 text-blue-500" />,
  'Strengthen immunity': <ShieldCheck className="w-4 h-4 text-teal-500" />,
  'Reduce stress': <Heart className="w-4 h-4 text-rose-500" />,
  'Support digestion': <Utensils className="w-4 h-4 text-purple-500" />,
  'Improve skin': <Sparkles className="w-4 h-4 text-pink-500" />,
  'Balance weight': <Scale className="w-4 h-4 text-gray-500" />,
  'Mental clarity': <Brain className="w-4 h-4 text-cyan-500" />,
  'Athletic performance': <Dumbbell className="w-4 h-4 text-blue-500" />,
  'Healthy aging': <Sparkles className="w-4 h-4 text-fuchsia-500" />,
};

export default function QuizPage() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const [quizData, setQuizData] = useState(() => {
    // Réinitialiser complètement les données du quiz à chaque démarrage
    // pour éviter toute présélection non voulue
    sessionStorage.removeItem('quizData');
    return {
      symptoms: [] as string[],
      dietType: '',
      activityLevel: '',
      sleepQuality: '',
      stressLevel: '',
      objectives: [] as string[],
      goals: [] as string[], // Ajout du champ goals pour la compatibilité
      meatConsumption: '',
      fishConsumption: '',
      fruitsVegetables: '',
      supplementHistory: '', // Ajouté pour l'étape Priorités
      mainConcern: '', // Ajouté pour l'étape Priorités
      mainConcerns: [] as string[], // Ajouté pour permettre la sélection multiple des préoccupations
      // Données démographiques critiques
      age: '',
      gender: '',
      medications: [] as string[],
      specificQuestions: [] as {id: string, question: string, answer: string, importance: number}[],
    };
  });
  
  // État pour les questions dynamiques basées sur les réponses précédentes
  const [dynamicQuestions, setDynamicQuestions] = useState<{
    id: string;
    question: string;
    type: 'select' | 'radio' | 'text' | 'slider';
    options?: {value: string, label: string, icon?: JSX.Element}[];
    condition: {field: string, value: any, operator: 'includes' | 'equals' | 'notEquals' | 'greaterThan' | 'lessThan'};
    importance: number;
    answered: boolean;
    followUp?: string;
  }[]>([]);
  
  // Interface pour la réponse du quiz (importée du système prédictif)
  interface QuizResponse {
    symptoms: string[];
    symptomDetails?: Record<string, any>;
    dietType?: string;
    dietaryPatterns?: string[];
    stressLevel?: string;
    sleepQuality?: string;
    goals?: string[];
    sunExposure?: string;
    // Données démographiques critiques
    age?: string;
    gender?: string;
    medications?: string[];
    [key: string]: any;
  }
  
  // Vérifie si on peut utiliser le système de quiz adaptatif
  const canUseAdaptiveQuiz = () => {
    // Vérifier si nous avons suffisamment de données pour activer le système prédictif
    const hasEnoughData = quizData.symptoms && quizData.symptoms.length > 0;
    
    // L'étape actuelle doit permettre l'utilisation du système adaptatif
    // (généralement à partir de l'étape 1, après la sélection des symptômes principaux)
    const isCompatibleStep = currentStep > 0;
    
    // Vérifier si nous sommes à l'étape "symptom-details" (étape 2)
    const isSymptomDetailsStep = STEPS[currentStep]?.id === 'symptom-details';
    
    // Intégration avec les données démographiques :
    // Utiliser les données démographiques seulement si elles sont disponibles
    const hasDemographicData = quizData.age || quizData.gender || (quizData.medications && quizData.medications.length > 0);
    
    console.log("Démographies disponibles pour le quiz adaptatif:", hasDemographicData ? "Oui" : "Non");
    
    // Permettre l'utilisation du système adaptatif si nous sommes à l'étape des détails de symptômes
    // et que nous avons soit des données démographiques soit des symptômes sélectionnés
    return hasEnoughData && (isCompatibleStep || (isSymptomDetailsStep && hasDemographicData));
  };
  
// Utiliser le système de questions adaptatif basé sur les réponses existantes
const useAdaptiveQuestionSystem = () => {
  console.log("Activation du système de questions adaptatif");
  
  // Convertir quizData au format attendu par le système prédictif
  // Inclure toutes les données démographiques importantes
  const predictiveQuizData: Partial<PredictiveQuizResponse> = {
    symptoms: quizData.symptoms,
    dietType: quizData.dietType,
    sleepQuality: quizData.sleepQuality,
    stressLevel: quizData.stressLevel,
    goals: quizData.objectives,
    // Inclure les données démographiques
    age: quizData.age,
    gender: quizData.gender,
    medications: quizData.medications,
    // Ajouter tous les autres champs pertinents
    symptomDetails: quizData.specificQuestions?.reduce((acc, q) => {
      acc[q.id] = q.answer;
      return acc;
    }, {} as Record<string, any>)
  };
  
  // Générer les prédictions
  const predictions = predictFromUserResponses(predictiveQuizData);
  console.log("Prédictions générées:", predictions);
  
  // Obtenir les questions suivantes en fonction des prédictions
  // Utiliser la dernière question répondue, ou par défaut l'ID d'étape actuelle
  const lastAnsweredQuestionId = quizData.specificQuestions?.length > 0
    ? quizData.specificQuestions[quizData.specificQuestions.length - 1].id
    : `step_${currentStep}`;
  
  // Déterminer les questions suivantes en fonction des prédictions et de l'étape actuelle
  // Passer toutes les données du quiz, y compris les informations démographiques
  const nextQuestions = getNextQuestions(predictiveQuizData, lastAnsweredQuestionId);
  
  console.log("Questions adaptatives:", nextQuestions.length);
  console.log("Suppléments suggérés:", predictions.suggestedSupplements);
  
  // Les suppléments suggérés peuvent être enregistrés pour une utilisation ultérieure
  if (predictions.suggestedSupplements.length > 0) {
    setQuizData(prev => ({
      ...prev,
      predictedSupplements: predictions.suggestedSupplements
    }));
  }
  
  return nextQuestions;
};
  
  // Convertit les types de questions entre le format prédictif et le format du quiz
  const convertQuestionType = (predictiveType: string): 'select' | 'radio' | 'text' | 'slider' => {
    switch (predictiveType) {
      case 'multiple_choice':
        return 'select';
      case 'single_choice':
        return 'radio';
      case 'text_input':
        return 'text';
      case 'scale':
        return 'slider';
      case 'combined':
        return 'select'; // On convertit le type combiné en select pour simplifier
      default:
        return 'radio'; // Type par défaut
    }
  };
  
  // Auto-sauvegarde des données
  useEffect(() => {
    // Sauvegarder les données dans sessionStorage à chaque changement
    sessionStorage.setItem('quizData', JSON.stringify(quizData));
    
    // Générer des questions dynamiques basées sur les symptômes et le régime alimentaire
    generateDynamicQuestions();
  }, [quizData, currentStep]);
  
  // Fonction qui génère des questions spécifiques à chaque symptôme
  // Optimisée pour se concentrer uniquement sur les symptômes les plus importants
  const getSymptomSpecificQuestion = (symptom: string) => {
    // Questions personnalisées en fonction du symptôme - seulement pour les 5 symptômes les plus impactants
    const specificQuestions: Record<string, React.ReactNode> = {
      'Fatigue': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">À quel moment ressentez-vous le plus de fatigue ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'morning', label: 'Le matin', icon: <Sun className="h-3 w-3 text-amber-500" /> },
              { value: 'afternoon', label: 'L\'après-midi', icon: <Sun className="h-3 w-3 text-orange-500" /> },
              { value: 'evening', label: 'Le soir', icon: <Moon className="h-3 w-3 text-blue-500" /> },
              { value: 'all-day', label: 'Toute la journée', icon: <Clock className="h-3 w-3 text-red-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-timing`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-timing`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      'Douleurs articulaires': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">À quels endroits ressentez-vous des douleurs ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'knees', label: 'Genoux', icon: <Activity className="h-3 w-3 text-red-500" /> },
              { value: 'back', label: 'Dos', icon: <Activity className="h-3 w-3 text-orange-500" /> },
              { value: 'hands', label: 'Mains/Poignets', icon: <Hand className="h-3 w-3 text-amber-500" /> },
              { value: 'shoulders', label: 'Épaules', icon: <Activity className="h-3 w-3 text-blue-500" /> },
              { value: 'multiple', label: 'Plusieurs articulations', icon: <Users className="h-3 w-3 text-purple-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-location`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-location`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      // Pour compatibilité
      'Joint pain': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">À quels endroits ressentez-vous des douleurs ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'knees', label: 'Genoux', icon: <Activity className="h-3 w-3 text-red-500" /> },
              { value: 'back', label: 'Dos', icon: <Activity className="h-3 w-3 text-orange-500" /> },
              { value: 'hands', label: 'Mains/Poignets', icon: <Hand className="h-3 w-3 text-amber-500" /> },
              { value: 'shoulders', label: 'Épaules', icon: <Activity className="h-3 w-3 text-blue-500" /> },
              { value: 'multiple', label: 'Plusieurs articulations', icon: <Users className="h-3 w-3 text-purple-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-location`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-location`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      'Troubles du sommeil': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quel est votre principal problème de sommeil ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'falling', label: 'Difficulté à s\'endormir', icon: <Moon className="h-3 w-3 text-indigo-500" /> },
              { value: 'staying', label: 'Réveils nocturnes', icon: <Sunrise className="h-3 w-3 text-amber-500" /> },
              { value: 'early', label: 'Réveil trop matinal', icon: <Sun className="h-3 w-3 text-red-500" /> },
              { value: 'quality', label: 'Sommeil non réparateur', icon: <BedDouble className="h-3 w-3 text-blue-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-type`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-type`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      // Pour compatibilité
      'Sleep issues': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quel est votre principal problème de sommeil ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'falling', label: 'Difficulté à s\'endormir', icon: <Moon className="h-3 w-3 text-indigo-500" /> },
              { value: 'staying', label: 'Réveils nocturnes', icon: <Sunrise className="h-3 w-3 text-amber-500" /> },
              { value: 'early', label: 'Réveil trop matinal', icon: <Sun className="h-3 w-3 text-red-500" /> },
              { value: 'quality', label: 'Sommeil non réparateur', icon: <BedDouble className="h-3 w-3 text-blue-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-type`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-type`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      'Problèmes digestifs': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quels symptômes digestifs avez-vous principalement ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'bloating', label: 'Ballonnements', icon: <Circle className="h-3 w-3 text-amber-500" /> },
              { value: 'pain', label: 'Douleurs abdominales', icon: <Activity className="h-3 w-3 text-red-500" /> },
              { value: 'diarrhea', label: 'Diarrhée', icon: <Waves className="h-3 w-3 text-blue-500" /> },
              { value: 'constipation', label: 'Constipation', icon: <Clock className="h-3 w-3 text-purple-500" /> },
              { value: 'reflux', label: 'Reflux acide', icon: <ArrowUp className="h-3 w-3 text-orange-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-symptoms`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-symptoms`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      // Pour compatibilité
      'Digestive problems': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quels symptômes digestifs avez-vous principalement ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'bloating', label: 'Ballonnements', icon: <Circle className="h-3 w-3 text-amber-500" /> },
              { value: 'pain', label: 'Douleurs abdominales', icon: <Activity className="h-3 w-3 text-red-500" /> },
              { value: 'diarrhea', label: 'Diarrhée', icon: <Waves className="h-3 w-3 text-blue-500" /> },
              { value: 'constipation', label: 'Constipation', icon: <Clock className="h-3 w-3 text-purple-500" /> },
              { value: 'reflux', label: 'Reflux acide', icon: <ArrowUp className="h-3 w-3 text-orange-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-symptoms`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-symptoms`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      'Stress/Anxiété': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Comment se manifeste principalement votre stress ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'mental', label: 'Pensées anxieuses', icon: <Brain className="h-3 w-3 text-purple-500" /> },
              { value: 'physical', label: 'Tension physique', icon: <Activity className="h-3 w-3 text-red-500" /> },
              { value: 'sleep', label: 'Troubles du sommeil', icon: <Moon className="h-3 w-3 text-blue-500" /> },
              { value: 'emotional', label: 'Instabilité émotionnelle', icon: <Heart className="h-3 w-3 text-rose-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-manifestation`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-manifestation`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
      // Pour compatibilité
      'Stress/Anxiety': (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Comment se manifeste principalement votre stress ?</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'mental', label: 'Pensées anxieuses', icon: <Brain className="h-3 w-3 text-purple-500" /> },
              { value: 'physical', label: 'Tension physique', icon: <Activity className="h-3 w-3 text-red-500" /> },
              { value: 'sleep', label: 'Troubles du sommeil', icon: <Moon className="h-3 w-3 text-blue-500" /> },
              { value: 'emotional', label: 'Instabilité émotionnelle', icon: <Heart className="h-3 w-3 text-rose-500" /> },
            ].map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateDynamicQuestion(`${symptom}-manifestation`, option.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                  ${quizData.specificQuestions?.find(q => q.id === `${symptom}-manifestation`)?.answer === option.value 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-gray-50 border border-gray-200 text-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-1">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )
    };
    
    // Si le symptôme n'est pas dans la liste des 5 symptômes critiques, ne pas afficher de question
    if (!specificQuestions[symptom]) {
      return null;
    }
    
    return specificQuestions[symptom];
  };

  // Définition des types pour l'arbre de décision
  interface DecisionNode {
    id: string;
    question: string;
    type: 'radio' | 'select' | 'text' | 'slider';
    options?: Array<{
      value: string;
      label: string;
      icon?: JSX.Element;
    }>;
    condition: {
      field: string;
      value: string | string[];
      operator: 'includes' | 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
    };
    importance: number;
    followUpQuestions?: Array<{
      parentAnswer: string | string[];  // Réponse(s) à laquelle cette question de suivi est liée
      questionNode: DecisionNode;       // Question de suivi
    }>;
  }

  // Arbre de décision statique pour les questions basées sur les symptômes et d'autres facteurs
  const symptomDecisionTree: DecisionNode[] = [
    // QUESTIONS POUR L'ÉTAPE "DIET"
    // Question sur les habitudes alimentaires générales
    {
      id: 'dietary-habits',
      question: 'Comment décririez-vous vos habitudes alimentaires actuelles ?',
      type: 'radio',
      options: [
        { value: 'balanced', label: 'Alimentation équilibrée', icon: <Utensils className="h-4 w-4 text-green-500" /> },
        { value: 'processed', label: 'Beaucoup d\'aliments transformés', icon: <Utensils className="h-4 w-4 text-red-500" /> },
        { value: 'restricted', label: 'Régime restrictif/Spécifique', icon: <Utensils className="h-4 w-4 text-amber-500" /> },
        { value: 'irregular', label: 'Repas irréguliers/À la hâte', icon: <AlarmClock className="h-4 w-4 text-purple-500" /> },
      ],
      condition: { field: 'diet', value: 'any', operator: 'equals' },
      importance: 8,
    },
    
    // Question sur la consommation d'aliments inflammatoires
    {
      id: 'inflammatory-foods',
      question: 'Consommez-vous régulièrement ces aliments potentiellement inflammatoires ?',
      type: 'select',
      options: [
        { value: 'sugar', label: 'Sucre raffiné/Desserts', icon: <Utensils className="h-4 w-4 text-rose-500" /> },
        { value: 'gluten', label: 'Gluten/Blé', icon: <Utensils className="h-4 w-4 text-amber-500" /> },
        { value: 'dairy', label: 'Produits laitiers', icon: <Coffee className="h-4 w-4 text-blue-500" /> },
        { value: 'alcohol', label: 'Alcool régulier', icon: <Utensils className="h-4 w-4 text-purple-500" /> },
      ],
      condition: { field: 'diet', value: 'any', operator: 'equals' },
      importance: 7,
    },
    
    // QUESTIONS POUR L'ÉTAPE "ADVANCED"
    // Question sur les facteurs de stress quotidiens
    {
      id: 'daily-stressors',
      question: 'Quels facteurs de stress sont présents dans votre quotidien ?',
      type: 'select',
      options: [
        { value: 'work', label: 'Pression professionnelle', icon: <BookOpen className="h-4 w-4 text-blue-500" /> },
        { value: 'sleep', label: 'Manque de sommeil/Sommeil irrégulier', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
        { value: 'financial', label: 'Préoccupations financières', icon: <Heart className="h-4 w-4 text-green-500" /> },
        { value: 'time', label: 'Manque de temps libre', icon: <Clock className="h-4 w-4 text-amber-500" /> },
      ],
      condition: { field: 'advanced', value: 'any', operator: 'equals' },
      importance: 9,
    },
    
    // Question sur l'historique de suppléments
    {
      id: 'supplement-history',
      question: 'Avez-vous déjà essayé des suppléments naturels auparavant ?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Jamais essayé', icon: <X className="h-4 w-4 text-gray-500" /> },
        { value: 'some', label: 'Quelques-uns, sans résultats notables', icon: <Smile className="h-4 w-4 text-amber-500" /> },
        { value: 'effective', label: 'Oui, avec des résultats positifs', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
        { value: 'negative', label: 'Oui, avec des effets indésirables', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
      ],
      condition: { field: 'advanced', value: 'any', operator: 'equals' },
      importance: 7,
    },
    
    // Nœud pour les problèmes de peau
    {
      id: 'skin-problems-type',
      question: 'Quel type de problème de peau avez-vous principalement ?',
      type: 'radio',
      options: [
        { value: 'acne', label: 'Acné', icon: <Zap className="h-4 w-4 text-red-500" /> },
        { value: 'dryness', label: 'Sécheresse/Eczéma', icon: <Droplet className="h-4 w-4 text-blue-500" /> },
        { value: 'redness', label: 'Rougeurs/Inflammations', icon: <Flame className="h-4 w-4 text-orange-500" /> },
        { value: 'aging', label: 'Signes de vieillissement', icon: <Clock className="h-4 w-4 text-purple-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Skin problems', operator: 'includes' },
      importance: 7,
    },
    
    // Nœud pour les douleurs articulaires
    {
      id: 'joint-pain-location',
      question: 'Où ressentez-vous principalement les douleurs articulaires ?',
      type: 'radio',
      options: [
        { value: 'knees', label: 'Genoux', icon: <Activity className="h-4 w-4 text-amber-500" /> },
        { value: 'back', label: 'Dos/Colonne vertébrale', icon: <Activity className="h-4 w-4 text-orange-500" /> },
        { value: 'hands', label: 'Mains/Poignets', icon: <Fingerprint className="h-4 w-4 text-blue-500" /> },
        { value: 'multiple', label: 'Plusieurs articulations', icon: <Activity className="h-4 w-4 text-red-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Joint pain', operator: 'includes' },
      importance: 7,
    },
    
    // Nœud pour les maux de tête
    {
      id: 'headache-frequency',
      question: 'Quelle est la fréquence de vos maux de tête ?',
      type: 'radio',
      options: [
        { value: 'rare', label: 'Occasionnels (1-3 fois/mois)', icon: <Clock className="h-4 w-4 text-green-500" /> },
        { value: 'regular', label: 'Réguliers (1-2 fois/semaine)', icon: <Clock className="h-4 w-4 text-amber-500" /> },
        { value: 'frequent', label: 'Fréquents (3+ fois/semaine)', icon: <Clock className="h-4 w-4 text-red-500" /> },
        { value: 'chronic', label: 'Chroniques/Migraines', icon: <ActivitySquare className="h-4 w-4 text-purple-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Headaches', operator: 'includes' },
      importance: 7,
    },
    
    // Nœud pour la sensibilité au froid
    {
      id: 'cold-sensitivity-specifics',
      question: 'Comment se manifeste votre sensibilité au froid ?',
      type: 'radio',
      options: [
        { value: 'hands-feet', label: 'Extrémités froides (mains/pieds)', icon: <Hand className="h-4 w-4 text-blue-500" /> },
        { value: 'whole-body', label: 'Sensation générale de froid', icon: <Users className="h-4 w-4 text-indigo-500" /> },
        { value: 'thyroid', label: 'Possible problème thyroïdien', icon: <Thermometer className="h-4 w-4 text-cyan-500" /> },
        { value: 'seasonal', label: 'Uniquement en saison froide', icon: <Sun className="h-4 w-4 text-sky-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Cold sensitivity', operator: 'includes' },
      importance: 6,
    },
    
    // Nœud pour les problèmes d'immunité
    {
      id: 'immunity-issues',
      question: 'Comment se manifeste votre baisse d\'immunité ?',
      type: 'radio',
      options: [
        { value: 'frequent-colds', label: 'Rhumes/infections fréquentes', icon: <Droplet className="h-4 w-4 text-blue-500" /> },
        { value: 'slow-healing', label: 'Cicatrisation lente', icon: <Clock className="h-4 w-4 text-amber-500" /> },
        { value: 'allergies', label: 'Allergies/Intolérances', icon: <Leaf className="h-4 w-4 text-rose-500" /> },
        { value: 'fatigue', label: 'Fatigue chronique', icon: <Battery className="h-4 w-4 text-red-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Poor immunity', operator: 'includes' },
      importance: 7,
    },
    
    // Nœud pour la fatigue
    {
      id: 'fatigue-timing',
      question: 'À quel moment de la journée ressentez-vous le plus de fatigue ?',
      type: 'radio',
      options: [
        { value: 'morning', label: 'Le matin', icon: <Sun className="h-4 w-4 text-amber-500" /> },
        { value: 'afternoon', label: 'L\'après-midi', icon: <Sun className="h-4 w-4 text-orange-500" /> },
        { value: 'evening', label: 'Le soir', icon: <Moon className="h-4 w-4 text-blue-500" /> },
        { value: 'all-day', label: 'Toute la journée', icon: <Clock className="h-4 w-4 text-red-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Fatigue', operator: 'includes' },
      importance: 8,
      followUpQuestions: [
        {
          // Question de suivi pour la fatigue matinale
          parentAnswer: 'morning',
          questionNode: {
            id: 'morning-fatigue-details',
            question: 'Comment qualifieriez-vous cette fatigue matinale ?',
            type: 'radio',
            options: [
              { value: 'physical', label: 'Physique (corps lourd, manque d\'énergie)', icon: <Dumbbell className="h-4 w-4 text-blue-500" /> },
              { value: 'mental', label: 'Mentale (difficulté à se concentrer)', icon: <Brain className="h-4 w-4 text-purple-500" /> },
              { value: 'both', label: 'Les deux', icon: <Users className="h-4 w-4 text-indigo-500" /> },
            ],
            condition: { field: 'specificQuestions', value: 'fatigue-timing', operator: 'equals' },
            importance: 7
          }
        },
        // Question de suivi pour la fatigue sur toute la journée
        {
          parentAnswer: 'all-day',
          questionNode: {
            id: 'all-day-fatigue-intensity',
            question: 'Cette fatigue varie-t-elle en intensité pendant la journée ?',
            type: 'radio',
            options: [
              { value: 'constant', label: 'Constante toute la journée', icon: <Activity className="h-4 w-4 text-red-500" /> },
              { value: 'fluctuating', label: 'Fluctuante (des pics et des creux)', icon: <Waves className="h-4 w-4 text-blue-500" /> },
              { value: 'worsening', label: 'S\'aggrave au fil de la journée', icon: <Sunset className="h-4 w-4 text-amber-500" /> },
            ],
            condition: { field: 'specificQuestions', value: 'fatigue-timing', operator: 'equals' },
            importance: 7
          }
        }
      ]
    },
    
    // Nœud pour les problèmes de sommeil
    {
      id: 'sleep-pattern',
      question: 'Quel est votre principal problème de sommeil ?',
      type: 'radio',
      options: [
        { value: 'falling', label: 'Difficultés à s\'endormir', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
        { value: 'staying', label: 'Réveils nocturnes fréquents', icon: <Sunrise className="h-4 w-4 text-amber-500" /> },
        { value: 'early', label: 'Réveil trop matinal', icon: <Sun className="h-4 w-4 text-red-500" /> },
        { value: 'quality', label: 'Sommeil non réparateur', icon: <BedDouble className="h-4 w-4 text-blue-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Sleep issues', operator: 'includes' },
      importance: 9,
      followUpQuestions: [
        {
          // Question de suivi pour les difficultés à s'endormir
          parentAnswer: 'falling',
          questionNode: {
            id: 'falling-asleep-details',
            question: 'Qu\'est-ce qui rend difficile l\'endormissement selon vous ?',
            type: 'radio',
            options: [
              { value: 'thoughts', label: 'Pensées qui tournent en boucle', icon: <Brain className="h-4 w-4 text-purple-500" /> },
              { value: 'physical', label: 'Inconfort physique', icon: <Activity className="h-4 w-4 text-rose-500" /> },
              { value: 'environment', label: 'Facteurs environnementaux (bruit, lumière)', icon: <Sun className="h-4 w-4 text-amber-500" /> },
              { value: 'timing', label: 'Horaire de coucher inadapté', icon: <Clock className="h-4 w-4 text-blue-500" /> },
            ],
            condition: { field: 'specificQuestions', value: 'sleep-pattern', operator: 'equals' },
            importance: 8
          }
        },
        {
          // Question de suivi pour les réveils nocturnes
          parentAnswer: 'staying',
          questionNode: {
            id: 'night-waking-details',
            question: 'À quel moment de la nuit vous réveillez-vous habituellement ?',
            type: 'radio',
            options: [
              { value: 'early-night', label: 'Début de nuit (1-2h après l\'endormissement)', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
              { value: 'middle-night', label: 'Milieu de nuit', icon: <Clock className="h-4 w-4 text-blue-500" /> },
              { value: 'early-morning', label: 'Tôt le matin (2-3h avant l\'heure prévue)', icon: <Sunrise className="h-4 w-4 text-amber-500" /> },
              { value: 'multiple', label: 'Plusieurs réveils à différents moments', icon: <ActivitySquare className="h-4 w-4 text-red-500" /> },
            ],
            condition: { field: 'specificQuestions', value: 'sleep-pattern', operator: 'equals' },
            importance: 7
          }
        }
      ]
    },
    
    // Nœud pour le stress/anxiété
    {
      id: 'stress-triggers',
      question: 'Quels sont les principaux déclencheurs de votre stress/anxiété ?',
      type: 'radio',
      options: [
        { value: 'work', label: 'Travail/études', icon: <BookOpen className="h-4 w-4 text-blue-500" /> },
        { value: 'social', label: 'Relations sociales', icon: <Users className="h-4 w-4 text-purple-500" /> },
        { value: 'health', label: 'Santé/bien-être', icon: <Heart className="h-4 w-4 text-rose-500" /> },
        { value: 'general', label: 'Anxiété générale', icon: <Wind className="h-4 w-4 text-gray-500" /> },
      ],
      condition: { field: 'symptoms', value: 'Stress/Anxiety', operator: 'includes' },
      importance: 8,
      followUpQuestions: [
        {
          // Question de suivi pour le stress lié au travail
          parentAnswer: 'work',
          questionNode: {
            id: 'work-stress-symptoms',
            question: 'Comment se manifeste votre stress lié au travail/études ?',
            type: 'radio',
            options: [
              { value: 'physical', label: 'Symptômes physiques (tension, maux de tête)', icon: <Activity className="h-4 w-4 text-red-500" /> },
              { value: 'cognitive', label: 'Difficulté à se concentrer', icon: <Brain className="h-4 w-4 text-purple-500" /> },
              { value: 'emotional', label: 'Irritabilité ou tristesse', icon: <Heart className="h-4 w-4 text-rose-500" /> },
              { value: 'sleep', label: 'Problèmes de sommeil', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
            ],
            condition: { field: 'specificQuestions', value: 'stress-triggers', operator: 'equals' },
            importance: 7
          }
        }
      ]
    },
    
    // Nœud pour les problèmes digestifs
    {
      id: 'digestion-timing',
      question: 'Quand ces problèmes digestifs surviennent-ils généralement ?',
      type: 'radio',
      options: [
        { value: 'morning', label: 'Le matin', icon: <Sunrise className="h-4 w-4 text-amber-500" /> },
        { value: 'after-meals', label: 'Après les repas', icon: <Utensils className="h-4 w-4 text-orange-500" /> },
        { value: 'evening', label: 'Le soir', icon: <Moon className="h-4 w-4 text-blue-500" /> },
        { value: 'random', label: 'De façon aléatoire', icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
      ],
      condition: { field: 'symptoms', value: ['Digestive problems', 'Bloating'], operator: 'includes' },
      importance: 8,
      followUpQuestions: [
        {
          // Question de suivi pour les problèmes digestifs après les repas
          parentAnswer: 'after-meals',
          questionNode: {
            id: 'meal-trigger-details',
            question: 'Après quels types d\'aliments observez-vous ces problèmes ?',
            type: 'radio',
            options: [
              { value: 'dairy', label: 'Produits laitiers', icon: <Coffee className="h-4 w-4 text-blue-500" /> },
              { value: 'gluten', label: 'Aliments contenant du gluten', icon: <Salad className="h-4 w-4 text-amber-500" /> },
              { value: 'fatty', label: 'Aliments gras', icon: <Utensils className="h-4 w-4 text-orange-500" /> },
              { value: 'any', label: 'Tous types d\'aliments', icon: <Sparkles className="h-4 w-4 text-purple-500" /> },
            ],
            condition: { field: 'specificQuestions', value: 'digestion-timing', operator: 'equals' },
            importance: 9
          }
        }
      ]
    }
  ];

  // Interface pour les questions dynamiques
  interface DynamicQuestion {
    id: string;
    question: string;
    type: 'radio' | 'select' | 'text' | 'slider';
    options?: Array<{
      value: string;
      label: string;
      icon?: JSX.Element;
    }>;
    condition: {
      field: string;
      value: string | string[];
      operator: 'includes' | 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
    };
    importance: number;
    answered?: boolean;
    answer?: string;
    followUp?: string;
  }

  // Fonction améliorée et optimisée pour générer des questions dynamiques
  const generateDynamicQuestions = () => {
    // Tableau pour stocker les questions générées
    let newQuestions: DynamicQuestion[] = [];
    
    // Préserver l'état des questions existantes pour éviter le clignotement
    const existingDynamicQuestions = [...dynamicQuestions];
    
    // Étape actuelle - important pour déterminer quelles questions afficher
    const currentStepId = STEPS[currentStep].id;
    
    // Ne pas générer de questions dynamiques sur la page des symptômes principaux
    // Les questions apparaîtront uniquement dans l'étape "symptom-details"
    if (currentStepId === 'symptoms') {
      console.log("Étape des symptômes principaux: pas de questions dynamiques ici");
      setDynamicQuestions([]);
      return;
    }
    
    // Utiliser le système prédictif pour améliorer la génération de questions
    if (canUseAdaptiveQuiz()) {
      const adaptiveQuestions = useAdaptiveQuestionSystem();
      if (adaptiveQuestions.length > 0) {
        console.log("Utilisation du système prédictif pour les questions:", adaptiveQuestions.length);
        
        // Convertir les questions du format prédictif au format du quiz actuel
        adaptiveQuestions.forEach((q: any) => {
          // D'abord, vérifier si cette question existe déjà pour préserver son état
          const existingQuestion = existingDynamicQuestions.find(eq => eq.id === q.id);
          
          // Assurons-nous que les options sont correctement formatées
          const formattedOptions = q.options ? 
            (Array.isArray(q.options) ? 
              q.options.map((opt: any) => ({
                value: typeof opt === 'string' ? opt : (opt.id || opt.value || ''),
                label: typeof opt === 'string' ? opt : (opt.label || opt.id || '')
              })) 
              : 
              // Si options est un objet (comme dans le cas de 'combined')
              Object.entries(q.options).flatMap(([key, values]: [string, any]) => 
                (Array.isArray(values) ? values : []).map((v: any) => ({
                  value: typeof v === 'string' ? `${key}_${v}` : `${key}_${v.id || v.value || ''}`,
                  label: typeof v === 'string' ? v : (v.label || v.id || '')
                }))
              )
            ) 
            : [];
            
          // Créer une nouvelle question ou mettre à jour l'existante
          const dynamicQuestion: DynamicQuestion = {
            id: q.id,
            question: q.question,
            type: convertQuestionType(q.type),
            options: formattedOptions,
            condition: { field: 'auto_generated', value: 'true', operator: 'equals' },
            importance: 8,
            // Préserver l'état "answered" si la question existait déjà
            answered: existingQuestion ? existingQuestion.answered : false
          };
          
          // Récupérer la réponse existante si disponible
          const storedResponse = quizData.specificQuestions?.find(
            existingQ => existingQ.id === q.id
          );
          
          if (storedResponse) {
            // @ts-ignore
            dynamicQuestion.answer = storedResponse.answer || '';
            // S'il y a une réponse stockée, marquer comme répondue
            dynamicQuestion.answered = true;
          } else if (existingQuestion) {
            // Récupérer également la réponse depuis les questions existantes si disponible
            // @ts-ignore
            if (existingQuestion.answer) {
              // @ts-ignore
              dynamicQuestion.answer = existingQuestion.answer;
            }
          }
          
          // Toujours ajouter la question aux nouvelles questions, qu'elle soit répondue ou non
          newQuestions.push(dynamicQuestion);
        });
        
        // Conversion explicite pour satisfaire TypeScript
        setDynamicQuestions(newQuestions as any);
        return;
      }
    }
    
    // Si le système prédictif n'est pas utilisable, on revient au système d'origine
    // Cette fonction détermine si une question dynamique doit être générée selon l'étape actuelle
    const shouldGenerateQuestion = (condition: any) => {
      console.log("Vérification de condition pour", condition.field, condition.value);
      
      // Associer chaque type de condition à son étape appropriée
      // Étape 1 (index 0) -> Symptômes généraux (symptômes)
      // Étape 2 (index 1) -> Questions spécifiques aux symptômes (détails sur les symptômes)
      // Étape 3 (index 2) -> Régime alimentaire (diet)
      // Étape 4 (index 3) -> Mode de vie (lifestyle)
      // Étape 5 (index 4) -> Objectifs (goals)
      
      // Vérifier l'étape actuelle selon son ID plutôt que son index
      const currentStepId = STEPS[currentStep].id;
      
      // RÈGLE STRICTE : Vérifier d'abord le type d'étape actuelle, PUIS le type de question
      
      // Si nous sommes à l'étape symptom-details, autoriser les questions sur les symptômes
      // et également les questions basées sur les données démographiques (âge, genre, médicaments)
      if (currentStepId === 'symptom-details') {
        // Vérifier si le symptôme fait partie de ceux qui ne nécessitent pas de détails
        if (condition.field === 'symptoms' && 
            (Array.isArray(condition.value) 
              ? condition.value.some((v: string) => isSkippableSymptom(v))
              : isSkippableSymptom(condition.value))) {
          return false;
        }
        
        // Autoriser les questions liées aux symptômes, aux réponses précédentes, 
        // et aussi les questions liées aux données démographiques
        return condition.field === 'symptoms' || 
               condition.field === 'specificQuestions' ||
               condition.field === 'age' ||
               condition.field === 'gender' ||
               condition.field === 'medications';
      }
      
      // Si nous sommes à l'étape diet, autoriser toutes les questions liées au régime
      if (currentStepId === 'diet') {
        console.log("Étape diet: Vérification de la condition", condition.field);
        
        // Pour les conditions de type 'diet', toujours retourner true
        // afin d'inclure ces questions spécifiques à cette étape
        if (condition.field === 'diet') {
          return true;  
        }
        
        // Accepter toute condition liée au régime alimentaire 
        // avec une vérification moins stricte
        return condition.field === 'dietType' || 
               condition.field === 'meatConsumption' || 
               condition.field === 'fishConsumption' || 
               condition.field === 'fruitsVegetables';
      }
      
      // Si nous sommes à l'étape goals, n'autoriser QUE les questions sur les objectifs
      if (currentStepId === 'goals') {
        console.log("Étape goals: Vérification de la condition", condition.field);
        return condition.field === 'objectives' || condition.field === 'goals';
      }
      
      // Si nous sommes à l'étape 'lifestyle', on peut avoir des questions spécifiques à cette étape
      if (currentStepId === 'lifestyle') {
        console.log("Étape lifestyle: Vérification de la condition", condition.field);
        return condition.field === 'activityLevel' || 
               condition.field === 'sleepQuality' || 
               condition.field === 'stressLevel' ||
               condition.field === 'lifestyle';
      }
      
      // Si nous sommes à l'étape 'advanced', autoriser toutes les questions avancées
      if (currentStepId === 'advanced') {
        console.log("Étape advanced: Autorisation de toutes les questions avancées");
        
        // Pour les conditions de type 'advanced', toujours retourner true
        // afin d'inclure ces questions spécifiques à cette étape
        if (condition.field === 'advanced') {
          console.log("Question Advanced trouvée, inclusion automatique");
          return true;  
        }
        
        // Dans l'onglet advanced, nous voulons afficher toutes les questions pertinentes
        // qui ont le type 'advanced' ou des questions qui nécessitent plus de détails
        // Priorité donnée aux questions de type 'advanced'
        return condition.field === 'advanced' || 
               condition.field === 'supplement-history' || 
               condition.field === 'daily-stressors';
      }
      
      // Par défaut, ne pas générer la question
      // Cela empêche les questions non catégorisées d'apparaître n'importe où
      console.log("Étape non gérée:", currentStepId, "- condition:", condition.field);
      return false;
    };
    
    // Étape 1 : Générer les questions de premier niveau basées sur les symptômes
    symptomDecisionTree.forEach(nodeQuestion => {
      const { condition, ...questionData } = nodeQuestion;
      
      // Vérifier si nous devons générer cette question pour l'étape actuelle
      if (!shouldGenerateQuestion(condition)) {
        return; // Ignorer cette question pour l'étape actuelle
      }
      
      // Vérifier si la condition est remplie
      let conditionMet = false;
      
      // Déterminer la valeur du champ en fonction de son nom
      const getFieldValue = (fieldName: string): any => {
        switch(fieldName) {
          case 'symptoms': return quizData.symptoms;
          case 'dietType': return quizData.dietType;
          case 'activityLevel': return quizData.activityLevel;
          case 'sleepQuality': return quizData.sleepQuality;
          case 'stressLevel': return quizData.stressLevel;
          case 'objectives': return quizData.objectives;
          case 'goals': return quizData.goals;
          case 'meatConsumption': return quizData.meatConsumption;
          case 'fishConsumption': return quizData.fishConsumption;
          case 'fruitsVegetables': return quizData.fruitsVegetables;
          case 'specificQuestions': return quizData.specificQuestions ? quizData.specificQuestions.map(q => q.id) : [];
          // Données démographiques
          case 'age': return quizData.age ? [quizData.age] : ['adult']; // Valeur par défaut 'adult'
          case 'gender': return quizData.gender ? [quizData.gender] : ['any']; // Valeur par défaut 'any'
          case 'medications': return quizData.medications || []; // Tableau des médicaments
          // Ajouter des champs génériques pour les nouvelles questions spéciales
          case 'diet': return ['any']; // Pour s'assurer que les questions de régime sont toujours affichées
          case 'advanced': return ['any']; // Pour s'assurer que les questions avancées sont toujours affichées
          case 'lifestyle': return ['any']; // Pour s'assurer que les questions de style de vie sont toujours affichées
          case 'demographic_question': return ['any']; // Pour s'assurer que les questions démographiques sont toujours affichées
          default: 
            console.log(`Champ non trouvé: ${fieldName}`);
            return null;
        }
      };
      
      const fieldValue = getFieldValue(condition.field);
      
      if (condition.operator === 'includes') {
        if (Array.isArray(condition.value)) {
          // Si la valeur est un tableau, vérifier si au moins une des valeurs est incluse
          conditionMet = condition.value.some(value => 
            Array.isArray(fieldValue) && 
            fieldValue.includes(value)
          );
        } else {
          // Si la valeur est une chaîne, vérifier si elle est incluse
          conditionMet = Array.isArray(fieldValue) && 
                         fieldValue.includes(condition.value);
        }
      }
      
      // Si la condition est remplie, ajouter la question
      if (conditionMet) {
        newQuestions.push({
          ...questionData,
          condition,
          answered: quizData.specificQuestions?.some((q: {id: string}) => q.id === questionData.id) || false
        });
      }
    });
    
    // Étape 2 : Ajouter les questions de suivi basées sur les réponses précédentes
    const answeredQuestions = quizData.specificQuestions || [];
    
    symptomDecisionTree.forEach(nodeQuestion => {
      // Vérifier si cette question de décision doit être utilisée à l'étape actuelle
      if (!shouldGenerateQuestion(nodeQuestion.condition)) {
        return; // Ignorer les questions de suivi pour les questions qui ne s'appliquent pas à cette étape
      }
      
      // Chercher la réponse à cette question
      const parentAnswer = answeredQuestions.find((q: {id: string, answer?: string}) => q.id === nodeQuestion.id)?.answer;
      
      // Si la question a une réponse et des questions de suivi, vérifier les conditions
      if (parentAnswer && nodeQuestion.followUpQuestions) {
        nodeQuestion.followUpQuestions.forEach(followUp => {
          // Vérifier si la réponse correspond à la condition de la question de suivi
          const { questionNode } = followUp;
          
          // Vérifier si cette question de suivi doit être utilisée à l'étape actuelle
          if (!shouldGenerateQuestion(questionNode.condition)) {
            return; // Ignorer les questions de suivi qui ne s'appliquent pas à cette étape
          }
          
          if (Array.isArray(followUp.parentAnswer)) {
            if (followUp.parentAnswer.includes(parentAnswer)) {
              newQuestions.push({
                ...questionNode,
                answered: quizData.specificQuestions?.some((q: {id: string}) => q.id === questionNode.id) || false
              });
            }
          } else if (followUp.parentAnswer === parentAnswer) {
            newQuestions.push({
              ...questionNode,
              answered: quizData.specificQuestions?.some((q: {id: string}) => q.id === questionNode.id) || false
            });
          }
        });
      }
    });
    
    // Vérifier si des questions ont déjà été répondues et extraire les réponses
    const answeredQuestionIds = quizData.specificQuestions?.map((q: {id: string}) => q.id) || [];
    
    // Marquer les questions comme répondues
    // et conserver l'importance de la première question pour les questions imbriquées
    const questionsWithAnswerStatus = newQuestions.map((q: DynamicQuestion) => {
      // Obtenir la réponse actuelle si disponible
      const existingAnswer = quizData.specificQuestions?.find((sq: {id: string; answer?: string}) => sq.id === q.id);
      
      return {
        ...q,
        answered: answeredQuestionIds.includes(q.id),
        // Si la question a déjà été répondue, on conserve la réponse existante
        // @ts-ignore
        answer: existingAnswer?.answer
      };
    });
    
    // Pour le débogage, ajouter des informations sur les questions générées
    console.log("Questions dynamiques générées:", questionsWithAnswerStatus.length);
    
    // Trier les questions par importance pour afficher d'abord les plus importantes
    const sortedQuestions = [...questionsWithAnswerStatus].sort(
      (a, b) => (b.importance || 0) - (a.importance || 0)
    );
    
    // Mettre à jour les questions dynamiques dans l'état
    setDynamicQuestions(sortedQuestions);
  };

  // Progression du quiz (en pourcentage)
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  // État pour la direction de transition (avant ou arrière)
  const [direction, setDirection] = useState(0);
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      // Définir la direction comme arrière (-1) pour l'animation
      setDirection(-1);
      
      // Déclencher l'animation puis changer l'étape
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        // Faire défiler la page vers le haut après changement d'étape
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  const shouldSkipDynamicQuestions = () => {
    // 1. Si nous sommes sur l'étape des symptômes
    if (currentStep === 0) {
      // Ne jamais sauter l'étape "symptom-details", même si aucun symptôme n'est sélectionné
      // ou si aucune question dynamique n'est disponible
      if (quizData.symptoms.length === 0) {
        console.log("Bien que aucun symptôme ne soit sélectionné, nous afficherons tout de même l'étape symptom-details");
        return false;
      }
      
      // Toujours afficher l'étape symptom-details, même si les symptômes sélectionnés pourraient être ignorés
      console.log("Passage à l'étape symptom-details quels que soient les symptômes sélectionnés");
      return false;
    }
    
    // 2. Ne plus sauter l'étape symptom-details même si aucune question dynamique n'est disponible
    // car nous avons des questions statiques maintenant
    if (currentStep === 1) {
      console.log("L'étape symptom-details n'est plus sautée car elle contient des questions statiques");
      return false;
    }
    
    // 3. Si nous sommes à l'étape Advanced et qu'aucune question n'est disponible, 
    // passer directement aux résultats
    if (STEPS[currentStep].id === 'advanced' && dynamicQuestions.length === 0) {
      console.log("Saut de l'étape Advanced (aucune question disponible)");
      return true;
    }
    
    return false;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      // Définir la direction comme avant (1) pour l'animation
      setDirection(1);
      
      // Déterminer l'étape suivante en tenant compte des sauts possibles
      let nextStep = currentStep + 1;
      
      // Vérifier si l'étape suivante est "advanced" et si nous devons la sauter
      const nextStepId = STEPS[nextStep]?.id;
      if (nextStepId === 'advanced') {
        // Si aucune question avancée n'est disponible, passer directement aux résultats
        console.log("Vérification si l'étape Advanced doit être sautée...");
        
        // Générer temporairement des questions avancées pour voir s'il y en aurait
        const currentStepBackup = currentStep;
        setCurrentStep(nextStep);
        generateDynamicQuestions();
        
        if (dynamicQuestions.length === 0) {
          console.log("Aucune question avancée disponible, passage direct aux résultats");
          setCurrentStep(currentStepBackup); // Restaurer l'étape actuelle
          handleSubmit();
          return;
        }
        
        // Restaurer l'étape courante si des questions avancées sont disponibles
        setCurrentStep(currentStepBackup);
      }
      
      // Vérifier si nous passons de l'étape "demographics" à l'étape "symptoms"
      // Nous avons besoin de garantir que les données démographiques sont utilisées dans la génération des symptômes
      if (STEPS[currentStep].id === 'demographics' && nextStepId === 'symptoms') {
        console.log("Passage de demographics à symptoms - Préparation des données démographiques pour le quiz adaptatif");
        
        // S'assurer que les données démographiques sont bien enregistrées dans le quizData
        setQuizData(prev => ({
          ...prev,
          // Conserver explicitement les données démographiques pour l'étape suivante
          age: prev.age,
          gender: prev.gender,
          medications: prev.medications
        }));
      }
      
      // Vérifier s'il faut sauter l'étape suivante
      if (shouldSkipDynamicQuestions()) {
        if (STEPS[currentStep].id === 'symptoms') {
          // Ne jamais sauter l'étape "symptom-details", même s'il n'y a pas de questions dynamiques
          // L'étape symptom-details est spécifiquement conçue pour recueillir plus de détails
          console.log("Passage à l'étape symptom-details qui contiendra des questions basées sur les données démographiques");
          nextStep = 1; // Index de l'étape symptom-details
        } else if (STEPS[currentStep].id === 'advanced') {
          // Si nous sommes sur Advanced sans questions, passer aux résultats
          handleSubmit();
          return;
        }
      }
      
      // Déclencher l'animation puis changer l'étape
      setTimeout(() => {
        setCurrentStep(nextStep);
        // Faire défiler la page vers le haut après changement d'étape
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Normaliser les données du quiz avant de les soumettre
    const normalizedQuizData = normalizeQuizData(quizData);
    
    // Soumettre les résultats du quiz
    console.log('Quiz data submitted:', normalizedQuizData);
    
    // Sauvegarder les données normalisées dans sessionStorage pour y accéder sur la page de résultats
    sessionStorage.setItem('quizData', JSON.stringify(normalizedQuizData));
    
    // Afficher l'animation d'analyse avant de rediriger vers les résultats
    setShowAnalysis(true);
  };
  
  // Fonction appelée lorsque l'animation d'analyse est terminée
  const handleAnalysisComplete = () => {
    // Rediriger vers la page des résultats
    navigate('/results');
  };

  const updateSymptoms = (symptom: string, checked: boolean) => {
    setQuizData((prev: any) => {
      // Si le symptôme est coché, l'ajouter à la liste (avec normalisation)
      if (checked) {
        return {
          ...prev,
          symptoms: [...prev.symptoms, symptom]
        };
      } 
      // Si le symptôme est décoché, le retirer de la liste
      else {
        return {
          ...prev,
          symptoms: prev.symptoms.filter((s: string) => s !== symptom)
        };
      }
    });
  };

  const updateObjectives = (objective: string, checked: boolean) => {
    setQuizData((prev: any) => ({
      ...prev,
      objectives: checked 
        ? [...prev.objectives, objective]
        : prev.objectives.filter((o: string) => o !== objective)
    }));
  };
  
  // Fonction pour mettre à jour les réponses aux questions dynamiques
  const updateDynamicQuestion = (questionId: string, answer: string) => {
    // Marquer la question comme répondue mais SANS la faire disparaître
    // Nous changeons seulement la propriété "answered" sans filtrer la question
    const questionInfo = dynamicQuestions.find((q: {id: string}) => q.id === questionId);
    
    // Enregistrer la réponse
    setQuizData((prev: any) => {
      // S'assurer que specificQuestions existe
      const existingQuestions = prev.specificQuestions || [];
      
      return {
        ...prev,
        specificQuestions: [
          ...existingQuestions.filter((q: {id: string}) => q.id !== questionId),
          {
            id: questionId,
            question: questionInfo?.question || '',
            answer: answer,
            importance: questionInfo?.importance || 5
          }
        ]
      };
    });
  };
  
  // Composant pour afficher une question dynamique - Beaucoup plus convivial et intuitif
  const DynamicQuestionCard = ({ 
    question 
  }: { 
    question: {
      id: string;
      question: string;
      type: 'select' | 'radio' | 'text' | 'slider';
      options?: {value: string, label: string, icon?: JSX.Element}[];
      importance: number;
      answered?: boolean;
      answer?: string;
      followUp?: string;
    }
  }) => {
    const isAnswered = quizData.specificQuestions?.some((q: {id: string}) => q.id === question.id) || false;
    const currentAnswer = quizData.specificQuestions?.find((q: {id: string}) => q.id === question.id)?.answer || '';
    
    // Association de couleurs aux questions dynamiques pour une meilleure expérience visuelle
    const getGradientByQuestionId = (id: string) => {
      if (id.includes('sleep')) return 'from-indigo-600 to-blue-600';
      if (id.includes('stress')) return 'from-rose-600 to-pink-600';
      if (id.includes('digest')) return 'from-amber-600 to-orange-600';
      if (id.includes('energy')) return 'from-yellow-600 to-amber-600';
      if (id.includes('focus')) return 'from-emerald-600 to-teal-600';
      if (id.includes('mood')) return 'from-violet-600 to-purple-600';
      return 'from-blue-600 to-violet-600'; // Couleur par défaut
    };
    
    const gradient = getGradientByQuestionId(question.id);
    
    // Rendu beaucoup plus convivial et adapté aux mobiles
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className={`rounded-xl overflow-hidden shadow-sm ${isAnswered ? 'border border-indigo-100' : 'border border-gray-200'}`}>
          {/* Header avec dégradé de couleur */}
          <div className={`bg-gradient-to-r ${gradient} px-4 py-3 text-white`}>
            <h3 className="text-base font-medium flex items-center gap-2">
              {isAnswered ? 
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : 
                <HelpCircle className="h-4 w-4 flex-shrink-0" />
              }
              <span>{question.question}</span>
            </h3>
          </div>
          
          {/* Corps avec les options de réponse */}
          <div className={`p-3 bg-white`}>
            {question.type === 'radio' && question.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {question.options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => updateDynamicQuestion(question.id, option.value)}
                    className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                      ${currentAnswer === option.value 
                        ? `bg-gradient-to-r ${gradient} text-white shadow-md` 
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.icon && (
                      <span className={`mr-2 ${currentAnswer === option.value ? 'text-white' : ''}`}>
                        {option.icon}
                      </span>
                    )}
                    <span className="text-left">{option.label}</span>
                    
                    {currentAnswer === option.value && (
                      <CheckCircle2 className="h-4 w-4 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
            
            {question.type === 'select' && question.options && (
              <div className="flex flex-wrap gap-2 mt-1">
                {question.options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => updateDynamicQuestion(question.id, option.value)}
                    className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 
                      ${currentAnswer === option.value 
                        ? `bg-gradient-to-r ${gradient} text-white shadow-md` 
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center gap-2">
                      {option.icon && (
                        <span className={currentAnswer === option.value ? 'text-white' : ''}>
                          {option.icon}
                        </span>
                      )}
                      <span>{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
          
          {/* Message d'information après réponse */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="p-3 border-t border-indigo-100 bg-indigo-50"
            >
              <div className="flex items-center gap-2 text-xs text-indigo-700">
                <Info className="h-3.5 w-3.5 flex-shrink-0" />
                <p>
                  Cette information nous permet de personnaliser encore plus vos recommandations 
                  de suppléments.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // Logique de navigation standard
  const customHandleNext = () => {
    // Correction du flux pour suivre l'ordre naturel des étapes
    // Ne plus sauter d'étapes, même s'il n'y a pas de questions dynamiques
    handleNext();
  };

  // Rendu de l'étape actuelle du quiz
  const renderStep = () => {
    switch (currentStep) {
      case 0: // Demographic Profile
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h2 className="text-xl font-medium mb-2 text-blue-800 flex items-center">
                <User className="mr-2 text-blue-500 h-5 w-5" />
                Votre profil
              </h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
              <div className="mt-3 flex items-center text-sm bg-white p-2 rounded-md border border-blue-100">
                <Info className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                <span className="text-blue-700">Ces informations aident à personnaliser vos recommandations de suppléments.</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Age Selection */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Quel est votre âge ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                    {[
                      { value: '18-29', label: '18-29 ans' },
                      { value: '30-39', label: '30-39 ans' },
                      { value: '40-49', label: '40-49 ans' },
                      { value: '50-59', label: '50-59 ans' },
                      { value: '60-69', label: '60-69 ans' },
                      { value: '70+', label: '70+ ans' },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setQuizData({...quizData, age: option.value})}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                          ${quizData.age === option.value 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{option.label}</span>
                        
                        {quizData.age === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Gender Selection */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span>Quel est votre genre ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    {[
                      { value: 'homme', label: 'Homme' },
                      { value: 'femme', label: 'Femme' },
                      { value: 'autre', label: 'Je préfère ne pas répondre' },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => setQuizData({...quizData, gender: option.value})}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                          ${quizData.gender === option.value 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{option.label}</span>
                        
                        {quizData.gender === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Medications */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4 flex-shrink-0" />
                    <span>Prenez-vous des médicaments régulièrement ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {[
                      { value: 'blood-pressure', label: 'Médicaments pour la tension', icon: <Heart className="h-4 w-4 text-red-500" /> },
                      { value: 'cholesterol', label: 'Médicaments pour le cholestérol', icon: <HeartPulse className="h-4 w-4 text-orange-500" /> },
                      { value: 'diabetes', label: 'Médicaments pour le diabète', icon: <Gauge className="h-4 w-4 text-blue-500" /> },
                      { value: 'thyroid', label: 'Médicaments pour la thyroïde', icon: <Thermometer className="h-4 w-4 text-teal-500" /> },
                      { value: 'depression', label: 'Antidépresseurs', icon: <Brain className="h-4 w-4 text-purple-500" /> },
                      { value: 'none', label: 'Aucun médicament régulier', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => {
                          if (option.value === 'none') {
                            // Si "aucun" est sélectionné, effacer les autres
                            setQuizData({...quizData, medications: ['none']});
                          } else {
                            // Si autre option est sélectionnée
                            const updatedMedications = [...quizData.medications];
                            const index = updatedMedications.indexOf(option.value);
                            
                            // Retirer "none" si présent
                            const noneIndex = updatedMedications.indexOf('none');
                            if (noneIndex !== -1) {
                              updatedMedications.splice(noneIndex, 1);
                            }
                            
                            // Ajouter/retirer l'option selon si déjà présente
                            if (index !== -1) {
                              updatedMedications.splice(index, 1);
                            } else {
                              updatedMedications.push(option.value);
                            }
                            
                            setQuizData({...quizData, medications: updatedMedications});
                          }
                        }}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                          ${quizData.medications?.includes(option.value)
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.icon && (
                          <span className={`mr-2 ${quizData.medications?.includes(option.value) ? 'text-white' : ''}`}>
                            {option.icon}
                          </span>
                        )}
                        <span className="text-left">{option.label}</span>
                        
                        {quizData.medications?.includes(option.value) && (
                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 1: // Symptoms
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border-l-4 border-emerald-400">
              <h2 className="text-xl font-medium mb-2 text-emerald-800 flex items-center">
                <AlertCircle className="mr-2 text-emerald-500 h-5 w-5" />
                Sélectionnez vos symptômes
              </h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
              <div className="mt-3 flex items-center text-sm bg-white p-2 rounded-md border border-emerald-100">
                <Info className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                <span className="text-emerald-700">Sélectionnez au maximum 2-3 symptômes pour des recommandations précises.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Liste des symptômes avec catégorisation visuelle */}
              {[
                // Symptômes principaux (toujours affichés)
                { id: 'fatigue', label: 'Fatigue', primary: true, category: 'neuro' },
                { id: 'sleep', label: 'Troubles du sommeil', primary: true, category: 'neuro' },
                { id: 'stress', label: 'Stress/Anxiété', primary: true, category: 'neuro' },
                { id: 'concentration', label: 'Manque de concentration', primary: true, category: 'neuro' },
                { id: 'low-energy', label: 'Manque d\'énergie', primary: true, category: 'neuro' },
                { id: 'mood', label: 'Sautes d\'humeur', primary: false, category: 'neuro' },
                { id: 'headache', label: 'Maux de tête', primary: false, category: 'neuro' },
                
                // Symptômes digestifs
                { id: 'digestion', label: 'Problèmes digestifs', primary: true, category: 'digestive' },
                { id: 'bloating', label: 'Ballonnements', primary: false, category: 'digestive' },
                
                // Symptômes physiques
                { id: 'joints', label: 'Douleurs articulaires', primary: true, category: 'physical' },
                { id: 'immunity', label: 'Faible immunité', primary: true, category: 'physical' },
                { id: 'skin', label: 'Problèmes de peau', primary: false, category: 'physical' },
                { id: 'cold', label: 'Sensibilité au froid', primary: false, category: 'physical' },
                { id: 'cravings', label: 'Fringales', primary: false, category: 'physical' },
                { id: 'hair', label: 'Cheveux/ongles cassants', primary: false, category: 'physical' },
              ]
              // Filtre pour n'afficher que les symptômes primaires ou tous si showAllSymptoms est true
              .filter(symptom => symptom.primary || showAllSymptoms)
              .map((symptom) => (
                <motion.div 
                  key={symptom.id} 
                  className={`border rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden touch-manipulation
                    ${quizData.symptoms.includes(symptom.id) 
                      ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50' 
                      : 'border-gray-200 hover:border-emerald-100'}`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Rendons l'ensemble de la carte cliquable pour une meilleure expérience mobile */}
                  <div 
                    className="p-3 w-full cursor-pointer flex justify-between items-center" 
                    onClick={() => updateSymptoms(
                      symptom.id, 
                      !quizData.symptoms.includes(symptom.id)
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <Checkbox 
                          id={symptom.id} 
                          checked={quizData.symptoms.includes(symptom.id)}
                          onCheckedChange={(checked) => updateSymptoms(symptom.id, checked as boolean)}
                          className="h-5 w-5 flex-shrink-0 text-emerald-600"
                          onClick={(e) => e.stopPropagation()} // Empêcher le double déclenchement quand on clique sur la checkbox
                        />
                      </div>
                      
                      <div className={`p-2 rounded-full flex-shrink-0 
                        ${quizData.symptoms.includes(symptom.id) 
                          ? 'bg-white shadow-sm' 
                          : 'bg-gray-50'
                        }`}>
                        {SYMPTOM_ICONS[symptom.label] || <AlertCircle className="w-4 h-4 text-gray-500" />}
                      </div>
                      
                      <span className="font-medium text-gray-800 truncate">
                        {symptom.label}
                      </span>
                    </div>
                    
                    {/* Indicateur visuel amélioré pour mobile */}
                    {quizData.symptoms.includes(symptom.id) && (
                      <div className="flex-shrink-0 ml-2">
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-emerald-600"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bouton "Voir plus de symptômes" */}
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAllSymptoms(!showAllSymptoms)}
                className="text-sm flex items-center gap-1 hover:bg-gray-100"
              >
                {showAllSymptoms ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Voir moins de symptômes</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>Voir plus de symptômes</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* Supprimé les questions dynamiques de cette étape pour éviter les doublons */}
            
            {quizData.symptoms.length > 0 && (
              <motion.div 
                className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="mr-3 text-blue-500 mt-1">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Vous avez sélectionné {quizData.symptoms.length} symptôme{quizData.symptoms.length > 1 ? 's' : ''}.</span> 
                    {' '}Continuez pour nous en dire plus sur votre alimentation et votre mode de vie afin d'affiner nos recommandations.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        );
        
      case 2: // Détails sur les symptômes (anciennement "Diet")
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h2 className="text-xl font-medium mb-2 text-purple-800 flex items-center">
                <Sparkles className="mr-2 text-purple-500 h-5 w-5" />
                Précisions sur vos symptômes
              </h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
            </div>
            
            {/* Questions personnalisées pour les symptômes sélectionnés */}
            <div className="space-y-6">
              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  Pour une recommandation plus précise, dites-nous en plus sur les symptômes que vous avez sélectionnés.
                </p>
              </div>
              
              {/* Cartes spécifiques pour chaque symptôme sélectionné */}
              {quizData.symptoms.length > 0 ? (
                <div className="space-y-5">
                  {quizData.symptoms.map((symptomId, index) => {
                    // Trouver le label correspondant à l'ID du symptôme
                    const symptomObj = [
                      { id: 'fatigue', label: 'Fatigue', primary: true },
                      { id: 'sleep', label: 'Troubles du sommeil', primary: true },
                      { id: 'stress', label: 'Stress/Anxiété', primary: true },
                      { id: 'digestion', label: 'Problèmes digestifs', primary: true },
                      { id: 'joints', label: 'Douleurs articulaires', primary: true },
                      { id: 'concentration', label: 'Manque de concentration', primary: true },
                      { id: 'immunity', label: 'Faible immunité', primary: true },
                      { id: 'low-energy', label: 'Manque d\'énergie', primary: true },
                      { id: 'skin', label: 'Problèmes de peau', primary: false },
                      { id: 'headache', label: 'Maux de tête', primary: false },
                      { id: 'mood', label: 'Sautes d\'humeur', primary: false },
                      { id: 'cold', label: 'Sensibilité au froid', primary: false },
                      { id: 'cravings', label: 'Fringales', primary: false },
                      { id: 'hair', label: 'Cheveux/ongles cassants', primary: false },
                      { id: 'bloating', label: 'Ballonnements', primary: false },
                    ].find(s => s.id === symptomId);
                    
                    const symptomLabel = symptomObj ? symptomObj.label : symptomId;
                    
                    return (
                      <div key={`${symptomId}-${index}`} className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-3 text-white">
                          <h3 className="text-base font-medium flex items-center gap-2">
                            <span>{SYMPTOM_ICONS[symptomLabel] || <AlertCircle className="h-4 w-4" />}</span>
                            <span>À propos de : {symptomLabel}</span>
                          </h3>
                        </div>
                        
                        <div className="p-4 bg-white space-y-4">
                          {/* Intensité - spécifique au symptôme */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Intensité</h4>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: 'mild', label: 'Légère', icon: <Activity className="h-3 w-3 text-green-500" /> },
                                { value: 'moderate', label: 'Modérée', icon: <Activity className="h-3 w-3 text-amber-500" /> },
                                { value: 'severe', label: 'Sévère', icon: <Activity className="h-3 w-3 text-red-500" /> },
                              ].map((option) => (
                                <motion.button
                                  key={option.value}
                                  onClick={() => updateDynamicQuestion(`${symptomId}-intensity`, option.value)}
                                  className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                                    ${quizData.specificQuestions?.find(q => q.id === `${symptomId}-intensity`)?.answer === option.value 
                                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                                      : 'bg-gray-50 border border-gray-200 text-gray-700'
                                    }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div className="flex items-center gap-1">
                                    {option.icon}
                                    <span>{option.label}</span>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Fréquence - spécifique au symptôme */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Fréquence</h4>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { value: 'rare', label: 'Occasionnelle', icon: <Clock className="h-3 w-3 text-blue-500" /> },
                                { value: 'frequent', label: 'Fréquente', icon: <Clock className="h-3 w-3 text-indigo-500" /> },
                                { value: 'constant', label: 'Constante', icon: <Clock className="h-3 w-3 text-purple-500" /> },
                              ].map((option) => (
                                <motion.button
                                  key={option.value}
                                  onClick={() => updateDynamicQuestion(`${symptomId}-frequency`, option.value)}
                                  className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200
                                    ${quizData.specificQuestions?.find(q => q.id === `${symptomId}-frequency`)?.answer === option.value 
                                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm' 
                                      : 'bg-gray-50 border border-gray-200 text-gray-700'
                                    }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div className="flex items-center gap-1">
                                    {option.icon}
                                    <span>{option.label}</span>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Question spécifique au symptôme */}
                          {getSymptomSpecificQuestion(symptomLabel)}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Questions dynamiques originales importantes si elles existent */}
                  <div className="space-y-5 mt-6">
                    <h3 className="text-base font-medium text-gray-800">Questions supplémentaires importantes</h3>
                    
                    {/* Questions spécifiques importantes qui doivent toujours être présentes */}
                    <div className="space-y-5">
                      {/* Question sur les effets secondaires des médicaments */}
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-white">
                          <h3 className="text-base font-medium flex items-center gap-2">
                            <Pill className="h-4 w-4 flex-shrink-0" />
                            <span>Avez-vous remarqué des effets secondaires liés à vos médicaments ?</span>
                          </h3>
                        </div>
                        
                        <div className="p-3 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {[
                              { value: 'none', label: 'Aucun effet secondaire', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
                              { value: 'mild', label: 'Effets légers', icon: <AlertCircle className="h-4 w-4 text-amber-500" /> },
                              { value: 'moderate', label: 'Effets modérés', icon: <AlertCircle className="h-4 w-4 text-orange-500" /> },
                              { value: 'severe', label: 'Effets importants', icon: <AlertCircle className="h-4 w-4 text-red-500" /> }
                            ].map((option) => {
                              const currentValue = quizData.specificQuestions?.find(q => q.id === 'medication_effects')?.answer;
                              
                              return (
                                <motion.button
                                  key={option.value}
                                  onClick={() => updateDynamicQuestion('medication_effects', option.value)}
                                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                                    ${currentValue === option.value 
                                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md' 
                                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {option.icon && (
                                    <span className={`mr-2 ${currentValue === option.value ? 'text-white' : ''}`}>
                                      {option.icon}
                                    </span>
                                  )}
                                  <span className="text-left">{option.label}</span>
                                  
                                  {currentValue === option.value && (
                                    <CheckCircle2 className="h-4 w-4 ml-auto" />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Question sur l'historique des compléments */}
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-white">
                          <h3 className="text-base font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 flex-shrink-0" />
                            <span>Avez-vous déjà essayé des compléments alimentaires pour ces symptômes ?</span>
                          </h3>
                        </div>
                        
                        <div className="p-3 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            {[
                              { value: 'never', label: 'Jamais essayé', icon: <X className="h-4 w-4 text-gray-500" /> },
                              { value: 'tried_no_effect', label: 'Essayé sans effet', icon: <Meh className="h-4 w-4 text-amber-500" /> },
                              { value: 'tried_some_effect', label: 'Essayé avec effet partiel', icon: <Smile className="h-4 w-4 text-blue-500" /> },
                              { value: 'tried_good_effect', label: 'Essayé avec bon effet', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> }
                            ].map((option) => {
                              const currentValue = quizData.specificQuestions?.find(q => q.id === 'supplement_history')?.answer;
                              
                              return (
                                <motion.button
                                  key={option.value}
                                  onClick={() => updateDynamicQuestion('supplement_history', option.value)}
                                  className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                                    ${currentValue === option.value 
                                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md' 
                                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {option.icon && (
                                    <span className={`mr-2 ${currentValue === option.value ? 'text-white' : ''}`}>
                                      {option.icon}
                                    </span>
                                  )}
                                  <span className="text-left">{option.label}</span>
                                  
                                  {currentValue === option.value && (
                                    <CheckCircle2 className="h-4 w-4 ml-auto" />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Questions dynamiques générées par le système prédictif */}
                    {dynamicQuestions
                      .filter(q => {
                        // Filtrer les questions spécifiques aux symptômes déjà présentes dans la page
                        const isSymptomSpecificQuestion = quizData.symptoms?.some(symptomId => 
                          q.id.includes(`${symptomId}-intensity`) || 
                          q.id.includes(`${symptomId}-frequency`) || 
                          q.id.includes(`${symptomId}-timing`) || 
                          q.id.includes(`${symptomId}-location`)
                        );
                        if (isSymptomSpecificQuestion) return false;
                        
                        // Filtrer les questions qui seront posées dans les étapes ultérieures
                        const isForLaterSteps = q.id.includes('dietary') || 
                                              q.id.includes('diet') || 
                                              q.id.includes('stress') || 
                                              q.id.includes('sleep') ||
                                              q.id.includes('activity');
                        if (isForLaterSteps) return false;
                        
                        // Éviter les doublons avec les questions statiques
                        const isDuplicate = q.id === 'medication_effects' || q.id === 'supplement_history';
                        if (isDuplicate) return false;
                        
                        // Conserver uniquement les questions importantes
                        return q.importance >= 8;
                      })
                      .map(question => {
                        // Ne pas traiter la question comme "answered" pour le filtrage
                        // mais conserver l'information pour l'affichage
                        const isAnswered = quizData.specificQuestions?.some(sq => sq.id === question.id);
                        const currentAnswer = quizData.specificQuestions?.find(sq => sq.id === question.id)?.answer || '';
                        
                        // Important: Coercition du type pour satisfaire l'interface de DynamicQuestionCard
                        const type = question.type as 'radio' | 'select' | 'text' | 'slider';
                        
                        return {
                          ...question,
                          type,
                          answered: isAnswered,
                          answer: currentAnswer
                        };
                      })
                      .map(question => (
                        <div key={question.id} className="mt-5">
                          <div className="border rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 text-white">
                              <h3 className="text-base font-medium flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{question.question}</span>
                              </h3>
                            </div>
                            
                            <div className="p-3 bg-white">
                              {question.type === 'radio' && question.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                  {question.options.map((option) => {
                                    const currentValue = quizData.specificQuestions?.find(q => q.id === question.id)?.answer;
                                    
                                    return (
                                      <motion.button
                                        key={option.value}
                                        onClick={() => updateDynamicQuestion(question.id, option.value)}
                                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                                          ${currentValue === option.value 
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                          }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        {option.icon && (
                                          <span className={`mr-2 ${currentValue === option.value ? 'text-white' : ''}`}>
                                            {option.icon}
                                          </span>
                                        )}
                                        <span className="text-left">{option.label}</span>
                                        
                                        {currentValue === option.value && (
                                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                                        )}
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-800">Aucun symptôme sélectionné</h3>
                  <p className="text-gray-600 mt-1">
                    Veuillez retourner à l'étape précédente pour sélectionner vos symptômes.
                  </p>
                </div>
              )}
              
              {/* Message pour continuer */}
              {quizData.symptoms.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-lg bg-indigo-50 border border-indigo-100"
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <LightbulbIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-indigo-700 font-medium">Vos réponses aident à personnaliser vos recommandations</p>
                      <p className="text-sm text-indigo-600 mt-1">
                        Plus vous fournissez de détails, plus notre système peut adapter les recommandations à vos besoins spécifiques.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 3: // Détails sur la santé générale (nouvelle étape)
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h2 className="text-xl font-medium mb-2 text-blue-800 flex items-center">
                <Activity className="mr-2 text-blue-500 h-5 w-5" />
                Questions sur vos habitudes
              </h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
            </div>
            
            {/* Questions générales sur la santé et l'alimentation - non liées aux symptômes */}
            <div className="space-y-6">
              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  Quelques questions supplémentaires pour mieux comprendre vos habitudes de vie.
                </p>
              </div>
              
              {/* Question sur les habitudes alimentaires générales */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Utensils className="h-4 w-4 flex-shrink-0" />
                    <span>Comment décririez-vous vos habitudes alimentaires actuelles ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {[
                      { value: 'balanced', label: 'Alimentation équilibrée', icon: <Utensils className="h-4 w-4 text-green-500" /> },
                      { value: 'processed', label: 'Beaucoup d\'aliments transformés', icon: <Utensils className="h-4 w-4 text-red-500" /> },
                      { value: 'restricted', label: 'Régime restrictif/Spécifique', icon: <Utensils className="h-4 w-4 text-amber-500" /> },
                      { value: 'irregular', label: 'Repas irréguliers/À la hâte', icon: <AlarmClock className="h-4 w-4 text-purple-500" /> },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => updateDynamicQuestion('dietary-habits', option.value)}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                          ${quizData.specificQuestions?.find(q => q.id === 'dietary-habits')?.answer === option.value 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.icon && (
                          <span className={`mr-2 ${quizData.specificQuestions?.find(q => q.id === 'dietary-habits')?.answer === option.value ? 'text-white' : ''}`}>
                            {option.icon}
                          </span>
                        )}
                        <span className="text-left">{option.label}</span>
                        
                        {quizData.specificQuestions?.find(q => q.id === 'dietary-habits')?.answer === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Question sur la consommation d'aliments inflammatoires */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Consommez-vous régulièrement ces aliments potentiellement inflammatoires ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {[
                      { value: 'sugar', label: 'Sucre raffiné/Desserts', icon: <Utensils className="h-4 w-4 text-rose-500" /> },
                      { value: 'gluten', label: 'Gluten/Blé', icon: <Utensils className="h-4 w-4 text-amber-500" /> },
                      { value: 'dairy', label: 'Produits laitiers', icon: <Coffee className="h-4 w-4 text-blue-500" /> },
                      { value: 'alcohol', label: 'Alcool régulier', icon: <Wine className="h-4 w-4 text-purple-500" /> },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => updateDynamicQuestion('inflammatory-foods', option.value)}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                          ${quizData.specificQuestions?.find(q => q.id === 'inflammatory-foods')?.answer === option.value 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.icon && (
                          <span className={`mr-2 ${quizData.specificQuestions?.find(q => q.id === 'inflammatory-foods')?.answer === option.value ? 'text-white' : ''}`}>
                            {option.icon}
                          </span>
                        )}
                        <span className="text-left">{option.label}</span>
                        
                        {quizData.specificQuestions?.find(q => q.id === 'inflammatory-foods')?.answer === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Question sur le niveau de stress */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 flex-shrink-0" />
                    <span>Quel est votre niveau de stress au quotidien ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    {[
                      { value: 'low', label: 'Faible - Généralement détendu(e)', icon: <Heart className="h-4 w-4 text-green-500" /> },
                      { value: 'moderate', label: 'Modéré - Occasionnellement stressé(e)', icon: <Heart className="h-4 w-4 text-amber-500" /> },
                      { value: 'high', label: 'Élevé - Souvent stressé(e)', icon: <Heart className="h-4 w-4 text-red-500" /> },
                      { value: 'extreme', label: 'Extrême - Constamment sous pression', icon: <HeartPulse className="h-4 w-4 text-purple-500" /> },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => updateDynamicQuestion('stress-level', option.value)}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                          ${quizData.specificQuestions?.find(q => q.id === 'stress-level')?.answer === option.value 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.icon && (
                          <span className={`mr-2 ${quizData.specificQuestions?.find(q => q.id === 'stress-level')?.answer === option.value ? 'text-white' : ''}`}>
                            {option.icon}
                          </span>
                        )}
                        <span className="text-left">{option.label}</span>
                        
                        {quizData.specificQuestions?.find(q => q.id === 'stress-level')?.answer === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Questions dynamiques (si disponibles) */}
              {dynamicQuestions
                .filter(q => {
                  // NE PLUS filtrer les questions déjà répondues
                  // pour qu'elles restent visibles avec leur réponse
                  // const isAlreadyAnswered = quizData.specificQuestions?.some(sq => sq.id === q.id);
                  // if (isAlreadyAnswered) return false;
                  
                  // Filtrer uniquement les questions pertinentes pour cette étape
                  const isDietaryRelated = q.id.includes('dietary') || 
                                        q.id.includes('diet') || 
                                        q.id.includes('nutritional') ||
                                        q.id.includes('food') ||
                                        q.id.includes('meal');
                                        
                  // Exclure les questions qu'on a déjà ajoutées manuellement
                  const isManuallyAdded = q.id === 'dietary-habits' ||
                                       q.id === 'inflammatory-foods' ||
                                       q.id === 'stress-level';
                                       
                  return isDietaryRelated && !isManuallyAdded;
                })
                .map((question, index) => (
                  <DynamicQuestionCard key={`${question.id}-${index}`} question={question} />
                ))
              }
            </div>
          </div>
        );
        
      case 4: // Mode de vie
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border-l-4 border-teal-400">
              <h2 className="text-xl font-medium mb-2 text-teal-800 flex items-center">
                <HeartPulse className="mr-2 text-teal-500 h-5 w-5" />
                Mode de vie
              </h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
            </div>
            
            {/* Questions uniquement liées au mode de vie - pas d'alimentation pour éviter les doublons */}
            <div className="mb-6 space-y-4">
              <h3 className="text-base font-medium text-gray-800">Questions sur votre activité physique</h3>
              
              {/* Activité physique */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 flex-shrink-0" />
                    <span>Quel est votre niveau d'activité physique ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {[
                      { value: 'sedentary', label: 'Sédentaire', icon: <BedDouble className="h-4 w-4 text-gray-500" /> },
                      { value: 'light', label: 'Légère (1-3 jours/semaine)', icon: <ActivitySquare className="h-4 w-4 text-blue-400" /> },
                      { value: 'moderate', label: 'Modérée (3-5 jours/semaine)', icon: <HeartPulse className="h-4 w-4 text-blue-500" /> },
                      { value: 'active', label: 'Très active (6-7 jours/semaine)', icon: <Activity className="h-4 w-4 text-blue-600" /> },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => updateDynamicQuestion('activity-level', option.value)}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                          ${quizData.specificQuestions?.find(q => q.id === 'activity-level')?.answer === option.value 
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.icon && (
                          <span className={`mr-2 ${quizData.specificQuestions?.find(q => q.id === 'activity-level')?.answer === option.value ? 'text-white' : ''}`}>
                            {option.icon}
                          </span>
                        )}
                        <span className="text-left">{option.label}</span>
                        
                        {quizData.specificQuestions?.find(q => q.id === 'activity-level')?.answer === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Qualité du sommeil */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-3 text-white">
                  <h3 className="text-base font-medium flex items-center gap-2">
                    <Moon className="h-4 w-4 flex-shrink-0" />
                    <span>Comment évaluez-vous votre qualité de sommeil ?</span>
                  </h3>
                </div>
                
                <div className="p-3 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {[
                      { value: 'poor', label: 'Mauvaise', icon: <Moon className="h-4 w-4 text-red-500" /> },
                      { value: 'average', label: 'Moyenne', icon: <Moon className="h-4 w-4 text-amber-500" /> },
                      { value: 'good', label: 'Bonne', icon: <Moon className="h-4 w-4 text-green-500" /> },
                      { value: 'excellent', label: 'Excellente', icon: <Moon className="h-4 w-4 text-emerald-500" /> },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        onClick={() => updateDynamicQuestion('sleep-quality', option.value)}
                        className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                          ${quizData.specificQuestions?.find(q => q.id === 'sleep-quality')?.answer === option.value 
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md' 
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option.icon && (
                          <span className={`mr-2 ${quizData.specificQuestions?.find(q => q.id === 'sleep-quality')?.answer === option.value ? 'text-white' : ''}`}>
                            {option.icon}
                          </span>
                        )}
                        <span className="text-left">{option.label}</span>
                        
                        {quizData.specificQuestions?.find(q => q.id === 'sleep-quality')?.answer === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Questions dynamiques uniquement liées au mode de vie */}
              {dynamicQuestions
                .filter(q => {
                  // Ne garder que les questions liées à l'activité physique et au mode de vie
                  const isLifestyleRelated = q.condition.field === 'activityLevel' || 
                                          q.condition.field === 'lifestyle' ||
                                          q.id.includes('activity') ||
                                          q.id.includes('exercise');
                  
                  // Exclure explicitement toutes les questions alimentaires
                  const isNotDietRelated = !q.id.includes('diet') && 
                                        !q.id.includes('food') && 
                                        !q.id.includes('meal') &&
                                        !q.id.includes('inflammatory');
                  
                  // Exclure les questions déjà ajoutées manuellement
                  const isNotManuallyAdded = q.id !== 'activity-level' && q.id !== 'sleep-quality';
                  
                  return isLifestyleRelated && isNotDietRelated && isNotManuallyAdded;
                })
                .map(question => {
                  // Mettre à jour la propriété answered basée sur les réponses existantes
                  const isAnswered = quizData.specificQuestions?.some(q => q.id === question.id);
                  return {
                    ...question,
                    answered: isAnswered
                  };
                })
                .map(question => (
                  <DynamicQuestionCard key={question.id} question={question} />
                ))
              }
            </div>
          </div>
        );
        
      case 5: // Priorities (dernière étape - fusion des étapes "Goals" et "Advanced")
        return <PrioritiesStep quizData={quizData} setQuizData={setQuizData} OBJECTIVE_ICONS={OBJECTIVE_ICONS} />;
        
      case -3: // Ancien code pour Lifestyle (remplacé par le nouveau système)
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h2 className="text-xl font-medium mb-2 text-blue-800 flex items-center">
                <HeartPulse className="mr-2 text-blue-500 h-5 w-5" />
                Your Lifestyle
              </h2>
              <p className="text-gray-600">{STEPS[currentStep].description}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Activity Level */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Dumbbell className="w-5 h-5 mr-2 text-blue-500" />
                  Activity Level
                </h3>
                
                <RadioGroup 
                  value={quizData.activityLevel} 
                  onValueChange={(value) => setQuizData(prev => ({...prev, activityLevel: value}))}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {[
                    { 
                      value: 'sedentary', 
                      label: 'Sedentary', 
                      description: 'Little to no exercise',
                      icon: <BedDouble className="h-4 w-4 text-gray-500" />
                    },
                    { 
                      value: 'light', 
                      label: 'Light', 
                      description: '1-3 days/week',
                      icon: <ActivitySquare className="h-4 w-4 text-blue-400" />
                    },
                    { 
                      value: 'moderate', 
                      label: 'Moderate', 
                      description: '3-5 days/week',
                      icon: <HeartPulse className="h-4 w-4 text-blue-500" />
                    },
                    { 
                      value: 'active', 
                      label: 'Very Active', 
                      description: '6-7 days/week',
                      icon: <Activity className="h-4 w-4 text-blue-600" />
                    },
                  ].map((level) => (
                    <div key={level.value} className="relative">
                      <RadioGroupItem 
                        value={level.value} 
                        id={`activity-${level.value}`} 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor={`activity-${level.value}`} 
                        className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer
                          peer-checked:border-blue-400 peer-checked:bg-blue-50 peer-checked:shadow-sm
                          ${quizData.activityLevel === level.value 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            {level.icon}
                          </div>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-xs text-gray-500">{level.description}</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Sleep Quality */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Moon className="w-5 h-5 mr-2 text-indigo-500" />
                  Sleep Quality
                </h3>
                
                <RadioGroup 
                  value={quizData.sleepQuality} 
                  onValueChange={(value) => setQuizData(prev => ({...prev, sleepQuality: value}))}
                  className="grid grid-cols-1 gap-2"
                >
                  {[
                    { 
                      value: 'poor', 
                      label: 'Poor', 
                      description: 'Frequently wake up tired, difficulty falling or staying asleep',
                      icon: <Moon className="h-4 w-4 text-red-500" />
                    },
                    { 
                      value: 'average', 
                      label: 'Average', 
                      description: 'Sometimes restful, sometimes not, occasional sleep problems',
                      icon: <Moon className="h-4 w-4 text-amber-500" />
                    },
                    { 
                      value: 'good', 
                      label: 'Good', 
                      description: 'Generally sleep well, rarely have trouble falling or staying asleep',
                      icon: <Moon className="h-4 w-4 text-green-500" />
                    },
                    { 
                      value: 'excellent', 
                      label: 'Excellent', 
                      description: 'Fall asleep easily, stay asleep, and wake up refreshed',
                      icon: <Moon className="h-4 w-4 text-emerald-500" />
                    },
                  ].map((level) => (
                    <div key={level.value} className="relative">
                      <RadioGroupItem 
                        value={level.value} 
                        id={`sleep-${level.value}`} 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor={`sleep-${level.value}`} 
                        className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer
                          peer-checked:border-indigo-400 peer-checked:bg-indigo-50 peer-checked:shadow-sm
                          ${quizData.sleepQuality === level.value 
                            ? 'border-indigo-400 bg-indigo-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="mr-3 mt-0.5">
                          {level.icon}
                        </div>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Stress Level */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-rose-500" />
                  Stress Level
                </h3>
                
                <RadioGroup 
                  value={quizData.stressLevel} 
                  onValueChange={(value) => setQuizData(prev => ({...prev, stressLevel: value}))}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {[
                    { 
                      value: 'low', 
                      label: 'Low', 
                      description: 'Rarely feel stressed, able to manage daily pressures easily',
                      icon: <Heart className="h-4 w-4 text-green-500" />
                    },
                    { 
                      value: 'moderate', 
                      label: 'Moderate', 
                      description: 'Sometimes feel stressed, but generally cope well',
                      icon: <Heart className="h-4 w-4 text-amber-500" />
                    },
                    { 
                      value: 'high', 
                      label: 'High', 
                      description: 'Often feel stressed, find it challenging to cope at times',
                      icon: <Heart className="h-4 w-4 text-red-500" />
                    },
                    { 
                      value: 'severe', 
                      label: 'Severe', 
                      description: 'Constantly feel stressed, overwhelming sense of pressure',
                      icon: <Heart className="h-4 w-4 text-rose-700" />
                    },
                  ].map((level) => (
                    <div key={level.value} className="relative">
                      <RadioGroupItem 
                        value={level.value} 
                        id={`stress-${level.value}`} 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor={`stress-${level.value}`} 
                        className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer
                          peer-checked:border-rose-400 peer-checked:bg-rose-50 peer-checked:shadow-sm
                          ${quizData.stressLevel === level.value 
                            ? 'border-rose-400 bg-rose-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="mr-3 mt-0.5">
                          {level.icon}
                        </div>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );
        
      // Case supprimé - original: // Ce cas est désormais fusionné avec l'étape Priorités (étape 3)
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 rounded-lg border-l-4 border-violet-400">
              <h2 className="text-xl font-medium mb-2 text-violet-800 flex items-center">
                <Star className="mr-2 text-violet-500 h-5 w-5" />
                Health Goals
              </h2>
              <p className="text-gray-600">Select the health goals you'd like to achieve with supplementation.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'energy', label: 'More energy' },
                { id: 'sleep', label: 'Better sleep' },
                { id: 'concentration', label: 'Improve concentration' },
                { id: 'immunity', label: 'Strengthen immunity' },
                { id: 'stress', label: 'Reduce stress' },
                { id: 'digestion', label: 'Support digestion' },
                { id: 'skin', label: 'Improve skin' },
                { id: 'weight', label: 'Balance weight' },
                { id: 'clarity', label: 'Mental clarity' },
                { id: 'performance', label: 'Athletic performance' },
                { id: 'aging', label: 'Healthy aging' },
              ].map((objective) => (
                <motion.div 
                  key={objective.id}
                  className={`border rounded-lg bg-white p-3 flex items-center gap-3 ${
                    quizData.objectives.includes(objective.label) 
                      ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 shadow-sm' 
                      : 'border-gray-200 hover:border-purple-100'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Checkbox 
                    id={`objective-${objective.id}`} 
                    checked={quizData.objectives.includes(objective.label)}
                    onCheckedChange={(checked) => updateObjectives(objective.label, checked as boolean)}
                    className="h-4 w-4 text-purple-600"
                  />
                  
                  <div className={`p-1.5 rounded-full ${quizData.objectives.includes(objective.label) ? 'bg-white' : 'bg-gray-50'}`}>
                    {OBJECTIVE_ICONS[objective.label]}
                  </div>
                  
                  <Label htmlFor={`objective-${objective.id}`} className="flex-1 cursor-pointer font-medium">
                    {objective.label}
                  </Label>
                  
                  {quizData.objectives.includes(objective.label) && (
                    <div className="flex-shrink-0 text-purple-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
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
                    <span className="font-medium">You have selected {quizData.objectives.length} goal{quizData.objectives.length > 1 ? 's' : ''}.</span> 
                    {' '}Your goals will significantly influence our personalized supplement recommendations.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 6: // Protein sources
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border-l-4 border-amber-400">
              <h2 className="text-xl font-medium mb-2 text-amber-800 flex items-center">
                <Salad className="mr-2 text-amber-500 h-5 w-5" />
                Protein Sources
              </h2>
              <p className="text-gray-600">Tell us about your protein preferences and consumption habits.</p>
            </div>
            
            <div className="space-y-6">
              {/* Meat Consumption */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Drumstick className="w-5 h-5 mr-2 text-amber-500" />
                  Meat Consumption
                </h3>
                
                <RadioGroup 
                  value={quizData.meatConsumption} 
                  onValueChange={(value) => setQuizData(prev => ({...prev, meatConsumption: value}))}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
                >
                  {[
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'occasionally', label: 'Occasionally' },
                    { value: 'frequently', label: 'Frequently' },
                  ].map((option) => (
                    <div key={option.value} className="relative">
                      <RadioGroupItem 
                        value={option.value} 
                        id={`meat-${option.value}`} 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor={`meat-${option.value}`} 
                        className={`flex items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer
                          peer-checked:border-amber-400 peer-checked:bg-amber-50 peer-checked:shadow-sm font-medium
                          ${quizData.meatConsumption === option.value 
                            ? 'border-amber-400 bg-amber-50 text-amber-800' 
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Fish Consumption */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Fish className="w-5 h-5 mr-2 text-cyan-500" />
                  Fish/Seafood Consumption
                </h3>
                
                <RadioGroup 
                  value={quizData.fishConsumption} 
                  onValueChange={(value) => setQuizData(prev => ({...prev, fishConsumption: value}))}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
                >
                  {[
                    { value: 'never', label: 'Never' },
                    { value: 'rarely', label: 'Rarely' },
                    { value: 'occasionally', label: 'Occasionally' },
                    { value: 'frequently', label: 'Frequently' },
                  ].map((option) => (
                    <div key={option.value} className="relative">
                      <RadioGroupItem 
                        value={option.value} 
                        id={`fish-${option.value}`} 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor={`fish-${option.value}`} 
                        className={`flex items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer
                          peer-checked:border-cyan-400 peer-checked:bg-cyan-50 peer-checked:shadow-sm font-medium
                          ${quizData.fishConsumption === option.value 
                            ? 'border-cyan-400 bg-cyan-50 text-cyan-800' 
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Fruits & Vegetables */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Apple className="w-5 h-5 mr-2 text-green-500" />
                  Fruits & Vegetables Consumption
                </h3>
                
                <RadioGroup 
                  value={quizData.fruitsVegetables} 
                  onValueChange={(value) => setQuizData(prev => ({...prev, fruitsVegetables: value}))}
                  className="grid grid-cols-1 gap-2"
                >
                  {[
                    { 
                      value: 'low', 
                      label: 'Low', 
                      description: 'Less than 1-2 servings per day',
                      icon: <Apple className="h-4 w-4 text-red-500" />
                    },
                    { 
                      value: 'medium', 
                      label: 'Medium', 
                      description: '3-4 servings per day',
                      icon: <Apple className="h-4 w-4 text-amber-500" />
                    },
                    { 
                      value: 'high', 
                      label: 'High', 
                      description: '5+ servings per day',
                      icon: <Apple className="h-4 w-4 text-green-500" />
                    },
                  ].map((level) => (
                    <div key={level.value} className="relative">
                      <RadioGroupItem 
                        value={level.value} 
                        id={`fruits-${level.value}`} 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor={`fruits-${level.value}`} 
                        className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer
                          peer-checked:border-green-400 peer-checked:bg-green-50 peer-checked:shadow-sm
                          ${quizData.fruitsVegetables === level.value 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="mr-3 mt-0.5">
                          {level.icon}
                        </div>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        );
          
      case 7: // Advanced
        return (
          <div className="space-y-6">
            <div className="mb-6 bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border-l-4 border-gray-400">
              <h2 className="text-xl font-medium mb-2 text-gray-800 flex items-center">
                <Brain className="mr-2 text-gray-500 h-5 w-5" />
                Advanced Questions
              </h2>
              <p className="text-gray-600">These optional questions will help us provide even more personalized recommendations.</p>
            </div>
            
            <div className="space-y-8">
              {/* Questions avancées statiques - toujours affichées */}
              <div className="space-y-6">
                {/* Question sur les facteurs de stress quotidiens */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-4 py-3 text-white">
                    <h3 className="text-base font-medium flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Quels facteurs de stress sont présents dans votre quotidien ?</span>
                    </h3>
                  </div>
                  
                  <div className="p-3 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {[
                        { value: 'work', label: 'Pression professionnelle', icon: <BookOpen className="h-4 w-4 text-blue-500" /> },
                        { value: 'sleep', label: 'Manque de sommeil/Sommeil irrégulier', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
                        { value: 'financial', label: 'Préoccupations financières', icon: <Heart className="h-4 w-4 text-green-500" /> },
                        { value: 'time', label: 'Manque de temps libre', icon: <Clock className="h-4 w-4 text-amber-500" /> },
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => updateDynamicQuestion('daily-stressors', option.value)}
                          className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                            ${quizData.specificQuestions?.find(q => q.id === 'daily-stressors')?.answer === option.value 
                              ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-md' 
                              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option.icon && (
                            <span className={`mr-2 ${quizData.specificQuestions?.find(q => q.id === 'daily-stressors')?.answer === option.value ? 'text-white' : ''}`}>
                              {option.icon}
                            </span>
                          )}
                          <span className="text-left">{option.label}</span>
                          
                          {quizData.specificQuestions?.find(q => q.id === 'daily-stressors')?.answer === option.value && (
                            <CheckCircle2 className="h-4 w-4 ml-auto" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Question sur l'historique de suppléments */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-500 to-slate-600 px-4 py-3 text-white">
                    <h3 className="text-base font-medium flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Avez-vous déjà essayé des suppléments naturels auparavant ?</span>
                    </h3>
                  </div>
                  
                  <div className="p-3 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {[
                        { value: 'never', label: 'Jamais essayé', icon: <X className="h-4 w-4 text-gray-500" /> },
                        { value: 'some', label: 'Quelques-uns, sans résultats notables', icon: <Smile className="h-4 w-4 text-amber-500" /> },
                        { value: 'effective', label: 'Oui, avec des résultats positifs', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
                        { value: 'negative', label: 'Oui, avec des effets indésirables', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => updateDynamicQuestion('supplement-history', option.value)}
                          className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center
                            ${quizData.specificQuestions?.find(q => q.id === 'supplement-history')?.answer === option.value 
                              ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-md' 
                              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option.icon && (
                            <span className={`mr-2 ${quizData.specificQuestions?.find(q => q.id === 'supplement-history')?.answer === option.value ? 'text-white' : ''}`}>
                              {option.icon}
                            </span>
                          )}
                          <span className="text-left">{option.label}</span>
                          
                          {quizData.specificQuestions?.find(q => q.id === 'supplement-history')?.answer === option.value && (
                            <CheckCircle2 className="h-4 w-4 ml-auto" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Questions avancées supplémentaires - toujours conservées mais probablement vides */}
              {dynamicQuestions
                .filter(q => 
                  // Ne PLUS filtrer par état de réponse
                  // Filtrer uniquement les questions liées à la section advanced
                  q.condition.field === 'advanced')
                .map(question => (
                  <DynamicQuestionCard key={question.id} question={question} />
                ))
              }
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                  Ready for Your Results
                </h3>
                <p className="text-blue-700 text-sm">
                  You've completed all the questions! Click "See Results" to get your personalized supplement recommendations.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Step {currentStep + 1}</div>;
    }
  };

  return (
    <div className="container max-w-3xl py-6 md:py-12">
      {/* Afficher le bouton de prévisualisation si des symptômes ou objectifs sont sélectionnés */}
      {(quizData.symptoms.length > 0 || quizData.objectives.length > 0) && !showPreview && (
        <Button 
          variant="ghost" 
          className="absolute right-4 top-4 flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
          onClick={() => setShowPreview(true)}
        >
          <Eye className="h-4 w-4" />
          <span>Aperçu des recommandations</span>
        </Button>
      )}
      
      {/* Afficher la prévisualisation */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowPreview(false)}>
            <div onClick={e => e.stopPropagation()}>
              {/* Composant de prévisualisation des recommandations personnalisées */}
            </div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Étapes du quiz et progression - Version améliorée */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Health Assessment
          </h1>
          <div className="px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-700 font-medium text-sm flex items-center">
            <span>{currentStep + 1}</span>
            <span className="mx-1 text-indigo-300">/</span>
            <span>{STEPS.length}</span>
          </div>
        </div>
        
        <div className="space-y-5">
          {/* Barre de progression améliorée avec étiquette de pourcentage */}
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {STEPS[currentStep].label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-indigo-50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col shadow-none whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
          
          {/* Étapes interactives avec état actif/complété/inactif */}
          <div className="relative flex items-center justify-center mt-2">
            {/* Ligne de connexion */}
            <div className="absolute h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2 left-0 right-0 z-0"></div>
            
            {/* Étapes */}
            <div className="relative z-10 flex justify-between w-full px-2">
              {STEPS.map((step, index) => {
                // Déterminer l'état de l'étape
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;
                
                // Styles conditionnels
                const bgColor = isCompleted 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                  : isCurrent 
                    ? 'bg-white border-2 border-indigo-500' 
                    : 'bg-white border border-gray-300';
                
                const textColor = isCompleted 
                  ? 'text-white' 
                  : isCurrent 
                    ? 'text-indigo-600' 
                    : 'text-gray-500';
                
                const stepSize = isCurrent ? 'w-12 h-12 md:w-14 md:h-14' : 'w-10 h-10 md:w-12 md:h-12';
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            className={`${stepSize} rounded-full flex items-center justify-center shadow-sm cursor-pointer relative ${bgColor}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ scale: isCurrent ? [1, 1.05, 1] : 1 }}
                            transition={{ 
                              duration: isCurrent ? 1.5 : 0.2,
                              repeat: isCurrent ? Infinity : 0,
                              repeatType: "reverse"
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : (
                              <div className={`${textColor}`}>
                                {step.icon}
                              </div>
                            )}
                            
                            {/* Indicateur numérique */}
                            <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-white rounded-full text-xs text-indigo-700 font-bold border border-indigo-100">
                              {index + 1}
                            </span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <div className="text-center">
                            <p className="font-medium">{step.label}</p>
                            <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {/* Étiquette de l'étape - visible uniquement sur desktop */}
                    <span className={`mt-2 text-xs font-medium hidden md:block ${
                      isCurrent ? 'text-indigo-700' : isCompleted ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu de l'étape actuelle */}
      <Card className="p-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ 
              opacity: 0, 
              x: direction * 100 // Glissement de gauche à droite ou de droite à gauche selon la direction
            }}
            animate={{ 
              opacity: 1, 
              x: 0 
            }}
            exit={{ 
              opacity: 0, 
              x: direction * -100 // Sortie dans la direction opposée
            }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </Card>
      
      {/* Navigation buttons - optimisés pour mobile */}
      <motion.div 
        className="flex justify-between mt-6 touch-manipulation" 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="touch-target mobile-transition px-5 py-2.5 min-h-[44px] text-base"
        >
          Précédent
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="default" 
            onClick={handleNext}
            className="touch-target mobile-transition px-6 py-2.5 min-h-[44px] text-base bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md"
          >
            {currentStep < STEPS.length - 1 ? (
              <>
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            ) : 'Voir les résultats'}
          </Button>
        </div>
      </motion.div>
      
      {/* Animation d'analyse affichée après la complétion du quiz */}
      {showAnalysis && (
        <AnalysisAnimation 
          onComplete={handleAnalysisComplete}
          durationMs={5000} 
        />
      )}
    </div>
  );

}