/**
 * Système de priorisation des symptômes et objectifs
 * Permet d'attribuer un score d'urgence et de priorité aux symptômes et objectifs
 */

import { 
  normalizeSymptomId, 
  normalizeGoalId, 
  normalizeQuizData,
  SYMPTOM_ID_MAPPING, 
  GOAL_ID_MAPPING 
} from '../utils/normalization';

// Matrice de priorité des symptômes (échelle 1-10)
export const SYMPTOM_PRIORITY: Record<string, number> = {
  // Symptômes à haute priorité (8-10)
  "Douleurs articulaires": 9,
  "Maux de tête": 9,
  "Problèmes digestifs": 8,
  "Troubles du sommeil": 8,
  "Stress/Anxiété": 8,
  
  // Symptômes à priorité moyenne (5-7)
  "Fatigue": 7,
  "Problèmes de peau": 6,
  "Sautes d'humeur": 6,
  "Manque de concentration": 6,
  
  // Symptômes à priorité plus basse (1-4)
  "Cheveux/Ongles fragiles": 4,
  "Sensibilité au froid": 3,
  "Fringales": 3
};

// Matrice de priorité des objectifs (échelle 1-8)
export const GOAL_PRIORITY: Record<string, number> = {
  // Objectifs à haute priorité (6-8)
  "Réduire mon stress": 8,
  "Meilleur sommeil": 7,
  "Soutenir ma digestion": 7,
  "Renforcer mon immunité": 6,
  
  // Objectifs à priorité moyenne (3-5)
  "Plus d'énergie": 5,
  "Améliorer ma concentration": 5,
  "Soutenir mon système hormonal": 4,
  
  // Objectifs à priorité plus basse (1-2)
  "Améliorer ma peau": 2,
  "Équilibrer mon poids": 2
};

// Relations entre symptômes (symptômes qui sont souvent liés)
export const SYMPTOM_RELATIONSHIPS: Record<string, string[]> = {
  "Fatigue": ["Troubles du sommeil", "Stress/Anxiété", "Manque de concentration"],
  "Troubles du sommeil": ["Fatigue", "Stress/Anxiété", "Manque de concentration"],
  "Stress/Anxiété": ["Troubles du sommeil", "Fatigue", "Sautes d'humeur"],
  "Problèmes digestifs": ["Fatigue", "Stress/Anxiété"],
  "Maux de tête": ["Stress/Anxiété", "Fatigue", "Troubles du sommeil"],
  "Manque de concentration": ["Fatigue", "Troubles du sommeil", "Stress/Anxiété"]
};

// Facteurs amplificateurs (éléments qui augmentent la priorité d'un symptôme)
export const AMPLIFYING_FACTORS: Record<string, string[]> = {
  "age_above_50": ["Douleurs articulaires", "Fatigue", "Troubles du sommeil"],
  "high_stress": ["Troubles du sommeil", "Problèmes digestifs", "Fatigue", "Manque de concentration"],
  "poor_diet": ["Fatigue", "Problèmes de peau", "Problèmes digestifs"],
  "low_activity": ["Fatigue", "Douleurs articulaires", "Problèmes digestifs"]
};

/**
 * Calcule le score de priorité pour un symptôme donné
 * @param symptom Nom du symptôme
 * @param userFactors Facteurs amplificateurs applicables à l'utilisateur
 * @returns Score de priorité ajusté
 */
export function calculateSymptomPriority(
  symptom: string, 
  userFactors: string[] = []
): number {
  // Normaliser le symptôme pour assurer la cohérence des identifiants
  const normalizedSymptom = normalizeSymptomId(symptom);
  
  // Utiliser le symptôme original ou la version normalisée
  const baseScore = SYMPTOM_PRIORITY[symptom] || SYMPTOM_PRIORITY[normalizedSymptom] || 5;
  
  // Bonus pour les facteurs amplificateurs
  let amplificationBonus = 0;
  userFactors.forEach(factor => {
    // Vérifier si le facteur amplifie le symptôme original ou normalisé
    if (AMPLIFYING_FACTORS[factor]?.includes(symptom) || 
        AMPLIFYING_FACTORS[factor]?.includes(normalizedSymptom)) {
      amplificationBonus += 1;
    }
  });
  
  return Math.min(10, baseScore + amplificationBonus);
}

/**
 * Calcule le score de priorité pour un objectif donné
 * @param goal Nom de l'objectif
 * @param userFactors Facteurs amplificateurs applicables à l'utilisateur
 * @returns Score de priorité ajusté
 */
export function calculateGoalPriority(
  goal: string,
  userFactors: string[] = []
): number {
  // Normaliser l'objectif pour assurer la cohérence des identifiants
  const normalizedGoal = normalizeGoalId(goal);
  
  // Score de base (utiliser l'objectif original ou la version normalisée)
  const baseScore = GOAL_PRIORITY[goal] || GOAL_PRIORITY[normalizedGoal] || 3;
  
  // Bonus pour les facteurs amplificateurs (à définir selon les besoins)
  let amplificationBonus = 0;
  
  // Exemples d'ajustements basés sur les facteurs utilisateur
  // Vérifier à la fois l'objectif original et l'objectif normalisé
  const isStressReductionGoal = goal === "Réduire mon stress" || 
                               normalizedGoal === "reduce_stress" || 
                               goal === "Reduce stress";
                               
  const isBetterSleepGoal = goal === "Meilleur sommeil" || 
                           normalizedGoal === "improve_sleep" || 
                           goal === "Improve sleep" || 
                           goal === "Better sleep";
                           
  const isMoreEnergyGoal = goal === "Plus d'énergie" || 
                          normalizedGoal === "increase_energy" || 
                          goal === "Increase energy" || 
                          goal === "More energy";
                          
  const isDigestionGoal = goal === "Soutenir ma digestion" || 
                         normalizedGoal === "improve_digestion" || 
                         goal === "Support digestion" || 
                         goal === "Improve digestion";
  
  if (isStressReductionGoal && userFactors.includes("high_stress")) {
    amplificationBonus += 1.5;
  }
  
  if (isBetterSleepGoal && userFactors.includes("poor_sleep")) {
    amplificationBonus += 2;
  }
  
  if (isMoreEnergyGoal && userFactors.includes("low_activity")) {
    amplificationBonus += 1;
  }
  
  if (isDigestionGoal && userFactors.includes("poor_diet")) {
    amplificationBonus += 1.5;
  }
  
  return Math.min(10, baseScore + amplificationBonus);
}

/**
 * Détecte les contradictions potentielles dans les réponses de l'utilisateur
 * @param symptoms Symptômes sélectionnés par l'utilisateur
 * @param goals Objectifs sélectionnés par l'utilisateur
 * @param userProfile Informations sur le profil de l'utilisateur
 * @returns Liste des contradictions détectées
 */
export function detectContradictions(
  symptoms: string[],
  goals: string[],
  userProfile: any
): string[] {
  const contradictions: string[] = [];
  
  // Normaliser les symptômes pour la détection des contradictions
  const normalizedSymptoms = symptoms.map(symptom => normalizeSymptomId(symptom));
  
  // Vérifier les contradictions avec les versions normalisées et originales
  const hasSleepIssues = symptoms.includes("Troubles du sommeil") || 
                        symptoms.includes("Sleep issues") || 
                        normalizedSymptoms.includes("sleep_issues");
                        
  const hasFatigue = symptoms.includes("Fatigue") || 
                    normalizedSymptoms.includes("fatigue");
  
  // Exemple de détection de contradictions
  if (hasSleepIssues && userProfile.sleepQuality === "excellent") {
    contradictions.push("Vous avez indiqué des troubles du sommeil mais évalué votre qualité de sommeil comme excellente");
  }
  
  if (hasFatigue && userProfile.activityLevel === "daily") {
    contradictions.push("Vous avez indiqué de la fatigue mais pratiquez une activité physique quotidienne");
  }
  
  return contradictions;
}

/**
 * Trie les symptômes par ordre de priorité
 * @param symptoms Liste des symptômes
 * @param userFactors Facteurs amplificateurs applicables à l'utilisateur
 * @returns Symptômes triés par priorité (du plus prioritaire au moins prioritaire)
 */
export function prioritizeSymptoms(
  symptoms: string[],
  userFactors: string[] = []
): {symptom: string, priority: number}[] {
  // Normaliser les symptômes et éliminer les doublons potentiels
  const normalizedSymptomMap = new Map<string, string>();
  
  // Construire une map qui associe chaque identifiant normalisé à son symptôme original
  symptoms.forEach(symptom => {
    const normalizedKey = normalizeSymptomId(symptom);
    // Conserver la version originale pour l'affichage
    normalizedSymptomMap.set(normalizedKey, symptom);
  });
  
  // Calculer les priorités pour chaque symptôme unique normalisé
  return Array.from(normalizedSymptomMap.entries())
    .map(([normalizedKey, originalSymptom]) => ({
      symptom: originalSymptom,
      priority: calculateSymptomPriority(originalSymptom, userFactors)
    }))
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Trie les objectifs par ordre de priorité
 * @param goals Liste des objectifs
 * @param userFactors Facteurs amplificateurs applicables à l'utilisateur (optionnel)
 * @returns Objectifs triés par priorité (du plus prioritaire au moins prioritaire)
 */
export function prioritizeGoals(
  goals: string[], 
  userFactors: string[] = []
): {goal: string, priority: number}[] {
  // Normaliser les objectifs et éliminer les doublons potentiels
  const normalizedGoalMap = new Map<string, string>();
  
  // Construire une map qui associe chaque identifiant normalisé à son objectif original
  goals.forEach(goal => {
    const normalizedKey = normalizeGoalId(goal);
    // Conserver la version originale pour l'affichage
    normalizedGoalMap.set(normalizedKey, goal);
  });
  
  // Calculer les priorités pour chaque objectif unique normalisé
  return Array.from(normalizedGoalMap.entries())
    .map(([normalizedKey, originalGoal]) => ({
      goal: originalGoal,
      priority: calculateGoalPriority(originalGoal, userFactors)
    }))
    .sort((a, b) => b.priority - a.priority);
}