/**
 * Système de priorisation pour les symptômes et objectifs
 * Implémente une logique avancée pour déterminer l'ordre de traitement des problèmes de santé
 */

import { SymptomInfo, GoalInfo, UserProfile } from '@/utils/types';

// Définition des poids de priorité pour les symptômes courants
export const SYMPTOM_PRIORITY_WEIGHTS: Record<string, number> = {
  // Problèmes de santé mentale et stress - Priorité très élevée
  "stress": 0.95,
  "anxiety": 0.93,
  "depression": 0.92,
  
  // Problèmes de sommeil - Priorité élevée
  "insomnia": 0.92,
  "poor_sleep_quality": 0.90,
  "sleep_apnea": 0.89,
  
  // Problèmes digestifs - Priorité moyenne à élevée
  "ibs": 0.85,
  "acid_reflux": 0.82,
  "bloating": 0.80,
  "constipation": 0.78,
  "diarrhea": 0.78,
  
  // Problèmes inflammatoires - Priorité moyenne à élevée
  "chronic_inflammation": 0.88,
  "joint_pain": 0.84,
  "arthritis": 0.83,
  
  // Problèmes énergétiques - Priorité moyenne
  "fatigue": 0.82,
  "low_energy": 0.80,
  "chronic_fatigue": 0.85,
  
  // Problèmes hormonaux - Priorité moyenne
  "hormonal_imbalance": 0.80,
  "thyroid_issues": 0.82,
  "pms": 0.75,
  
  // Problèmes immunitaires - Priorité moyenne
  "frequent_infections": 0.78,
  "weak_immune_system": 0.77,
  "allergies": 0.72,
  
  // Problèmes métaboliques - Priorité moyenne
  "insulin_resistance": 0.76,
  "high_blood_sugar": 0.75,
  "metabolic_syndrome": 0.78,
  
  // Problèmes cardiovasculaires - Priorité moyenne
  "high_blood_pressure": 0.79,
  "high_cholesterol": 0.77,
  "poor_circulation": 0.75,
  
  // Problèmes cognitifs - Priorité moyenne
  "brain_fog": 0.76,
  "poor_concentration": 0.75,
  "memory_issues": 0.74,
  
  // Problèmes de peau - Priorité basse à moyenne
  "acne": 0.65,
  "eczema": 0.68,
  "psoriasis": 0.70,
  
  // Problèmes de poids - Priorité basse à moyenne
  "overweight": 0.65,
  "obesity": 0.70,
  "underweight": 0.68
};

// Définition des poids de priorité pour les objectifs courants
export const GOAL_PRIORITY_WEIGHTS: Record<string, number> = {
  // Objectifs de santé mentale - Priorité très élevée
  "stress_management": 0.95,
  "anxiety_reduction": 0.93,
  "mood_improvement": 0.90,
  
  // Objectifs de sommeil - Priorité élevée
  "sleep_improvement": 0.92,
  "sleep_quality": 0.90,
  
  // Objectifs énergétiques - Priorité moyenne à élevée
  "energy_boost": 0.85,
  "fatigue_reduction": 0.83,
  
  // Objectifs immunitaires - Priorité moyenne à élevée
  "immune_support": 0.82,
  "illness_prevention": 0.80,
  
  // Objectifs digestifs - Priorité moyenne
  "digestive_health": 0.80,
  "gut_healing": 0.82,
  
  // Objectifs hormonaux - Priorité moyenne
  "hormonal_balance": 0.78,
  "fertility_support": 0.75,
  
  // Objectifs cognitifs - Priorité moyenne
  "cognitive_enhancement": 0.77,
  "focus_improvement": 0.76,
  "memory_enhancement": 0.75,
  
  // Objectifs inflammatoires - Priorité moyenne
  "inflammation_reduction": 0.80,
  "pain_management": 0.78,
  
  // Objectifs cardiovasculaires - Priorité moyenne
  "heart_health": 0.76,
  "blood_pressure_management": 0.75,
  "cholesterol_management": 0.74,
  
  // Objectifs métaboliques - Priorité moyenne
  "blood_sugar_balance": 0.75,
  "metabolic_health": 0.74,
  
  // Objectifs de poids - Priorité basse à moyenne
  "weight_management": 0.65,
  "weight_loss": 0.63,
  "muscle_gain": 0.60,
  
  // Objectifs esthétiques - Priorité basse
  "skin_health": 0.60,
  "hair_health": 0.55,
  "nail_strength": 0.50
};

// Relations entre symptômes (symptômes qui sont souvent liés ou qui partagent des causes communes)
export const SYMPTOM_RELATIONSHIPS: Record<string, string[]> = {
  "stress": ["anxiety", "insomnia", "fatigue", "digestive_issues", "high_blood_pressure"],
  "anxiety": ["stress", "insomnia", "panic_attacks", "digestive_issues"],
  "insomnia": ["stress", "anxiety", "fatigue", "brain_fog"],
  "fatigue": ["insomnia", "stress", "depression", "thyroid_issues", "anemia", "low_vitamin_d"],
  "digestive_issues": ["stress", "anxiety", "food_sensitivities", "dysbiosis"],
  "joint_pain": ["inflammation", "arthritis", "autoimmune_conditions"],
  "brain_fog": ["fatigue", "insomnia", "thyroid_issues", "nutritional_deficiencies"],
  "hormonal_imbalance": ["pms", "irregular_periods", "mood_swings", "fatigue", "weight_gain"],
  "weak_immune_system": ["frequent_infections", "slow_healing", "chronic_fatigue"]
};

// Causes potentielles des symptômes courants
export const SYMPTOM_CAUSES: Record<string, string[]> = {
  "stress": ["high_cortisol", "magnesium_deficiency", "b_vitamin_deficiency", "poor_sleep", "overwork"],
  "anxiety": ["neurotransmitter_imbalance", "magnesium_deficiency", "inflammation", "blood_sugar_imbalance"],
  "insomnia": ["high_cortisol", "melatonin_disruption", "magnesium_deficiency", "caffeine_sensitivity"],
  "fatigue": ["iron_deficiency", "vitamin_b12_deficiency", "thyroid_dysfunction", "adrenal_fatigue", "poor_sleep"],
  "digestive_issues": ["dysbiosis", "food_sensitivities", "low_stomach_acid", "enzyme_deficiency", "stress"],
  "joint_pain": ["inflammation", "vitamin_d_deficiency", "omega3_deficiency", "autoimmunity"],
  "brain_fog": ["inflammation", "blood_sugar_imbalance", "nutritional_deficiencies", "sleep_deprivation"],
  "hormonal_imbalance": ["stress", "nutritional_deficiencies", "environmental_toxins", "insulin_resistance"],
  "weak_immune_system": ["vitamin_d_deficiency", "zinc_deficiency", "chronic_stress", "poor_gut_health"]
};

/**
 * Détermine la priorité d'un symptôme en fonction de sa sévérité et de son poids de priorité prédéfini
 * @param symptomId Identifiant du symptôme
 * @param severity Sévérité du symptôme (1-10)
 * @returns Score de priorité normalisé
 */
export function calculateSymptomPriority(symptomId: string, severity: number): number {
  const priorityWeight = SYMPTOM_PRIORITY_WEIGHTS[symptomId] || 0.7; // Valeur par défaut si non défini
  const normalizedSeverity = severity / 10; // Normalisation de la sévérité entre 0 et 1
  
  // Formule de priorité qui donne plus de poids aux symptômes prioritaires et sévères
  return (priorityWeight * 0.7 + normalizedSeverity * 0.3) * 100;
}

/**
 * Détermine la priorité d'un objectif en fonction de son importance et de son poids de priorité prédéfini
 * @param goalId Identifiant de l'objectif
 * @param importance Importance de l'objectif pour l'utilisateur (1-10)
 * @returns Score de priorité normalisé
 */
export function calculateGoalPriority(goalId: string, importance: number): number {
  const priorityWeight = GOAL_PRIORITY_WEIGHTS[goalId] || 0.7; // Valeur par défaut si non défini
  const normalizedImportance = importance / 10; // Normalisation de l'importance entre 0 et 1
  
  // Formule de priorité qui donne plus de poids aux objectifs prioritaires et importants
  return (priorityWeight * 0.6 + normalizedImportance * 0.4) * 100;
}

/**
 * Analyse les symptômes de l'utilisateur et identifie les relations et causes potentielles
 * @param userSymptoms Symptômes de l'utilisateur avec leur sévérité
 * @returns Analyse des symptômes avec relations et causes potentielles
 */
export function analyzeSymptomRelationships(userSymptoms: Record<string, number>): Record<string, any> {
  const analysis: Record<string, any> = {};
  
  // Pour chaque symptôme de l'utilisateur
  Object.entries(userSymptoms).forEach(([symptomId, severity]) => {
    if (severity >= 4) { // Ne considérer que les symptômes d'une certaine sévérité
      analysis[symptomId] = {
        severity,
        priority: calculateSymptomPriority(symptomId, severity),
        relatedSymptoms: SYMPTOM_RELATIONSHIPS[symptomId] || [],
        potentialCauses: SYMPTOM_CAUSES[symptomId] || []
      };
    }
  });
  
  return analysis;
}

/**
 * Détermine l'ordre de priorité des symptômes à traiter
 * @param userSymptoms Symptômes de l'utilisateur avec leur sévérité
 * @returns Liste des symptômes ordonnés par priorité
 */
export function prioritizeSymptoms(userSymptoms: Record<string, number>): string[] {
  const symptomPriorities: [string, number][] = Object.entries(userSymptoms)
    .map(([symptomId, severity]) => [
      symptomId,
      calculateSymptomPriority(symptomId, severity)
    ]);
  
  // Tri par priorité décroissante
  return symptomPriorities
    .sort((a, b) => b[1] - a[1])
    .map(item => item[0]);
}

/**
 * Détermine l'ordre de priorité des objectifs à atteindre
 * @param userGoals Objectifs de l'utilisateur avec leur importance
 * @returns Liste des objectifs ordonnés par priorité
 */
export function prioritizeGoals(userGoals: Record<string, number>): string[] {
  const goalPriorities: [string, number][] = Object.entries(userGoals)
    .map(([goalId, importance]) => [
      goalId,
      calculateGoalPriority(goalId, importance)
    ]);
  
  // Tri par priorité décroissante
  return goalPriorities
    .sort((a, b) => b[1] - a[1])
    .map(item => item[0]);
}

/**
 * Analyse complète du profil utilisateur pour déterminer les priorités de traitement
 * @param userProfile Profil complet de l'utilisateur
 * @returns Analyse des priorités avec symptômes et objectifs ordonnés
 */
export function analyzeTreatmentPriorities(userProfile: UserProfile): {
  prioritizedSymptoms: string[];
  prioritizedGoals: string[];
  symptomAnalysis: Record<string, any>;
  goalAnalysis: Record<string, any>;
} {
  // Analyse des symptômes et leurs relations
  const symptomAnalysis = analyzeSymptomRelationships(userProfile.symptoms);
  
  // Priorisation des symptômes
  const prioritizedSymptoms = prioritizeSymptoms(userProfile.symptoms);
  
  // Analyse des objectifs
  const goalAnalysis: Record<string, any> = {};
  Object.entries(userProfile.goals).forEach(([goalId, importance]) => {
    if (importance >= 4) { // Ne considérer que les objectifs d'une certaine importance
      goalAnalysis[goalId] = {
        importance,
        priority: calculateGoalPriority(goalId, importance),
        timeFrame: getGoalTimeFrame(goalId),
        recommendedApproach: getRecommendedApproach(goalId, userProfile)
      };
    }
  });
  
  // Priorisation des objectifs
  const prioritizedGoals = prioritizeGoals(userProfile.goals);
  
  return {
    prioritizedSymptoms,
    prioritizedGoals,
    symptomAnalysis,
    goalAnalysis
  };
}

/**
 * Détermine le délai typique pour atteindre un objectif spécifique
 * @param goalId Identifiant de l'objectif
 * @returns Délai estimé pour atteindre l'objectif
 */
function getGoalTimeFrame(goalId: string): string {
  const timeFrames: Record<string, string> = {
    "stress_management": "4-8 semaines",
    "anxiety_reduction": "6-12 semaines",
    "sleep_improvement": "2-6 semaines",
    "energy_boost": "3-8 semaines",
    "immune_support": "4-12 semaines",
    "digestive_health": "4-12 semaines",
    "hormonal_balance": "8-16 semaines",
    "cognitive_enhancement": "6-12 semaines",
    "inflammation_reduction": "4-12 semaines",
    "weight_management": "12-24 semaines"
  };
  
  return timeFrames[goalId] || "8-12 semaines";
}

/**
 * Détermine l'approche recommandée pour atteindre un objectif en fonction du profil utilisateur
 * @param goalId Identifiant de l'objectif
 * @param userProfile Profil complet de l'utilisateur
 * @returns Approche recommandée personnalisée
 */
function getRecommendedApproach(goalId: string, userProfile: UserProfile): string {
  // Logique personnalisée selon l'objectif et le profil utilisateur
  switch (goalId) {
    case "stress_management":
      if (userProfile.stressLevel === "very_high") {
        return "Approche intensive combinant suppléments adaptogènes, techniques de relaxation et amélioration du sommeil";
      } else {
        return "Approche progressive avec suppléments adaptogènes et techniques de gestion du stress";
      }
    
    case "sleep_improvement":
      if (userProfile.symptoms["insomnia"] > 7) {
        return "Protocole complet de restauration du sommeil avec suppléments, hygiène du sommeil et gestion du stress";
      } else {
        return "Amélioration de l'hygiène du sommeil et suppléments ciblés";
      }
    
    case "energy_boost":
      if (userProfile.symptoms["fatigue"] > 7) {
        return "Investigation des causes sous-jacentes (thyroïde, anémie) et supplémentation ciblée";
      } else {
        return "Optimisation nutritionnelle et suppléments énergétiques";
      }
    
    default:
      return "Approche personnalisée combinant suppléments ciblés et modifications du mode de vie";
  }
}
