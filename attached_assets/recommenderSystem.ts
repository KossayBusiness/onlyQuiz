/**
 * Système de recommandation avancé pour les compléments alimentaires naturels
 * Implémente une logique sophistiquée pour générer des recommandations personnalisées
 */

import { UserProfile, SupplementInfo, SupplementRecommendation, RecommendationResult } from '@/utils/types';
import { SUPPLEMENT_CATALOG } from '@/data/supplementCatalog';
import { analyzeTreatmentPriorities, SYMPTOM_CAUSES, SYMPTOM_RELATIONSHIPS } from '@/utils/prioritizationSystem';

// Facteurs d'ajustement pour le calcul des scores de correspondance
const MATCH_FACTORS = {
  SYMPTOM_MATCH: 2.5,
  GOAL_MATCH: 2.0,
  LIFESTYLE_MATCH: 1.5,
  AGE_MATCH: 1.0,
  GENDER_MATCH: 1.0,
  CONDITION_MATCH: 1.8,
  EFFICACY_BOOST: 1.2,
  EVIDENCE_BOOST: 1.3,
  INTERACTION_PENALTY: 0.7,
  CONTRAINDICATION_PENALTY: 0.5
};

/**
 * Génère des recommandations personnalisées de compléments alimentaires
 * @param userProfile Profil complet de l'utilisateur
 * @returns Résultat détaillé avec recommandations personnalisées
 */
export function generatePersonalizedRecommendations(userProfile: UserProfile): RecommendationResult {
  // Analyse des priorités de traitement
  const priorityAnalysis = analyzeTreatmentPriorities(userProfile);
  
  // Calcul des scores de correspondance pour chaque complément
  const supplementScores: Record<string, {
    matchScore: number;
    priorityScore: number;
    targetSymptoms: string[];
    targetGoals: string[];
    safetyNotes: string[];
    interactionWarnings: string[];
  }> = {};
  
  // Évaluation de chaque complément dans le catalogue
  Object.values(SUPPLEMENT_CATALOG).forEach(supplement => {
    const scoreData = calculateSupplementMatchScore(supplement, userProfile, priorityAnalysis);
    supplementScores[supplement.id] = scoreData;
  });
  
  // Tri des compléments par score de priorité
  const sortedSupplements = Object.entries(supplementScores)
    .sort((a, b) => b[1].priorityScore - a[1].priorityScore);
  
  // Génération des recommandations primaires (top 3-5)
  const primaryRecommendations = sortedSupplements
    .slice(0, 5)
    .map(([supplementId, scoreData]) => createRecommendation(supplementId, scoreData, userProfile));
  
  // Génération des recommandations secondaires (5 suivantes)
  const secondaryRecommendations = sortedSupplements
    .slice(5, 10)
    .map(([supplementId, scoreData]) => createRecommendation(supplementId, scoreData, userProfile));
  
  // Génération des recommandations de mode de vie et d'alimentation
  const lifestyleRecommendations = generateLifestyleRecommendations(userProfile, priorityAnalysis);
  const dietaryRecommendations = generateDietaryRecommendations(userProfile, priorityAnalysis);
  
  // Recommandations de suivi
  const followUpRecommendations = generateFollowUpRecommendations(userProfile, primaryRecommendations);
  
  return {
    userProfile,
    primaryRecommendations,
    secondaryRecommendations,
    symptomAnalysis: priorityAnalysis.symptomAnalysis,
    goalAnalysis: priorityAnalysis.goalAnalysis,
    lifestyleRecommendations,
    dietaryRecommendations,
    followUpRecommendations
  };
}

/**
 * Calcule le score de correspondance entre un complément et le profil utilisateur
 * @param supplement Informations sur le complément
 * @param userProfile Profil de l'utilisateur
 * @param priorityAnalysis Analyse des priorités de traitement
 * @returns Données de score et d'analyse pour le complément
 */
function calculateSupplementMatchScore(
  supplement: SupplementInfo,
  userProfile: UserProfile,
  priorityAnalysis: any
): {
  matchScore: number;
  priorityScore: number;
  targetSymptoms: string[];
  targetGoals: string[];
  safetyNotes: string[];
  interactionWarnings: string[];
} {
  let matchScore = 0;
  const targetSymptoms: string[] = [];
  const targetGoals: string[] = [];
  const safetyNotes: string[] = [];
  const interactionWarnings: string[] = [];
  
  // 1. Correspondance avec les symptômes prioritaires
  const matchingSymptoms = supplement.targetSymptoms.filter(symptomId => 
    userProfile.symptoms[symptomId] && userProfile.symptoms[symptomId] >= 4
  );
  
  matchingSymptoms.forEach(symptomId => {
    const symptomSeverity = userProfile.symptoms[symptomId];
    const symptomPriority = priorityAnalysis.symptomAnalysis[symptomId]?.priority || 50;
    const efficacyRating = supplement.efficacyRatings[symptomId]?.percentage || 60;
    
    // Score basé sur la sévérité du symptôme, sa priorité et l'efficacité du complément
    const symptomScore = (symptomSeverity / 10) * (symptomPriority / 100) * (efficacyRating / 100) * MATCH_FACTORS.SYMPTOM_MATCH;
    matchScore += symptomScore;
    
    // Ajouter aux symptômes ciblés
    if (symptomScore > 0.1) {
      targetSymptoms.push(symptomId);
    }
  });
  
  // 2. Correspondance avec les objectifs prioritaires
  const matchingGoals = supplement.targetGoals.filter(goalId => 
    userProfile.goals[goalId] && userProfile.goals[goalId] >= 4
  );
  
  matchingGoals.forEach(goalId => {
    const goalImportance = userProfile.goals[goalId];
    const goalPriority = priorityAnalysis.goalAnalysis[goalId]?.priority || 50;
    
    // Score basé sur l'importance de l'objectif et sa priorité
    const goalScore = (goalImportance / 10) * (goalPriority / 100) * MATCH_FACTORS.GOAL_MATCH;
    matchScore += goalScore;
    
    // Ajouter aux objectifs ciblés
    if (goalScore > 0.1) {
      targetGoals.push(goalId);
    }
  });
  
  // 3. Correspondance avec les facteurs de mode de vie
  const matchingLifestyleFactors = supplement.targetDemographics.lifestyleFactors.filter(factor => 
    userProfile.lifestyleFactors.includes(factor)
  );
  
  matchScore += matchingLifestyleFactors.length * MATCH_FACTORS.LIFESTYLE_MATCH;
  
  // 4. Correspondance avec l'âge
  const [minAge, maxAge] = supplement.targetDemographics.ageRange;
  if (userProfile.age >= minAge && userProfile.age <= maxAge) {
    matchScore += MATCH_FACTORS.AGE_MATCH;
  } else {
    matchScore -= MATCH_FACTORS.AGE_MATCH;
    safetyNotes.push(`Ce complément n'est pas spécifiquement étudié pour votre groupe d'âge.`);
  }
  
  // 5. Correspondance avec le genre
  if (supplement.targetDemographics.gender === 'all' || 
      supplement.targetDemographics.gender.toLowerCase() === userProfile.gender.toLowerCase()) {
    matchScore += MATCH_FACTORS.GENDER_MATCH;
  }
  
  // 6. Correspondance avec les conditions existantes
  const matchingConditions = supplement.targetDemographics.conditions.filter(condition => 
    userProfile.existingConditions.includes(condition)
  );
  
  matchScore += matchingConditions.length * MATCH_FACTORS.CONDITION_MATCH;
  
  // 7. Bonus pour l'efficacité globale
  const avgEfficacy = supplement.benefits.reduce((sum, benefit) => sum + benefit.efficacyPercentage, 0) / 
                     supplement.benefits.length;
  matchScore += (avgEfficacy / 100) * MATCH_FACTORS.EFFICACY_BOOST;
  
  // 8. Bonus pour le niveau de preuve scientifique
  const evidenceLevelBoost = {
    'strong': 1.0,
    'moderate': 0.8,
    'preliminary': 0.5,
    'theoretical': 0.3,
    'anecdotal': 0.2,
    'insufficient': 0.1,
    'mixed': 0.4
  };
  
  matchScore += evidenceLevelBoost[supplement.scientificEvidence.overallEvidenceLevel] * MATCH_FACTORS.EVIDENCE_BOOST;
  
  // 9. Pénalités pour les contre-indications
  supplement.contraindications.forEach(contraindication => {
    if (userProfile.existingConditions.includes(contraindication.condition)) {
      matchScore *= MATCH_FACTORS.CONTRAINDICATION_PENALTY;
      safetyNotes.push(`Contre-indication: ${contraindication.description}`);
    }
  });
  
  // 10. Pénalités pour les interactions médicamenteuses
  supplement.interactions.forEach(interaction => {
    if (interaction.interactionType === 'drug' && 
        userProfile.medications.some(med => med.toLowerCase().includes(interaction.substance.toLowerCase()))) {
      matchScore *= MATCH_FACTORS.INTERACTION_PENALTY;
      interactionWarnings.push(`Interaction possible avec ${interaction.substance}: ${interaction.effect}. ${interaction.recommendation}`);
    }
  });
  
  // 11. Pénalités pour les allergies
  if (userProfile.allergies.some(allergy => 
      supplement.additionalInfo.commonNames.some(name => name.toLowerCase().includes(allergy.toLowerCase())))) {
    matchScore *= 0.1; // Forte pénalité pour les allergies
    safetyNotes.push(`Attention: ce complément peut contenir des allergènes qui vous concernent.`);
  }
  
  // Calcul du score de priorité final
  // Combinaison du score de correspondance et de la priorité des symptômes/objectifs ciblés
  let priorityScore = matchScore;
  
  // Ajustement basé sur la priorité des symptômes ciblés
  targetSymptoms.forEach(symptomId => {
    const symptomPriority = priorityAnalysis.symptomAnalysis[symptomId]?.priority || 50;
    priorityScore += (symptomPriority / 100) * 10;
  });
  
  // Ajustement basé sur la priorité des objectifs ciblés
  targetGoals.forEach(goalId => {
    const goalPriority = priorityAnalysis.goalAnalysis[goalId]?.priority || 50;
    priorityScore += (goalPriority / 100) * 8;
  });
  
  return {
    matchScore,
    priorityScore,
    targetSymptoms,
    targetGoals,
    safetyNotes,
    interactionWarnings
  };
}

/**
 * Crée une recommandation détaillée pour un complément
 * @param supplementId Identifiant du complément
 * @param scoreData Données de score et d'analyse
 * @param userProfile Profil de l'utilisateur
 * @returns Recommandation personnalisée
 */
function createRecommendation(
  supplementId: string,
  scoreData: {
    matchScore: number;
    priorityScore: number;
    targetSymptoms: string[];
    targetGoals: string[];
    safetyNotes: string[];
    interactionWarnings: string[];
  },
  userProfile: UserProfile
): SupplementRecommendation {
  const supplement = SUPPLEMENT_CATALOG[supplementId];
  
  // Détermination du dosage personnalisé
  let dosage = supplement.standardDosage.amount;
  let timing = supplement.standardDosage.timing;
  
  // Ajustement du dosage selon le profil
  if (userProfile.age > 65 && supplement.specificDosages.elderly) {
    dosage = supplement.specificDosages.elderly.amount;
  } else if (userProfile.lifestyleFactors.includes('athletic_activity') && supplement.specificDosages.athletes) {
    dosage = supplement.specificDosages.athletes.amount;
  }
  
  // Détermination de l'efficacité moyenne pour les symptômes ciblés
  let efficacyPercentage = 0;
  let timeFrame = "";
  
  if (scoreData.targetSymptoms.length > 0) {
    const targetSymptomRatings = scoreData.targetSymptoms
      .map(symptomId => supplement.efficacyRatings[symptomId])
      .filter(rating => rating !== undefined);
    
    if (targetSymptomRatings.length > 0) {
      efficacyPercentage = targetSymptomRatings.reduce((sum, rating) => sum + rating.percentage, 0) / 
                          targetSymptomRatings.length;
      
      // Utilisation du délai le plus long comme estimation
      const timeFrames = targetSymptomRatings.map(rating => rating.timeFrame);
      timeFrame = timeFrames.reduce((longest, current) => {
        const longestWeeks = parseInt(longest.split('-')[1] || longest.split('-')[0]);
        const currentWeeks = parseInt(current.split('-')[1] || current.split('-')[0]);
        return currentWeeks > longestWeeks ? current : longest;
      }, targetSymptomRatings[0].timeFrame);
    } else {
      // Valeurs par défaut si pas de ratings spécifiques
      efficacyPercentage = supplement.benefits[0]?.efficacyPercentage || 70;
      timeFrame = supplement.benefits[0]?.timeFrame || "4-8 semaines";
    }
  } else {
    // Valeurs par défaut si pas de symptômes ciblés
    efficacyPercentage = supplement.benefits[0]?.efficacyPercentage || 70;
    timeFrame = supplement.benefits[0]?.timeFrame || "4-8 semaines";
  }
  
  // Génération de la raison personnalisée
  const personalizedReason = generatePersonalizedReason(
    supplement,
    scoreData.targetSymptoms,
    scoreData.targetGoals,
    userProfile
  );
  
  // Alternatives naturelles
  const naturalAlternatives = supplement.naturalSources
    .map(source => `${source.name} (${source.concentration})${source.notes ? ` - ${source.notes}` : ''}`)
    .slice(0, 3);
  
  return {
    supplementId,
    name: supplement.name,
    priorityScore: scoreData.priorityScore,
    matchScore: scoreData.matchScore,
    efficacyPercentage,
    timeFrame,
    dosage,
    timing,
    personalizedReason,
    targetSymptoms: scoreData.targetSymptoms,
    targetGoals: scoreData.targetGoals,
    safetyNotes: scoreData.safetyNotes,
    interactionWarnings: scoreData.interactionWarnings,
    naturalAlternatives
  };
}

/**
 * Génère une explication personnalisée pour la recommandation d'un complément
 * @param supplement Informations sur le complément
 * @param targetSymptoms Symptômes ciblés
 * @param targetGoals Objectifs ciblés
 * @param userProfile Profil de l'utilisateur
 * @returns Explication personnalisée
 */
function generatePersonalizedReason(
  supplement: SupplementInfo,
  targetSymptoms: string[],
  targetGoals: string[],
  userProfile: UserProfile
): string {
  let reason = `Le ${supplement.name} est recommandé spécifiquement pour vous car `;
  
  // Raisons basées sur les symptômes
  if (targetSymptoms.length > 0) {
    reason += `il est particulièrement efficace pour `;
    
    if (targetSymptoms.length === 1) {
      const symptomId = targetSymptoms[0];
      const efficacy = supplement.efficacyRatings[symptomId]?.percentage || 70;
      reason += `réduire votre ${symptomId.replace(/_/g, ' ')} (efficacité estimée à ${efficacy}%). `;
    } else {
      reason += `traiter plusieurs de vos symptômes prioritaires, notamment `;
      reason += targetSymptoms.slice(0, 2).map(s => s.replace(/_/g, ' ')).join(' et ');
      if (targetSymptoms.length > 2) {
        reason += `, ainsi que d'autres symptômes. `;
      } else {
        reason += `. `;
      }
    }
  }
  
  // Raisons basées sur les objectifs
  if (targetGoals.length > 0) {
    reason += `Il soutient directement vos objectifs de `;
    reason += targetGoals.slice(0, 2).map(g => g.replace(/_/g, ' ')).join(' et ');
    if (targetGoals.length > 2) {
      reason += `, entre autres. `;
    } else {
      reason += `. `;
    }
  }
  
  // Mécanisme d'action simplifié
  reason += `Son mécanisme d'action principal consiste à ${getSimplifiedMechanism(supplement)}. `;
  
  // Avantages spécifiques au profil
  if (userProfile.lifestyleFactors.includes('high_stress_occupation') && 
      supplement.targetSymptoms.includes('stress')) {
    reason += `Il est particulièrement adapté à votre mode de vie stressant. `;
  }
  
  if (userProfile.lifestyleFactors.includes('poor_sleep_quality') && 
      supplement.targetSymptoms.includes('insomnia')) {
    reason += `Il peut significativement améliorer votre qualité de sommeil. `;
  }
  
  if (userProfile.lifestyleFactors.includes('athletic_activity') && 
      (supplement.targetGoals.includes('energy_enhancement') || supplement.targetGoals.includes('muscle_recovery'))) {
    reason += `Il soutient vos performances physiques et votre récupération. `;
  }
  
  // Niveau de preuve scientifique
  const evidenceLevelText = {
    'strong': 'solides',
    'moderate': 'modérées',
    'preliminary': 'préliminaires',
    'theoretical': 'théoriques',
    'anecdotal': 'anecdotiques',
    'insufficient': 'insuffisantes',
    'mixed': 'mitigées'
  };
  
  reason += `Les preuves scientifiques soutenant son efficacité sont ${evidenceLevelText[supplement.scientificEvidence.overallEvidenceLevel]}.`;
  
  return reason;
}

/**
 * Simplifie le mécanisme d'action d'un complément pour une explication accessible
 * @param supplement Informations sur le complément
 * @returns Mécanisme d'action simplifié
 */
function getSimplifiedMechanism(supplement: SupplementInfo): string {
  // Extraire les 100-150 premiers caractères du mécanisme et simplifier
  const fullMechanism = supplement.biochemicalMechanism;
  const simplifiedMechanism = fullMechanism.substring
(Content truncated due to size limit. Use line ranges to read in chunks)