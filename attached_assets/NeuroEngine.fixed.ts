/**
 * Système neurologique pour l'analyse des profils utilisateurs
 * et la génération de recommandations personnalisées
 */

import { UserProfile, SymptomPriority, QuizResponse } from './types';

// Facteurs neurocognitifs associés aux préoccupations de santé
const NEUROCOGNITIVE_FACTORS = {
  'stress': 0.89,              // Facteur principal
  'anxiété': 0.85,             // Tension nerveuse
  'sommeil': 0.88,             // Récupération cognitive
  'fatigue': 0.87,             // Épuisement systémique
  'concentration': 0.82,       // Performance cognitive
  'humeur': 0.80,              // Équilibre émotionnel
  'inflammation': 0.84,        // Facteur sous-jacent de nombreuses conditions
  'digestion': 0.86,           // Axe intestin-cerveau
  'hormones': 0.83,            // Équilibre biochimique
  'mémoire': 0.79,             // Fonction cognitive
  'détoxification': 0.81,      // Élimination des substances nocives
  'métabolisme': 0.82,         // Conversion énergétique
  'immunité': 0.85             // Défense de l'organisme
};

// Facteurs de santé holistique liés aux objectifs
const HOLISTIC_HEALTH_FACTORS = {
  'renforcement immunitaire': 0.88, // Protection de l'organisme
  'équilibre hormonal': 0.85,     // Régulation systémique
  'énergie optimale': 0.83,       // Vitalité quotidienne
  'clarté mentale': 0.80,         // Performance cognitive
  'digestion optimale': 0.78,     // Absorption des nutriments
  'réduction de inflammation': 0.82, // Prévention des maladies
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
  
  // Construire un profil utilisateur basique pour la démonstration
  return {
    age: 35,
    gender: 'female',
    weight: 65,
    height: 165,
    activityLevel: 'moderate',
    dietType: 'omnivore',
    sleepQuality: 'moderate',
    stressLevel: 'high',
    existingConditions: [],
    medications: [],
    supplements: [],
    allergies: [],
    symptoms: quizResponses.symptoms || {},
    goals: quizResponses.objectives || {},
    lifestyleFactors: [],
    preferences: {
      supplementTypes: [],
      naturalOnly: true,
      budgetConstraint: 'moderate',
      tastePreferences: []
    }
  };
};

/**
 * Analyse et priorise les symptômes rapportés par l'utilisateur
 */
export const analyzeAndPrioritizeSymptoms = (quizResponses: QuizResponse): SymptomPriority[] => {
  // Version simple pour la démonstration
  const symptoms = quizResponses.symptoms || {};
  
  const result: SymptomPriority[] = [];
  
  Object.entries(symptoms).forEach(([symptom, severity]) => {
    result.push({
      id: symptom,
      name: symptom,
      description: `Description de ${symptom}`,
      priorityWeight: 0.8,
      relatedSymptoms: [],
      potentialCauses: [],
      recommendedTests: [],
      targetSupplements: [],
      lifestyleRecommendations: []
    });
  });
  
  return result;
};

/**
 * Analyse et priorise les objectifs de santé de l'utilisateur
 */
export const analyzeAndPrioritizeGoals = (quizResponses: QuizResponse): any[] => {
  // Version simple pour la démonstration
  const goals = quizResponses.objectives || {};
  
  return Object.entries(goals).map(([goal, importance]) => {
    return {
      name: goal,
      priority: 0.8,
      timeFrame: "4-8 semaines",
      recommendedSupplements: []
    };
  });
};

/**
 * Analyse les facteurs de mode de vie de l'utilisateur
 */
export const analyzeLifestyleFactors = (quizResponses: QuizResponse): any => {
  return {
    activityLevel: "moderate",
    stressLevel: "moderate",
    sleepQuality: "moderate",
    nutritionalBalance: "moderate"
  };
};

/**
 * Analyse les habitudes alimentaires de l'utilisateur
 */
export const analyzeDietaryPatterns = (quizResponses: QuizResponse): any => {
  return {
    dietType: quizResponses.dietType || "omnivore",
    nutritionalGaps: ["vitamin D", "magnesium", "omega-3"],
    problematicFoods: [],
    beneficialFoods: []
  };
};

/**
 * Détermine les besoins nutritionnels spécifiques basés sur les symptômes
 */
export const determineNutritionalNeeds = (quizResponses: QuizResponse, symptomPriorities: SymptomPriority[]): any[] => {
  return [
    {
      nutrient: "magnesium",
      importance: 0.9,
      reason: "Soutient le système nerveux et aide à réduire le stress"
    },
    {
      nutrient: "omega-3",
      importance: 0.85,
      reason: "Réduit l'inflammation et soutient la santé cognitive"
    },
    {
      nutrient: "vitamine D",
      importance: 0.8,
      reason: "Essentielle pour l'immunité et la santé osseuse"
    }
  ];
};

// Fonctions utilitaires (version simplifiée pour la démonstration)
function identifyPotentialDeficiencies(quizResponses: QuizResponse, symptomPriorities: any[], dietaryPatterns: any): string[] {
  return ["magnesium", "vitamin D", "omega-3"];
}

function determineCognitiveStrength(quizResponses: QuizResponse, stressLevel: number, attentionScore: number): string {
  return "Analyse détaillée";
}

function determineLearningStyle(quizResponses: QuizResponse, userBehavior: any): string {
  return "Visuel";
}

function determineMetabolicType(quizResponses: QuizResponse, dietaryPatterns: any): string {
  return "Mixte";
}

function determineStressResponsePattern(stressLevel: number, quizResponses: QuizResponse): string {
  return stressLevel > 70 ? "Hypersensibilité" : "Résilient";
}

function assessInflammatoryStatus(quizResponses: QuizResponse, dietaryPatterns: any): string {
  return "Modéré";
}

function assessCircadianHealth(quizResponses: QuizResponse, lifestyleFactors: any): string {
  return "Désynchronisé";
}

function assessGutHealth(quizResponses: QuizResponse, dietaryPatterns: any): string {
  return "Équilibré";
}