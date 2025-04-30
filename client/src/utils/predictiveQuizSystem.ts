/**
 * Système de quiz prédictif basé sur des données scientifiques
 * Ce module implémente un système avancé pour réduire le nombre de questions nécessaires
 * en utilisant des relations prédictives entre symptômes et facteurs de santé
 */

import predictiveRulesData from '../data/predictiveQuizRules_v2.json';
import symptomInteractions from '../data/symptomInteractions_v2.json';
import { femaleSpecificRules, determineFemaleLifeCyclePhase } from '../data/femaleSpecificRules';
import { adjustSymptomPrioritiesByCycle } from '../utils/femaleCycleIntegration';

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
  answer?: string | string[] | number;
  followUp?: string;
  importance?: number; // Pour compatibilité avec d'autres interfaces
  condition?: {
    field: string;
    value: any;
    operator: 'includes' | 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
  };
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
  // Données démographiques
  age?: string;
  gender?: string;
  medications?: string[];
  // Données spécifiques au cycle féminin
  femaleSpecificData?: {
    cyclePhase?: 'follicular' | 'ovulation' | 'luteal' | 'menstrual' | 'perimenopause' | 'postmenopause';
    cycleLength?: number;
    periodLength?: number;
    lastPeriodDate?: string;
    pregnancyStatus?: 'not_pregnant' | 'pregnant' | 'breastfeeding';
    hormonalBirthControl?: boolean;
    hormonalStatus?: 'regular' | 'irregular' | 'hormonal_therapy';
    commonSymptoms?: {
      pms?: number;
      cramps?: number;
      bloating?: number;
      moodSwings?: number;
      energyFluctuations?: number;
    };
  };
  [key: string]: any;
}

// Interface pour les règles prédictives
export interface IfPattern {
  symptoms?: string[];
  lifestyle?: string[];
  sleepQuality?: string;
  dietaryFactors?: string | string[];
  sunExposure?: string;
  // Données démographiques
  age?: string | string[];
  gender?: string | string[];
  medications?: string[];
  // Facteurs démographiques groupés
  demographicFactors?: {
    age?: string;
    gender?: string;
    medications?: string[];
  };
  // Facteurs spécifiques au cycle féminin
  femaleCycle?: {
    cyclePhase?: 'follicular' | 'ovulation' | 'luteal' | 'menstrual' | 'perimenopause' | 'postmenopause';
    hormonalStatus?: 'regular' | 'irregular' | 'hormonal_therapy';
    ageRange?: [number, number]; // Pour spécifier une plage d'âge féminin spécifique
  };
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
  
  // Variables pour contenir les données démographiques pour le calcul de conditions
  const userAge = quizData.age || 'adult';
  const userGender = quizData.gender || 'any';
  const userMedications = quizData.medications || [];
  
  console.log("Données démographiques disponibles pour les prédictions:", {
    age: userAge,
    gender: userGender,
    medications: userMedications
  });
  
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
    
    // Vérifier les données démographiques - Âge, Genre, Médicaments
    const demographicsFields = {
      age: userAge,
      gender: userGender,
      medications: userMedications
    };
    
    // Vérifier chaque champ démographique séparément
    Object.entries(demographicsFields).forEach(([key, value]) => {
      const fieldInRule = (ifPattern as any)[key];
      if (fieldInRule) {
        if (key === 'medications') {
          // Pour les médicaments, vérifier si au moins un médicament correspond
          if (Array.isArray(fieldInRule)) {
            const hasSomeMedication = fieldInRule.some((med: string) => userMedications.includes(med));
            if (!hasSomeMedication && fieldInRule.length > 0) {
              matches = false;
            }
          } else {
            if (!userMedications.includes(fieldInRule)) {
              matches = false;
            }
          }
        } else {
          // Pour l'âge et le genre, vérifier l'égalité exacte ou l'inclusion dans un tableau
          const fieldMatches = Array.isArray(fieldInRule) 
            ? fieldInRule.includes(value) || fieldInRule.includes('any')
            : fieldInRule === value || fieldInRule === 'any';
          
          if (!fieldMatches) {
            console.log(`Règle ignorée - ${key} incompatible:`, fieldInRule, "vs", value);
            matches = false;
          }
        }
      }
    });
    
    // Vérifier le régime alimentaire
    if (ifPattern.dietaryFactors && quizData.dietType) {
      const dietMatches = Array.isArray(ifPattern.dietaryFactors) 
        ? ifPattern.dietaryFactors.includes(quizData.dietType)
        : ifPattern.dietaryFactors === quizData.dietType;
      
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
  
  // Ajouter les règles spécifiques aux femmes si l'utilisateur est une femme
  if (userGender === 'femme') {
    console.log("Application des règles spécifiques aux femmes");
    
    // Vérifier si nous avons des données de cycle menstruel
    const hasCycleData = quizData.femaleSpecificData && quizData.femaleSpecificData.cyclePhase;
    
    // Pour chaque règle spécifique aux femmes
    femaleSpecificRules.forEach(rule => {
      let matches = true;
      
      // Vérifier si les symptômes dans la règle sont présents dans les données du quiz
      if (rule.ifPattern.symptoms) {
        const hasAllSymptoms = rule.ifPattern.symptoms.every(symptom => 
          quizData.symptoms?.includes(symptom)
        );
        if (!hasAllSymptoms) matches = false;
      }
      
      // Vérifier la correspondance avec les données du cycle si spécifiées dans la règle
      if (rule.ifPattern.femaleCycle && hasCycleData) {
        // Vérifier la phase du cycle si présente dans la règle et dans les données utilisateur
        if ('cyclePhase' in rule.ifPattern.femaleCycle && 
            rule.ifPattern.femaleCycle.cyclePhase !== quizData.femaleSpecificData?.cyclePhase) {
          matches = false;
        }
        
        // Vérifier le statut hormonal si présent dans la règle et dans les données utilisateur
        if ('hormonalStatus' in rule.ifPattern.femaleCycle && 
            rule.ifPattern.femaleCycle.hormonalStatus !== quizData.femaleSpecificData?.hormonalStatus) {
          matches = false;
        }
        
        // Vérifier la plage d'âge spécifique au cycle
        if (rule.ifPattern.femaleCycle.ageRange && quizData.age) {
          const userAgeNum = parseInt(quizData.age as string);
          const [minAge, maxAge] = rule.ifPattern.femaleCycle.ageRange;
          
          if (userAgeNum < minAge || userAgeNum > maxAge) {
            matches = false;
          }
        }
      }
      
      // Si la règle s'applique, ajouter les prédictions
      if (matches) {
        console.log("Règle spécifique aux femmes correspondante trouvée:", rule);
        
        // Ajouter les symptômes prédits supplémentaires
        if (rule.thenPredict.likelyAdditionalSymptoms) {
          rule.thenPredict.likelyAdditionalSymptoms.forEach(symptom => {
            // Ne pas ajouter les symptômes que l'utilisateur a déjà sélectionnés
            if (!quizData.symptoms?.includes(symptom)) {
              predictedSymptoms.add(symptom);
            }
          });
        }
        
        // Ajouter les suppléments suggérés
        if (rule.thenPredict.recommendedSupplements) {
          rule.thenPredict.recommendedSupplements.forEach(supplement => {
            predictedSupplements.add(supplement);
          });
        }
        
        // Garder la confiance la plus élevée
        if (rule.thenPredict.confidenceScore > maxConfidence) {
          maxConfidence = rule.thenPredict.confidenceScore;
        }
        
        // Ajouter les fondements scientifiques
        if (rule.thenPredict.scientificRationale) {
          scientificBasisSet.add(rule.thenPredict.scientificRationale);
        }
      }
    });
    
    // Si nous avons des données de cycle, ajuster les priorités des symptômes
    if (hasCycleData && quizData.symptomDetails) {
      // Convertir les détails des symptômes en format Record<string, number>
      const symptomIntensities: Record<string, number> = {};
      
      Object.entries(quizData.symptomDetails || {}).forEach(([symptom, details]) => {
        if (typeof details === 'object' && details && 'severity' in details) {
          symptomIntensities[symptom] = details.severity as number;
        } else if (typeof details === 'number') {
          symptomIntensities[symptom] = details;
        }
      });
      
      // Ajuster les priorités des symptômes en fonction du cycle
      const adjustedSymptoms = adjustSymptomPrioritiesByCycle(
        symptomIntensities, 
        quizData.femaleSpecificData
      );
      
      // Ajouter des symptômes prédits basés sur la phase du cycle
      Object.entries(adjustedSymptoms).forEach(([symptom, intensity]) => {
        const intensityValue = intensity as number;
        if (intensityValue > symptomIntensities[symptom] && !quizData.symptoms?.includes(symptom)) {
          predictedSymptoms.add(symptom);
          scientificBasisSet.add(`La phase du cycle menstruel (${quizData.femaleSpecificData?.cyclePhase}) est associée à une augmentation du symptôme: ${symptom}`);
        }
      });
    }
  }
  
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
  predictedSkipQuestions.add('protein_consumption'); // Question à sauter par défaut
  
  // Éviter les questions qui seront posées dans les étapes ultérieures du quiz
  predictedSkipQuestions.add('health_goals');     // Sera posé dans l'étape "Goals"
  predictedSkipQuestions.add('stress_level');     // Sera posé dans l'étape "Advanced"
  predictedSkipQuestions.add('dietary_patterns'); // Sera posé dans l'étape "Diet"
  
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
 * @param selectedSymptoms Symptômes sélectionnés par l'utilisateur
 * @param predictedSymptoms Ensemble de symptômes prédits à modifier
 */
function analyzeSymptomInteractions(selectedSymptoms: string[], predictedSymptoms: Set<string>) {
  try {
    // Parcourir les données d'interactions de symptômes
    symptomInteractions.interactions.forEach(interaction => {
      const primarySymptomId = interaction.primarySymptom.id;
      
      if (selectedSymptoms.includes(primarySymptomId)) {
        // Ajouter les symptômes fortement corrélés
        interaction.correlatedSymptoms?.forEach(correlatedSymptom => {
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
 * et ses données démographiques (âge, sexe, médicaments)
 * @param userSymptoms Symptômes de l'utilisateur
 * @param quizData Données complètes du quiz incluant les données démographiques
 * @returns Questions dynamiques générées
 */
export function generatePredictiveQuestions(userSymptoms: string[], quizData?: Partial<QuizResponse>): DynamicQuestion[] {
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
  // (excepté les questions redondantes et celle sur les symptômes principaux)
  coreQuestions
    .filter(q => 
      q.id !== 'primary_symptoms' && 
      q.id !== 'health_goals' && 
      q.id !== 'stress_level' && 
      q.id !== 'dietary_patterns' &&
      q.priority <= 2
    )
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
  
  // Ajouter des questions spécifiques basées sur les données démographiques
  if (quizData) {
    // Questions basées sur l'âge
    if (quizData.age) {
      const age = parseInt(quizData.age as string, 10);
      
      if (age > 55) {
        // Questions spécifiques pour les personnes plus âgées
        if (userSymptoms.includes('joint_pain') || userSymptoms.includes('joints')) {
          questions.push({
            id: 'joint_pain_frequency_age',
            question: "À quel moment de la journée vos douleurs articulaires sont-elles les plus intenses?",
            type: 'radio',
            options: [
              {value: 'morning', label: 'Au réveil'},
              {value: 'afternoon', label: 'Après-midi'},
              {value: 'evening', label: 'Soirée'},
              {value: 'night', label: 'Nuit'}
            ],
            priority: 1,
            answered: false
          });
        }
        
        // Question sur la mobilité pour les personnes âgées
        if (userSymptoms.includes('fatigue') || userSymptoms.includes('low-energy')) {
          questions.push({
            id: 'mobility_issues_age',
            question: "Avez-vous des difficultés à vous déplacer qui pourraient être liées à votre fatigue?",
            type: 'radio',
            options: [
              {value: 'yes', label: 'Oui'},
              {value: 'sometimes', label: 'Parfois'},
              {value: 'no', label: 'Non'}
            ],
            priority: 2,
            answered: false
          });
        }
      }
    }
    
    // Questions basées sur le genre
    if (quizData.gender) {
      if (quizData.gender === 'female') {
        // Questions spécifiques pour les femmes
        if (userSymptoms.includes('fatigue') || userSymptoms.includes('low-energy')) {
          questions.push({
            id: 'hormonal_factors',
            question: "Vos symptômes de fatigue sont-ils liés à votre cycle hormonal?",
            type: 'radio',
            options: [
              {value: 'yes', label: 'Oui, clairement'},
              {value: 'sometimes', label: 'Parfois'},
              {value: 'no', label: 'Non, aucun lien'},
              {value: 'not_applicable', label: 'Non applicable'}
            ],
            priority: 1,
            answered: false
          });
        }
        
        if (userSymptoms.includes('stress') || userSymptoms.includes('mood')) {
          questions.push({
            id: 'stress_hormonal',
            question: "Vos sautes d'humeur ou stress sont-ils plus intenses à certaines périodes du mois?",
            type: 'radio',
            options: [
              {value: 'yes', label: 'Oui, clairement'},
              {value: 'sometimes', label: 'Parfois'},
              {value: 'no', label: 'Non, aucun lien'},
              {value: 'not_applicable', label: 'Non applicable'}
            ],
            priority: 1,
            answered: false
          });
        }
      } else if (quizData.gender === 'male') {
        // Questions spécifiques pour les hommes
        if (userSymptoms.includes('fatigue') || userSymptoms.includes('low-energy')) {
          questions.push({
            id: 'male_energy_patterns',
            question: "À quel moment de la journée votre énergie est-elle au plus bas?",
            type: 'radio',
            options: [
              {value: 'morning', label: 'Matin'},
              {value: 'afternoon', label: 'Après-midi'},
              {value: 'evening', label: 'Soirée'},
              {value: 'constant', label: 'Constamment bas'}
            ],
            priority: 2,
            answered: false
          });
        }
      }
    }
    
    // Questions basées sur les médicaments
    if (quizData.medications && quizData.medications.length > 0) {
      questions.push({
        id: 'medication_effects',
        question: "Avez-vous remarqué un lien entre la prise de vos médicaments et l'intensité de vos symptômes?",
        type: 'radio',
        options: [
          {value: 'improved', label: 'Mes symptômes s\'améliorent'},
          {value: 'worsened', label: 'Mes symptômes s\'aggravent'},
          {value: 'no_change', label: 'Aucun changement notable'},
          {value: 'not_sure', label: 'Je ne suis pas sûr(e)'}
        ],
        priority: 1,
        answered: false
      });
    }
  }
  
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
 * @param responses Réponses actuelles du quiz
 * @param newlyAnsweredQuestionId ID de la question qui vient d'être répondue
 * @returns Les questions suivantes recommandées
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
  
  // Générer de nouvelles questions adaptées en incluant les données démographiques
  const newQuestions = generatePredictiveQuestions(allSymptoms, responses);
  
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