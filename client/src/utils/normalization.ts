/**
 * Système de normalisation des identifiants pour assurer la cohérence
 * entre les versions française et anglaise des symptômes et objectifs.
 * 
 * Ce système permet de résoudre les problèmes de cohérence dans les identifiants
 * utilisés à travers l'application, notamment dans les systèmes de recommandation
 * et de priorisation.
 */

// Mappings des symptômes (français -> anglais normalisé)
export const SYMPTOM_ID_MAPPING: Record<string, string> = {
  // Français vers anglais
  'fatigue': 'fatigue',
  'énergie-basse': 'low-energy',
  'sommeil': 'sleep',
  'stress': 'stress',
  'digestion': 'digestion',
  'ballonnements': 'bloating',
  'articulations': 'joints',
  'peau': 'skin',
  'maux-tête': 'headache',
  'humeur': 'mood',
  'sensibilité-froid': 'cold',
  'concentration': 'concentration',
  'envies-sucre': 'cravings',
  'cheveux-ongles': 'hair',
  'immunité': 'immunity',
  
  // Anglais (déjà normalisé)
  'low-energy': 'low-energy',
  'sleep': 'sleep',
  'bloating': 'bloating',
  'joints': 'joints',
  'skin': 'skin',
  'headache': 'headache',
  'mood': 'mood',
  'cold': 'cold',
  'cravings': 'cravings',
  'hair': 'hair',
  'immunity': 'immunity',

  // Labels complets vers IDs
  'Fatigue': 'fatigue',
  'Low energy': 'low-energy',
  'Sleep issues': 'sleep',
  'Stress/Anxiety': 'stress',
  'Digestive problems': 'digestion',
  'Bloating': 'bloating',
  'Joint pain': 'joints',
  'Skin problems': 'skin',
  'Headaches': 'headache',
  'Mood swings': 'mood',
  'Cold sensitivity': 'cold',
  'Lack of concentration': 'concentration',
  'Food cravings': 'cravings',
  'Brittle hair/nails': 'hair',
  'Poor immunity': 'immunity',
  
  // Version française des labels
  'Fatigue chronique': 'fatigue',
  'Manque d\'énergie': 'low-energy',
  'Problèmes de sommeil': 'sleep',
  'Stress/Anxiété': 'stress',
  'Problèmes digestifs': 'digestion',
  'Ballonnements': 'bloating',
  'Douleurs articulaires': 'joints',
  'Problèmes de peau': 'skin',
  'Maux de tête': 'headache',
  'Sautes d\'humeur': 'mood',
  'Sensibilité au froid': 'cold',
  'Manque de concentration': 'concentration',
  'Envies de sucre': 'cravings',
  'Cheveux/ongles cassants': 'hair',
  'Faible immunité': 'immunity',
};

// Mappings des objectifs (français -> anglais normalisé)
export const GOAL_ID_MAPPING: Record<string, string> = {
  // Français vers anglais et labels complets vers IDs
  'energie': 'energy',
  'sommeil': 'sleep',
  'stress-fr': 'stress', 
  'digestion-fr': 'digestion',
  'poids': 'weight',
  'performance-fr': 'performance',
  'humeur': 'mood',
  'concentration': 'focus', 
  'hormones-fr': 'hormones',
  'immunite': 'immunity',
  'detox-fr': 'detox',
  'peau': 'skin',
  'anti-age': 'antiaging',
  'articulations': 'joints',
  'metabolisme': 'metabolism',

  // Labels complets vers IDs
  'More energy': 'energy',
  'Better sleep': 'sleep',
  'Stress reduction': 'stress',
  'Digestive health': 'digestion',
  'Weight management': 'weight',
  'Athletic performance': 'performance',
  'Mood improvement': 'mood',
  'Mental focus': 'focus',
  'Hormonal balance': 'hormones',
  'Immune support': 'immunity',
  'Detoxification': 'detox',
  'Skin health': 'skin',
  'Anti-aging': 'antiaging',
  'Joint health': 'joints',
  'Metabolic health': 'metabolism',
  
  // Version française des labels
  'Plus d\'énergie': 'energy',
  'Meilleur sommeil': 'sleep',
  'Réduction du stress': 'stress',
  'Santé digestive': 'digestion',
  'Gestion du poids': 'weight',
  'Performance physique': 'performance',
  'Amélioration de l\'humeur': 'mood',
  'Concentration mentale': 'focus',
  'Équilibre hormonal': 'hormones',
  'Soutien immunitaire': 'immunity',
  'Détoxification': 'detox',
  'Santé de la peau': 'skin',
  'Anti-âge': 'antiaging',
  'Santé des articulations': 'joints',
  'Santé métabolique': 'metabolism',
};

/**
 * Normalise l'identifiant d'un symptôme pour assurer la cohérence
 * @param symptomId - Identifiant ou label de symptôme à normaliser
 * @returns Identifiant normalisé en anglais
 */
export const normalizeSymptomId = (symptomId: string): string => {
  return SYMPTOM_ID_MAPPING[symptomId] || symptomId;
};

/**
 * Normalise l'identifiant d'un objectif pour assurer la cohérence
 * @param goalId - Identifiant ou label d'objectif à normaliser
 * @returns Identifiant normalisé en anglais
 */
export const normalizeGoalId = (goalId: string): string => {
  return GOAL_ID_MAPPING[goalId] || goalId;
};

/**
 * Normalise une liste d'identifiants de symptômes
 * @param symptomIds - Liste d'identifiants ou labels de symptômes à normaliser
 * @returns Liste d'identifiants normalisés en anglais
 */
export const normalizeSymptomIds = (symptomIds: string[]): string[] => {
  return symptomIds.map(normalizeSymptomId);
};

/**
 * Normalise une liste d'identifiants d'objectifs
 * @param goalIds - Liste d'identifiants ou labels d'objectifs à normaliser
 * @returns Liste d'identifiants normalisés en anglais
 */
export const normalizeGoalIds = (goalIds: string[]): string[] => {
  return goalIds.map(normalizeGoalId);
};

/**
 * Normalise tous les identifiants dans les données de quiz
 * @param quizData - Données du quiz contenant symptômes et objectifs
 * @returns Données du quiz avec identifiants normalisés
 */
export const normalizeQuizData = (quizData: any): any => {
  // Copie profonde pour éviter les références
  const normalizedQuizData = JSON.parse(JSON.stringify(quizData));
  
  // Garantir que les tableaux de base existent toujours
  normalizedQuizData.symptoms = normalizedQuizData.symptoms || [];
  normalizedQuizData.objectives = normalizedQuizData.objectives || [];
  
  // Synchronisation entre objectives et goals pour compatibilité
  normalizedQuizData.goals = normalizedQuizData.goals || normalizedQuizData.objectives;
  
  // Garantir des valeurs par défaut pour les champs essentiels
  normalizedQuizData.dietType = normalizedQuizData.dietType || "mixed";
  normalizedQuizData.activityLevel = normalizedQuizData.activityLevel || "moderate";
  normalizedQuizData.sleepQuality = normalizedQuizData.sleepQuality || "average";
  normalizedQuizData.stressLevel = normalizedQuizData.stressLevel || "moderate";
  
  // Garantir des données démographiques
  normalizedQuizData.age = normalizedQuizData.age || "30-45";
  normalizedQuizData.gender = normalizedQuizData.gender || "unknown";
  normalizedQuizData.medications = normalizedQuizData.medications || [];
  
  // Normalisation des symptômes principaux
  if (normalizedQuizData.symptoms) {
    normalizedQuizData.symptoms = normalizeSymptomIds(normalizedQuizData.symptoms);
  }
  
  // Normalisation des objectifs
  if (normalizedQuizData.objectives) {
    normalizedQuizData.objectives = normalizeGoalIds(normalizedQuizData.objectives);
    // Synchroniser aussi la propriété goals pour compatibilité
    normalizedQuizData.goals = [...normalizedQuizData.objectives];
  }
  
  // Transformation des questions spécifiques en données structurées utilisables
  if (normalizedQuizData.specificQuestions && normalizedQuizData.specificQuestions.length > 0) {
    // Créer un objet pour stocker les détails des symptômes
    normalizedQuizData.symptomDetails = normalizedQuizData.symptomDetails || {};
    
    // Pour chaque question spécifique, extraire les informations pertinentes
    normalizedQuizData.specificQuestions.forEach((question: any) => {
      // S'assurer que chaque question a une description non vide
      if (!question.question || question.question === "") {
        question.question = `Question ${question.id}`;
      }
      
      const questionId = question.id;
      
      // Extraire le type de question à partir de l'ID
      if (questionId.includes('frequency')) {
        const symptomId = questionId.replace('-frequency', '');
        const normalizedSymptomId = normalizeSymptomId(symptomId);
        
        // Ajouter la fréquence aux détails du symptôme
        normalizedQuizData.symptomDetails[normalizedSymptomId] = {
          ...(normalizedQuizData.symptomDetails[normalizedSymptomId] || {}),
          frequency: question.answer
        };
      } 
      else if (questionId.includes('duration')) {
        const symptomId = questionId.replace('-duration', '');
        const normalizedSymptomId = normalizeSymptomId(symptomId);
        
        // Ajouter la durée aux détails du symptôme
        normalizedQuizData.symptomDetails[normalizedSymptomId] = {
          ...(normalizedQuizData.symptomDetails[normalizedSymptomId] || {}),
          duration: question.answer
        };
      }
      else if (questionId.includes('severity') || questionId.includes('intensity')) {
        const symptomId = questionId.replace('-severity', '').replace('-intensity', '');
        const normalizedSymptomId = normalizeSymptomId(symptomId);
        
        // Ajouter la sévérité aux détails du symptôme
        normalizedQuizData.symptomDetails[normalizedSymptomId] = {
          ...(normalizedQuizData.symptomDetails[normalizedSymptomId] || {}),
          severity: question.answer
        };
      }
      else if (questionId.includes('impact')) {
        const symptomId = questionId.replace('-impact', '');
        const normalizedSymptomId = normalizeSymptomId(symptomId);
        
        // Ajouter l'impact aux détails du symptôme
        normalizedQuizData.symptomDetails[normalizedSymptomId] = {
          ...(normalizedQuizData.symptomDetails[normalizedSymptomId] || {}),
          impact: question.answer
        };
      }
      // Extraire et normaliser les informations de régime alimentaire
      else if (questionId.includes('diet') || questionId.includes('dietary')) {
        if (!normalizedQuizData.dietaryPatterns) {
          normalizedQuizData.dietaryPatterns = [];
        }
        
        // Mettre à jour le type de régime alimentaire
        if (questionId === 'dietary-habits') {
          normalizedQuizData.dietType = question.answer;
        } else {
          normalizedQuizData.dietaryPatterns.push(question.answer);
        }
      }
      // Extraire et normaliser les informations de mode de vie
      else if (questionId.includes('lifestyle') || 
               questionId === 'activity-level' || 
               questionId === 'stress-level' || 
               questionId === 'sleep-quality') {
        
        // Mise à jour directe des champs principaux de mode de vie
        if (questionId === 'activity-level') {
          normalizedQuizData.activityLevel = question.answer;
        }
        else if (questionId === 'stress-level') {
          normalizedQuizData.stressLevel = question.answer;
        }
        else if (questionId === 'sleep-quality') {
          normalizedQuizData.sleepQuality = question.answer;
        }
        
        // Maintenir aussi la structure lifestyleFactors pour compatibilité
        normalizedQuizData.lifestyleFactors = normalizedQuizData.lifestyleFactors || {};
        
        if (questionId.includes('activity')) {
          normalizedQuizData.lifestyleFactors.activityLevel = question.answer;
        }
        else if (questionId.includes('stress')) {
          normalizedQuizData.lifestyleFactors.stressLevel = question.answer;
        }
        else if (questionId.includes('sleep')) {
          normalizedQuizData.lifestyleFactors.sleepQuality = question.answer;
        }
      }
    });
  }
  
  // S'assurer que des données sont disponibles même sans questions spécifiques
  normalizedQuizData.symptomDetails = normalizedQuizData.symptomDetails || {};
  normalizedQuizData.dietaryPatterns = normalizedQuizData.dietaryPatterns || [];
  normalizedQuizData.lifestyleFactors = normalizedQuizData.lifestyleFactors || {
    activityLevel: normalizedQuizData.activityLevel,
    stressLevel: normalizedQuizData.stressLevel,
    sleepQuality: normalizedQuizData.sleepQuality
  };
  
  // Ajout de la date du quiz
  normalizedQuizData.quizDate = new Date().toISOString();
  
  // Création d'un ID utilisateur temporaire pour le suivi
  normalizedQuizData.userId = normalizedQuizData.userId || 
    'temp-' + Math.random().toString(36).substring(2, 15);
  
  console.log("Données normalisées du quiz:", normalizedQuizData);
  
  return normalizedQuizData;
};