/**
 * Moteur neuroscientifique avancé pour le quiz nutritionnel
 * Analyse les patterns utilisateur et les données du quiz pour personnaliser les recommandations
 * Version améliorée avec système de priorisation intelligent et analyse multifactorielle
 */

// Types et interfaces
import { QuizResponse, Recommendation, UserProfile, SymptomPriority } from '@/utils/types';
import { SUPPLEMENT_CATALOG } from '@/data/supplementCatalog';
import { SYMPTOM_RECOMMENDATIONS, GOAL_RECOMMENDATIONS } from '@/data/recommendationMappings';

// Constantes pour la priorisation des symptômes
const SYMPTOM_PRIORITY_WEIGHTS: Record<string, number> = {
  // Problèmes à impact systémique élevé (priorité maximale)
  'stress': 0.95,              // Impact multisystémique majeur sur l'axe HPA
  'fatigue': 0.90,             // Indicateur de dysfonctionnements métaboliques multiples
  'problèmes de sommeil': 0.92, // Impact fondamental sur la récupération et l'homéostasie
  'système immunitaire faible': 0.88, // Vulnérabilité systémique

  // Problèmes neurologiques et cognitifs (priorité élevée)
  'anxiété': 0.85,             // Impact sur le système nerveux et hormonal
  'baisse de concentration': 0.82, // Fonction cognitive altérée
  'brouillard mental': 0.80,   // Fonction cognitive altérée
  'maux de tête': 0.78,        // Symptôme neurologique

  // Problèmes inflammatoires (priorité moyenne à élevée)
  'inflammation': 0.84,        // Facteur sous-jacent de nombreuses conditions
  'douleurs articulaires': 0.75, // Mobilité et qualité de vie
  'douleurs musculaires': 0.72, // Mobilité et qualité de vie

  // Problèmes digestifs et métaboliques (priorité moyenne)
  'problèmes digestifs': 0.83, // Centre de l'absorption des nutriments
  'ballonnements': 0.70,       // Inconfort digestif
  'transit irrégulier': 0.72,  // Fonction digestive
  'reflux acide': 0.68,        // Inconfort digestif

  // Problèmes métaboliques (priorité moyenne)
  'déséquilibres glycémiques': 0.80, // Impact métabolique
  'déficit énergétique': 0.76, // Fonction cellulaire

  // Problèmes cutanés et autres (priorité plus basse)
  'problèmes de peau': 0.65,   // Manifestation externe
  'sensibilité au froid': 0.60, // Confort thermique
  'allergies': 0.67,           // Réaction immunitaire spécifique
  
  // Problèmes hormonaux (priorité variable selon le type)
  'déséquilibres hormonaux': 0.82, // Impact systémique
  'problèmes menstruels': 0.75, // Qualité de vie et équilibre hormonal
};

// Constantes pour la priorisation des objectifs
const GOAL_PRIORITY_WEIGHTS: Record<string, number> = {
  'gestion du stress': 0.95,      // Fondamental pour l'équilibre global
  'amélioration du sommeil': 0.92, // Base de la récupération
  'renforcement immunitaire': 0.88, // Protection de l'organisme
  'équilibre hormonal': 0.85,     // Régulation systémique
  'énergie optimale': 0.83,       // Vitalité quotidienne
  'clarté mentale': 0.80,         // Performance cognitive
  'digestion optimale': 0.78,     // Absorption des nutriments
  'réduction de l'inflammation': 0.82, // Prévention des maladies
  'santé cardiovasculaire': 0.79, // Fonction vitale
  'équilibre glycémique': 0.77,   // Métabolisme énergétique
  'santé articulaire': 0.72,      // Mobilité et confort
  'détoxification': 0.70,         // Élimination des toxines
  'santé de la peau': 0.65,       // Apparence et protection
  'gestion du poids': 0.75,       // Métabolisme et image corporelle
};

/**
 * Calcule le niveau de stress cognitif basé sur les patterns de navigation
 * et les réponses au quiz
 */
export const calculateCortisolLevel = (
  userBehaviorData: {
    scrollSpeed?: number;
    timeSpent?: number;
    clickPatterns?: number[];
  },
  quizResponses?: QuizResponse
): number => {
  // Valeurs par défaut si les données ne sont pas disponibles
  const { 
    scrollSpeed = 2, 
    timeSpent = 90,
    clickPatterns = [0.5, 0.7, 0.9]
  } = userBehaviorData;
  
  // Algorithme neuroscientifique basé sur les patterns comportementaux
  const baseLevel = 50; // Niveau de base
  const scrollFactor = scrollSpeed > 2 ? scrollSpeed * 5 : scrollSpeed * 2;
  const timeFactor = Math.min(timeSpent / 30, 5) * 6;
  const clickIntensity = clickPatterns.reduce((sum, val) => sum + val, 0) / clickPatterns.length;
  
  // Calcul avec pondération
  let cortisolLevel = baseLevel + scrollFactor + timeFactor + (clickIntensity * 15);
  
  // Ajustement basé sur les réponses au quiz si disponibles
  if (quizResponses) {
    // Facteurs de stress auto-rapportés
    if (quizResponses.symptoms?.includes('stress')) {
      cortisolLevel += 15;
    }
    
    if (quizResponses.symptoms?.includes('anxiété')) {
      cortisolLevel += 10;
    }
    
    // Facteurs de mode de vie
    if (quizResponses.lifestyle?.includes('high_stress')) {
      cortisolLevel += 12;
    }
    
    if (quizResponses.lifestyle?.includes('poor_sleep')) {
      cortisolLevel += 8;
    }
    
    // Facteurs alimentaires
    if (quizResponses.dietaryHabits?.includes('high_sugar') || 
        quizResponses.dietaryHabits?.includes('processed')) {
      cortisolLevel += 7;
    }
  }
  
  // Normalisation entre 20 et 90
  cortisolLevel = Math.min(Math.max(cortisolLevel, 20), 90);
  
  return Math.round(cortisolLevel);
};

/**
 * Mesure l'attention portée à des termes spécifiques
 * et l'intérêt pour certains domaines de santé
 */
export const measureAttention = (
  keyTerms: string[],
  userInteractions: {
    hoverTime?: Record<string, number>;
    dwellTime?: number;
    rereadCount?: number;
  },
  quizResponses?: QuizResponse
): number => {
  // Valeurs par défaut
  const { 
    hoverTime = {}, 
    dwellTime = 120,
    rereadCount = 1
  } = userInteractions;
  
  // Calcul d'un score d'attention
  let attentionScore = 50; // Score de base
  
  // Analyser le temps passé sur les termes clés
  const termAttention = keyTerms.reduce((score, term) => {
    const timeOnTerm = hoverTime[term] || 2;
    return score + (timeOnTerm * 2);
  }, 0);
  
  // Considérer le temps total passé sur le questionnaire
  const dwellFactor = Math.min(dwellTime / 60, 3) * 10;
  
  // Impact de la relecture (indique un intérêt)
  const rereadFactor = rereadCount * 5;
  
  // Compilation du score initial
  attentionScore += termAttention + dwellFactor + rereadFactor;
  
  // Ajustement basé sur les réponses au quiz si disponibles
  if (quizResponses) {
    // Nombre d'objectifs sélectionnés (indique l'engagement)
    const objectivesCount = quizResponses.objectives?.length || 0;
    attentionScore += objectivesCount * 3;
    
    // Nombre de symptômes rapportés (indique la conscience de soi)
    const symptomsCount = quizResponses.symptoms?.length || 0;
    attentionScore += symptomsCount * 2;
    
    // Détail des réponses textuelles (si disponibles)
    if (quizResponses.additionalInfo && typeof quizResponses.additionalInfo === 'string') {
      const wordCount = quizResponses.additionalInfo.split(' ').length;
      attentionScore += Math.min(wordCount / 5, 10);
    }
  }
  
  // Normalisation entre 30 et 95
  attentionScore = Math.min(Math.max(attentionScore, 30), 95);
  
  return Math.round(attentionScore);
};

/**
 * Analyse le profil neuropsychologique complet de l'utilisateur
 * en combinant les données comportementales et les réponses au quiz
 */
export const generateNeuroProfile = (
  quizResponses: QuizResponse,
  userBehavior = {
    scrollSpeed: 2,
    timeSpent: 120,
    clickPatterns: [0.5, 0.7, 0.9],
    hoverTime: {},
    rereadCount: 1
  }
): UserProfile => {
  // Déterminer les termes clés basés sur les réponses
  const keyTerms = ['magnésium', 'vitamine', 'sommeil', 'stress', 'énergie', 'inflammation', 'digestion'];
  
  // Calculer les scores neuropsychologiques
  const stressLevel = calculateCortisolLevel(userBehavior, quizResponses);
  const attentionScore = measureAttention(keyTerms, userBehavior, quizResponses);
  
  // Déterminer les domaines d'intérêt/focus basés sur les objectifs
  const focusAreas = (quizResponses.objectives || []).slice(0, 3);
  
  // Déterminer la force cognitive principale
  const cognitiveStrengths = [
    'Analyse détaillée', 
    'Vision globale', 
    'Réflexion intuitive',
    'Pensée structurée',
    'Adaptabilité cognitive'
  ];
  
  // Déterminer le style d'apprentissage
  const learningStyles = [
    'Visuel', 
    'Auditif', 
    'Kinesthésique',
    'Logique-mathématique',
    'Verbal-linguistique'
  ];
  
  // Analyse des symptômes et leur priorisation
  const symptomPriorities = analyzeAndPrioritizeSymptoms(quizResponses);
  
  // Analyse des objectifs et leur priorisation
  const goalPriorities = analyzeAndPrioritizeGoals(quizResponses);
  
  // Analyse des facteurs de mode de vie
  const lifestyleFactors = analyzeLifestyleFactors(quizResponses);
  
  // Analyse des habitudes alimentaires
  const dietaryPatterns = analyzeDietaryPatterns(quizResponses);
  
  // Déterminer les besoins nutritionnels spécifiques
  const nutritionalNeeds = determineNutritionalNeeds(quizResponses, symptomPriorities);
  
  // Déterminer les déficiences potentielles
  const potentialDeficiencies = identifyPotentialDeficiencies(quizResponses, symptomPriorities, dietaryPatterns);
  
  // Créer le profil complet
  return {
    stressLevel,
    attentionScore,
    focusAreas: focusAreas.length > 0 ? focusAreas : ['Bien-être général'],
    cognitiveStrength: determineCognitiveStrength(quizResponses, stressLevel, attentionScore),
    learningStyle: determineLearningStyle(quizResponses, userBehavior),
    symptomPriorities,
    goalPriorities,
    lifestyleFactors,
    dietaryPatterns,
    nutritionalNeeds,
    potentialDeficiencies,
    metabolicType: determineMetabolicType(quizResponses, dietaryPatterns),
    stressResponse: determineStressResponsePattern(stressLevel, quizResponses),
    inflammatoryStatus: assessInflammatoryStatus(quizResponses, dietaryPatterns),
    circadianHealth: assessCircadianHealth(quizResponses, lifestyleFactors),
    gutMicrobiomeStatus: assessGutHealth(quizResponses, dietaryPatterns)
  };
};

/**
 * Analyse et priorise les symptômes rapportés par l'utilisateur
 */
export const analyzeAndPrioritizeSymptoms = (quizResponses: QuizResponse): SymptomPriority[] => {
  const symptoms = quizResponses.symptoms || [];
  if (symptoms.length === 0) return [];
  
  // Créer un tableau de symptômes avec leurs scores de priorité
  const symptomPriorities: SymptomPriority[] = symptoms.map(symptom => {
    // Obtenir le poids de priorité du symptôme ou utiliser une valeur par défaut
    const priorityWeight = SYMPTOM_PRIORITY_WEIGHTS[symptom] || 0.5;
    
    // Ajuster la priorité en fonction de la sévérité rapportée (si disponible)
    let adjustedPriority = priorityWeight;
    
    // Si nous avons des informations sur la sévérité des symptômes
    if (quizResponses.symptomSeverity && quizResponses.symptomSeverity[symptom]) {
      const severity = quizResponses.symptomSeverity[symptom];
      // Convertir la sévérité en multiplicateur (1-10 → 0.5-1.5)
      const severityMultiplier = 0.5 + (severity / 10);
      adjustedPriority *= severityMultiplier;
    }
    
    // Ajuster en fonction de la durée du symptôme (si disponible)
    if (quizResponses.symptomDuration && quizResponses.symptomDuration[symptom]) {
      const duration = quizResponses.symptomDuration[symptom];
      // Les symptômes chroniques ont une priorité plus élevée
      if (duration === 'chronic' || duration > 6) {
        adjustedPriority *= 1.2;
      }
    }
    
    // Ajuster en fonction de l'impact sur la qualité de vie (si disponible)
    if (quizResponses.symptomImpact && quizResponses.symptomImpact[symptom]) {
      const impact = quizResponses.symptomImpact[symptom];
      // Impact élevé augmente la priorité
      if (impact === 'high' || impact > 7) {
        adjustedPriority *= 1.3;
      }
    }
    
    return {
      name: symptom,
      priority: Math.min(adjustedPriority, 1), // Plafonner à 1
      relatedSymptoms: findRelatedSymptoms(symptom, symptoms),
      potentialCauses: identifyPotentialCauses(symptom, quizResponses),
      recommendedSupplements: getRecommendedSupplementsForSymptom(symptom)
    };
  });
  
  // Trier par priorité décroissante
  return symptomPriorities.sort((a, b) => b.priority - a.priority);
};

/**
 * Analyse et priorise les objectifs de santé de l'utilisateur
 */
export const analyzeAndPrioritizeGoals = (quizResponses: QuizResponse): any[] => {
  const goals = quizResponses.objectives || [];
  if (goals.length === 0) return [];
  
  // Créer un tableau d'objectifs avec leurs scores de priorité
  const goalPriorities = goals.map(goal => {
    // Obtenir le poids de priorité de l'objectif ou utiliser une valeur par défaut
    const priorityWeight = GOAL_PRIORITY_WEIGHTS[goal] || 0.5;
    
    // Ajuster la priorité en fonction de l'importance rapportée (si disponible)
    let adjustedPriority = priorityWeight;
    
    // Si nous avons des informations sur l'importance des objectifs
    if (quizResponses.goalImportance && quizResponses.goalImportance[goal]) {
      const importance = quizResponses.goalImportance[goal];
      // Convertir l'importance en multiplicateur (1-10 → 0.8-1.2)
      const importanceMultiplier = 0.8 + (importance / 25);
      adjustedPriority *= importanceMultiplier;
    }
    
    // Ajuster en fonction de l'urgence de l'objectif (si disponible)
    if (quizResponses.goalUrgency && quizResponses.goalUrgency[goal]) {
      const urgency = quizResponses.goalUrgency[goal];
      // Objectifs urgents ont une priorité plus élevée
      if (urgency === 'high' || urgency > 7) {
        adjustedPriority *= 1.15;
      }
    }
    
    return {
      name: goal,
      priority: Math.min(adjustedPriority, 1), // Plafonner à 1
      relatedGoals: findRelatedGoals(goal, goals),
      recommendedSupplements: getRecommendedSupplementsForGoal(goal),
      timeFrame: estimateTimeFrame(goal, quizResponses)
    };
  });
  
  // Trier par priorité décroissante
  return goalPriorities.sort((a, b) => b.priority - a.priority);
};

/**
 * Analyse les facteurs de mode de vie de l'utilisateur
 */
export const analyzeLifestyleFactors = (quizResponses: QuizResponse): any => {
  const lifestyle = {
    activityLevel: determineActivityLevel(quizResponses),
    stressLevel: determineStressLevel(quizResponses),
    sleepQuality: determineSleepQuality(quizResponses),
    workEnvironment: determineWorkEnvironment(quizResponses),
    screenTime: determineScreenTime(quizResponses),
    outdoorTime: determineOutdoorTime(quizResponses),
    socialConnections: determineSocialConnections(quizResponses)
  };
  
  return lifestyle;
};

/**
 * Analyse les habitudes alimentaires de l'utilisateur
 */
export const analyzeDietaryPatterns = (quizResponses: QuizResponse): any => {
  const dietary = {
    dietType: determineDietType(quizResponses),
    mealFrequency: determineMealFrequency(quizResponses),
    waterIntake: determineWaterIntake(quizResponses),
    sugarConsumption: determineSugarConsumption(quizResponses),
    processedFoodIntake: determineProcessedFoodIntake(quizResponses),
    fruitVegetableIntake: determineFruitVegetableIntake(quizResponses),
    proteinSources: determineProteinSources(quizResponses),
    fatSources: determineFatSources(quizResponses)
  };
  
  return dietary;
};

/**
 * Détermine les besoins nutritionnels spécifiques basés sur le profil
 */
export const determineNutritionalNeeds = (quizResponses: QuizResponse, symptomPriorities: SymptomPriority[]): any[] => {
  const nutritionalNeeds = [];
  
  // Analyse basée sur les symptômes prioritaires
  for (const symptom of symptomPriorities.slice(0, 3)) { // Top 3 symptômes
    switch (symptom.name) {
      case 'stress':
      case 'anxiété':
        nutritionalNeeds.push({
          nutrient: 'Magnésium',
          importance: 'élevée',
          reason: 'Soutient le système nerveux et aide à réduire le stress'
        });
        nutritionalNe
(Content truncated due to size limit. Use line ranges to read in chunks)