/**
 * Système de quiz prédictif basé sur des données scientifiques
 * Ce module implémente un système avancé pour réduire le nombre de questions nécessaires
 * en utilisant des relations prédictives entre symptômes et facteurs de santé
 */

import predictiveRulesData from '../data/predictiveQuizRules_v2.json';
import symptomInteractions from '../data/symptomInteractions_v2.json';

// Types pour le système prédictif
export interface DynamicQuestion {
  id: string;
  question: string;
  type: string;
  options: any;
  predictivePower?: number;
  conditionalFollowUp?: boolean;
  answered?: boolean;
  priority?: number;
}

export interface PredictionResult {
  additionalSymptoms: string[];
  skipQuestions: string[];
  suggestedSupplements: string[];
  confidenceScore: number;
  scientificBasis: string[];
}

// Interface pour la réponse du quiz
export interface QuizResponse {
  symptoms: string[];
  symptomDetails?: Record<string, any>;
  dietType?: string;
  dietaryPatterns?: string[];
  stressLevel?: string;
  sleepQuality?: string;
  goals?: string[];
  sunExposure?: string;
  [key: string]: any;
}

/**
 * Génère des prédictions basées sur les réponses actuelles de l'utilisateur
 * @param quizData Données actuelles du quiz
 * @returns Résultat de prédiction avec symptômes additionnels et recommandations
 */
export function predictFromUserResponses(quizData: Partial<QuizResponse>): PredictionResult {
  console.log("Génération de prédictions basées sur:", quizData);
  
  // Résultat par défaut
  const defaultResult: PredictionResult = {
    additionalSymptoms: [],
    skipQuestions: [],
    suggestedSupplements: [],
    confidenceScore: 0,
    scientificBasis: []
  };
  
  // Si nous n'avons pas assez de données, retourner le résultat par défaut
  if (!quizData.symptoms || quizData.symptoms.length === 0) {
    console.log("Pas assez de données pour faire des prédictions");
    return defaultResult;
  }
  
  // Chercher une règle qui correspond aux données actuelles
  // Utiliser les predictionRules du fichier JSON
  const { predictionRules } = predictiveRulesData;
  
  // Ensemble pour stocker les symptômes prédits sans doublons
  const predictedSymptoms = new Set<string>();
  const predictedSupplements = new Set<string>();
  const predictedSkipQuestions = new Set<string>();
  const scientificBasisSet = new Set<string>();
  
  let maxConfidence = 0;
  
  // Vérifier chaque règle pour voir si elle s'applique
  predictionRules.forEach(rule => {
    const { ifPattern, thenPredict } = rule;
    let matches = true;
    
    // Vérifier si les symptômes dans la règle sont présents dans les données du quiz
    if (ifPattern.symptoms) {
      const hasAllSymptoms = ifPattern.symptoms.every(symptom => 
        quizData.symptoms?.includes(symptom)
      );
      if (!hasAllSymptoms) matches = false;
    }
    
    // Vérifier le régime alimentaire
    if (ifPattern.dietaryFactors && quizData.dietType) {
      const dietMatches = Array.isArray(ifPattern.dietaryFactors) ? 
        ifPattern.dietaryFactors.includes(quizData.dietType) :
        ifPattern.dietaryFactors === quizData.dietType;
      
      if (!dietMatches) matches = false;
    }
    
    // Vérifier les facteurs de mode de vie (stress, sommeil)
    if (ifPattern.lifestyle) {
      // Vérifier le niveau de stress
      if (ifPattern.lifestyle.includes('stress_eleve') && quizData.stressLevel !== 'eleve' && quizData.stressLevel !== 'tres_eleve') {
        matches = false;
      }
      
      // Vérifier l'exposition au soleil
      if (ifPattern.lifestyle.includes('exposition_soleil_faible') && 
          !(quizData.sunExposure === 'moins_15_minutes' || quizData.sunExposure === '15_30_minutes')) {
        matches = false;
      }
    }
    
    // Vérifier la qualité du sommeil
    if (ifPattern.sleepQuality && quizData.sleepQuality !== ifPattern.sleepQuality) {
      matches = false;
    }
    
    // Si la règle s'applique, ajouter les prédictions
    if (matches) {
      console.log("Règle prédictive correspondante trouvée:", rule);
      
      // Ajouter les symptômes prédits supplémentaires
      if (thenPredict.likelyAdditionalSymptoms) {
        thenPredict.likelyAdditionalSymptoms.forEach(symptom => {
          // Ne pas ajouter les symptômes que l'utilisateur a déjà sélectionnés
          if (!quizData.symptoms?.includes(symptom)) {
            predictedSymptoms.add(symptom);
          }
        });
      }
      
      // Ajouter les suppléments suggérés
      if (thenPredict.recommendedSupplements) {
        thenPredict.recommendedSupplements.forEach(supplement => {
          predictedSupplements.add(supplement);
        });
      }
      
      // Garder la confiance la plus élevée
      if (thenPredict.confidenceScore > maxConfidence) {
        maxConfidence = thenPredict.confidenceScore;
      }
      
      // Ajouter les fondements scientifiques
      if (thenPredict.scientificRationale) {
        scientificBasisSet.add(thenPredict.scientificRationale);
      }
    }
  });
  
  // Utiliser également la matrice de corrélation des symptômes pour des prédictions supplémentaires
  // basées sur les corrélations fortes (> 0.7)
  const { symptomCorrelationMatrix } = predictiveRulesData;
  
  quizData.symptoms?.forEach(symptom => {
    const symptomKey = symptom as keyof typeof symptomCorrelationMatrix;
    const correlations = symptomCorrelationMatrix[symptomKey];
    
    if (correlations) {
      Object.entries(correlations).forEach(([correlatedSymptom, strength]) => {
        if (strength > 0.7 && !quizData.symptoms?.includes(correlatedSymptom) && !predictedSymptoms.has(correlatedSymptom)) {
          predictedSymptoms.add(correlatedSymptom);
          scientificBasisSet.add(`Corrélation forte (${strength}) entre ${symptom} et ${correlatedSymptom}`);
        }
      });
    }
  });
  
  // Déterminer les questions à sauter en fonction des symptômes et objectifs
  predictedSkipQuestions.add('protein_consumption'); // Exemple de question à sauter par défaut
  
  // Analyser les interactions entre symptômes pour peaufiner les prédictions
  analyzeSymptomInteractions(quizData.symptoms || [], predictedSymptoms);
  
  return {
    additionalSymptoms: Array.from(predictedSymptoms),
    skipQuestions: Array.from(predictedSkipQuestions),
    suggestedSupplements: Array.from(predictedSupplements),
    confidenceScore: maxConfidence,
    scientificBasis: Array.from(scientificBasisSet)
  };
}

/**
 * Analyse les interactions entre symptômes pour améliorer les prédictions
 */
function analyzeSymptomInteractions(selectedSymptoms: string[], predictedSymptoms: Set<string>) {
  try {
    // Parcourir les données d'interactions de symptômes
    symptomInteractions.interactions.forEach((interaction: any) => {
      const primarySymptomId = interaction.primarySymptom.id;
      
      if (selectedSymptoms.includes(primarySymptomId)) {
        // Ajouter les symptômes fortement corrélés
        interaction.correlatedSymptoms?.forEach((correlatedSymptom: any) => {
          if (correlatedSymptom.correlationStrength >= 0.75 && !selectedSymptoms.includes(correlatedSymptom.id)) {
            predictedSymptoms.add(correlatedSymptom.id);
          }
        });
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'analyse des interactions entre symptômes:", error);
  }
}

/**
 * Génère des questions prédictives basées sur les symptômes de l'utilisateur
 */
export function generatePredictiveQuestions(userSymptoms: string[]): DynamicQuestion[] {
  const questions: DynamicQuestion[] = [];
  
  // Si aucun symptôme, utiliser les questions principales
  if (!userSymptoms || userSymptoms.length === 0) {
    // Ajouter les questions de base du fichier predictiveRulesData
    const { coreQuestions } = predictiveRulesData;
    
    return coreQuestions.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options,
      predictivePower: q.predictivePower,
      priority: q.priority,
      answered: false
    }));
  }
  
  // Sinon, ajouter des questions spécifiques aux symptômes
  // Commencer par les questions principales les plus pertinentes
  const { coreQuestions, branchingLogic } = predictiveRulesData;
  
  // Ajouter d'abord les questions principales prioritaires 
  // (excepté la première question sur les symptômes principaux)
  coreQuestions
    .filter(q => q.id !== 'primary_symptoms' && q.priority <= 2)
    .forEach(q => {
      questions.push({
        id: q.id,
        question: q.question,
        type: q.type,
        options: q.options,
        predictivePower: q.predictivePower,
        priority: q.priority,
        answered: false
      });
    });
  
  // Ajouter des questions de branchement basées sur les symptômes
  branchingLogic.forEach(branch => {
    const { ifCondition, thenAsk } = branch;
    
    if (ifCondition.questionId === 'primary_symptoms') {
      const hasMatchingSymptom = ifCondition.selectedOptions.some(option => 
        userSymptoms.includes(option)
      );
      
      if (hasMatchingSymptom) {
        questions.push({
          id: thenAsk.id,
          question: thenAsk.question,
          type: thenAsk.type,
          options: thenAsk.options,
          predictivePower: 0.4, // Valeur par défaut
          priority: 2, // Priorité élevée pour les questions de branchement
          answered: false
        });
      }
    }
  });
  
  // Trier par priorité puis par puissance prédictive
  return questions.sort((a, b) => {
    if ((a.priority || 3) !== (b.priority || 3)) {
      return (a.priority || 3) - (b.priority || 3);
    }
    return (b.predictivePower || 0) - (a.predictivePower || 0);
  });
}

/**
 * Adapte le questionnaire en fonction des réponses précédentes
 */
export function getNextQuestions(responses: Partial<QuizResponse>, newlyAnsweredQuestionId: string): DynamicQuestion[] {
  console.log("Adaptation des questions suite à la réponse à:", newlyAnsweredQuestionId);
  
  // Générer des prédictions basées sur les réponses actuelles
  const predictions = predictFromUserResponses(responses);
  
  // Combiner les symptômes existants et prédits pour la génération de questions
  const allSymptoms = [
    ...(responses.symptoms || []),
    ...predictions.additionalSymptoms
  ];
  
  // Générer de nouvelles questions adaptées
  const newQuestions = generatePredictiveQuestions(allSymptoms);
  
  // Filtrer les questions à sauter selon les prédictions
  const filteredQuestions = newQuestions.filter(q => 
    !predictions.skipQuestions.includes(q.id)
  );
  
  console.log(`${filteredQuestions.length} questions adaptatives générées`);
  return filteredQuestions;
}

export default {
  predictFromUserResponses,
  generatePredictiveQuestions,
  getNextQuestions
};