import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  ChevronRight, 
  Dna, 
  LoaderCircle, 
  Microscope, 
  Pill, 
  FlaskConical, 
  Gauge, 
  Cpu,
  Sparkles
} from 'lucide-react';

interface AnalysisAnimationProps {
  onComplete: () => void;
  durationMs?: number;
}

const AnalysisAnimation: React.FC<AnalysisAnimationProps> = ({ 
  onComplete, 
  durationMs = 5000 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Étapes d'analyse à afficher
  const analysisSteps = [
    "Analyse des symptômes prioritaires...",
    "Détermination des carences potentielles...",
    "Corrélation avec les biomarqueurs...",
    "Analyse scientifique des composés actifs...",
    "Génération des recommandations personnalisées...",
    "Optimisation du protocole d'administration...",
    "Finalisation de votre programme nutritionnel..."
  ];

  useEffect(() => {
    // Calcul du temps par étape
    const stepDuration = durationMs / (analysisSteps.length + 1);
    
    // Timer pour les étapes
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepTimer);
          return prev;
        }
      });
    }, stepDuration);
    
    // Timer pour la progression continue
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (durationMs / 50));
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          setTimeout(onComplete, 300); // Léger délai avant de continuer
          return 100;
        }
        return newProgress;
      });
    }, 50);
    
    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [durationMs, analysisSteps.length, onComplete]);

  const getStepIcon = (step: number) => {
    const icons = [
      <Brain className="w-5 h-5 text-indigo-500" />,
      <Microscope className="w-5 h-5 text-purple-500" />,
      <Dna className="w-5 h-5 text-blue-500" />,
      <FlaskConical className="w-5 h-5 text-emerald-500" />,
      <Pill className="w-5 h-5 text-pink-500" />,
      <Gauge className="w-5 h-5 text-amber-500" />,
      <Sparkles className="w-5 h-5 text-teal-500" />
    ];
    return icons[step % icons.length];
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-md mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Analyse nutritionnelle en cours
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Nous analysons vos réponses pour déterminer les meilleures recommandations
          </p>
        </motion.div>
        
        {/* Animation circulaire */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute inset-0"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="#E2E8F0" 
                strokeWidth="6" 
              />
              <motion.circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="url(#gradient)" 
                strokeWidth="6" 
                strokeDasharray="251"
                strokeDashoffset={251 - (251 * progress) / 100}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
        </div>
        
        {/* Étapes d'analyse */}
        <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <ul className="space-y-3">
            {analysisSteps.map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.3,
                  x: 0 
                }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1
                }}
                className={`flex items-center ${
                  index <= currentStep 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  {index < currentStep ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  ) : index === currentStep ? (
                    <div className="relative">
                      {getStepIcon(index)}
                      <motion.div 
                        className="absolute inset-0 rounded-full border-2 border-indigo-400" 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  {step}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <motion.div 
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Veuillez patienter pendant que nous analysons vos données...
        </p>
      </div>
    </div>
  );
};

export default AnalysisAnimation;