/**
 * Système de recommandation avancé pour les compléments alimentaires naturels
 * Implémente une logique sophistiquée pour générer des recommandations personnalisées
 */

import { UserProfile, SupplementInfo, SupplementRecommendation, RecommendationResult } from '@/utils/types';
import { SUPPLEMENT_CATALOG } from '@/data/supplementCatalog';
import { analyzeTreatmentPriorities, generateLifestyleRecommendations, generateDietaryRecommendations, generateFollowUpRecommendations, generatePersonalizedReason } from '@/utils/prioritizationSystem';
import { calculateCycleAdjustedDosage, determineFemaleLifeCyclePhase } from '@/data/femaleSpecificRules';

// Facteurs d'ajustement pour le calcul des scores de correspondance
const MATCH_FACTORS = {
  SYMPTOM_MATCH: 2.5,
  GOAL_MATCH: 2.0,
  LIFESTYLE_MATCH: 1.5,
  AGE_MATCH: 1.0,
  GENDER_MATCH: 1.0,
  GENDER_SPECIFIC_BOOST: 1.2, // Nouveau facteur pour les besoins spécifiques au genre
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
    
    // Bonus supplémentaire pour les femmes avec des symptômes spécifiques
    if (userProfile.gender.toLowerCase() === 'femme') {
      // Symptômes spécifiques aux femmes qui justifient un boost supplémentaire
      const femaleSpecificSymptoms = ['mood_swings', 'fatigue', 'sleep_issues', 'stress_anxiety', 'skin_problems'];
      
      // Vérifier si la femme a des symptômes spécifiques sévères
      const hasFemaleSpecificSymptoms = femaleSpecificSymptoms.some(symptomId => 
        userProfile.symptoms[symptomId] && userProfile.symptoms[symptomId] >= 5
      );
      
      // Vérifier si le supplément est particulièrement bénéfique pour ces symptômes
      const supplementTargetsFemaleSymptoms = femaleSpecificSymptoms.some(symptomId => 
        supplement.targetSymptoms.includes(symptomId) && 
        (supplement.efficacyRatings[symptomId]?.percentage || 0) > 70
      );
      
      // Appliquer le bonus si les deux conditions sont remplies
      if (hasFemaleSpecificSymptoms && supplementTargetsFemaleSymptoms) {
        matchScore += MATCH_FACTORS.GENDER_SPECIFIC_BOOST;
      }
    }
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
  const evidenceLevelBoost: Record<string, number> = {
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
  let additionalDosageNotes = '';
  
  // Ajustement du dosage selon l'âge
  if (userProfile.age && userProfile.age > 65 && supplement.specificDosages.elderly) {
    dosage = supplement.specificDosages.elderly.amount;
    additionalDosageNotes += supplement.specificDosages.elderly.notes || '';
  } else if (userProfile.age && userProfile.age < 25) {
    // Pour les jeunes adultes, potentiellement réduire légèrement le dosage
    const standardDosageMatch = dosage.match(/(\d+)-(\d+)/);
    if (standardDosageMatch) {
      const minDose = parseInt(standardDosageMatch[1]);
      const recommendedDose = Math.floor(minDose * 0.8);
      dosage = `${recommendedDose}-${minDose} mg`;
      additionalDosageNotes += ' Commencer avec la dose minimale recommandée.';
    }
  }
  
  // Ajustement selon le mode de vie
  if (userProfile.lifestyleFactors && userProfile.lifestyleFactors.includes('athletic_activity') && supplement.specificDosages.athletes) {
    dosage = supplement.specificDosages.athletes.amount;
    additionalDosageNotes += supplement.specificDosages.athletes.notes || '';
  }
  
  // Ajustement selon le genre
  if (userProfile.gender) {
    if (userProfile.gender.toLowerCase() === 'femme' && supplement.specificDosages.women) {
      // Appliquer le dosage spécifique aux femmes comme base
      dosage = supplement.specificDosages.women.amount;
      additionalDosageNotes += supplement.specificDosages.women.notes || '';
      
      // Ajustements supplémentaires pour les femmes en fonction du cycle hormonal
      if (userProfile.femaleSpecificData && userProfile.femaleSpecificData.cyclePhase) {
        // Utiliser la fonction d'ajustement basée sur le cycle
        const { adjustedDosage, notes } = calculateCycleAdjustedDosage(
          supplement.id,
          userProfile.femaleSpecificData.cyclePhase,
          dosage
        );
        
        // Appliquer les ajustements si une modification a été faite
        if (adjustedDosage !== dosage) {
          dosage = adjustedDosage;
          additionalDosageNotes += ` ${notes}`;
        }
      } 
      // Ajustements basés sur la phase de vie reproductive (fertil, périménopause, post-ménopause)
      else if (userProfile.age) {
        // Déterminer la phase de vie reproductive basée sur l'âge
        const femaleLifeCyclePhase = determineFemaleLifeCyclePhase(userProfile.age);
        
        // Ajouter des notes spécifiques à l'âge
        switch (femaleLifeCyclePhase) {
          case 'perimenopause':
            additionalDosageNotes += " Dosage adapté à la phase de périménopause.";
            break;
          case 'postmenopause':
            if (['calcium', 'vitamin_d', 'vitamin_k2'].includes(supplement.id)) {
              // Augmenter légèrement le dosage pour ces suppléments essentiels à la santé osseuse
              const dosageMatch = dosage.match(/(\d+)(\s*-\s*\d+)?(\s*\w+)/);
              if (dosageMatch) {
                const maxDose = dosageMatch[2] ? 
                  parseInt(dosageMatch[2].replace(/\s*-\s*/, '')) : 
                  parseInt(dosageMatch[1]);
                const unit = dosageMatch[3];
                const optimizedDose = Math.ceil(maxDose * 1.05);
                dosage = `${optimizedDose}${unit}`;
                additionalDosageNotes += " Dosage légèrement augmenté pour la phase post-ménopause (santé osseuse).";
              }
            }
            break;
          default:
            // Pas d'ajustements spécifiques pour la phase fertile si aucune info sur le cycle
            break;
        }
      }
    } else if (supplement.specificDosages.men && userProfile.gender.toLowerCase() === 'homme') {
      dosage = supplement.specificDosages.men.amount;
      additionalDosageNotes += supplement.specificDosages.men.notes || '';
    }
  }
  
  // Ajustement en fonction des médicaments
  if (userProfile.medications && userProfile.medications.length > 0) {
    // Risque d'interactions - réduire la dose si risque potentiel
    const potentialInteractions = userProfile.medications.some(med => 
      supplement.interactions.some(interaction => 
        interaction.interactionType === 'drug' && 
        med.toLowerCase().includes(interaction.substance.toLowerCase())
      )
    );
    
    if (potentialInteractions) {
      // Réduire le dosage d'environ 25% si interaction potentielle
      const standardDosageMatch = dosage.match(/(\d+)-(\d+)/);
      if (standardDosageMatch) {
        const minDose = parseInt(standardDosageMatch[1]);
        const maxDose = parseInt(standardDosageMatch[2]);
        const newMin = Math.floor(minDose * 0.75);
        const newMax = Math.floor(maxDose * 0.75);
        dosage = `${newMin}-${newMax} mg`;
        additionalDosageNotes += ' Dosage réduit en raison des interactions médicamenteuses potentielles.';
      } else {
        additionalDosageNotes += ' Commencer avec 75% de la dose standard en raison des interactions médicamenteuses potentielles.';
      }
    }
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
  
  // Construction du dosage complet avec notes additionnelles
  const fullDosageInfo = dosage + (additionalDosageNotes ? ` (${additionalDosageNotes})` : '');
  
  // Construction de notes d'efficacité ajustées selon l'âge
  let adjustedTimeFrame = timeFrame;
  if (userProfile.age) {
    if (userProfile.age > 65) {
      // Personnes âgées: les effets peuvent prendre 25-30% plus de temps
      const timeMatch = timeFrame.match(/(\d+)-(\d+)/);
      if (timeMatch) {
        const minWeeks = parseInt(timeMatch[1]);
        const maxWeeks = parseInt(timeMatch[2]);
        const newMin = Math.ceil(minWeeks * 1.25);
        const newMax = Math.ceil(maxWeeks * 1.25);
        adjustedTimeFrame = `${newMin}-${newMax} semaines (délai rallongé pour les personnes de plus de 65 ans)`;
      }
    } else if (userProfile.age < 25) {
      // Jeunes adultes: métabolisme plus rapide
      const timeMatch = timeFrame.match(/(\d+)-(\d+)/);
      if (timeMatch) {
        const minWeeks = parseInt(timeMatch[1]);
        const maxWeeks = parseInt(timeMatch[2]);
        const newMin = Math.max(1, Math.floor(minWeeks * 0.9));
        const newMax = Math.floor(maxWeeks * 0.9);
        adjustedTimeFrame = `${newMin}-${newMax} semaines (métabolisme généralement plus rapide à votre âge)`;
      }
    }
  }
  
  // Ajuster l'efficacité en fonction des médicaments
  let adjustedEfficacy = efficacyPercentage;
  if (userProfile.medications && userProfile.medications.length > 0) {
    // Si des médicaments peuvent interférer, réduire légèrement l'efficacité attendue
    const potentialInteractions = userProfile.medications.some(med => 
      supplement.interactions.some(interaction => 
        interaction.interactionType === 'drug' && 
        med.toLowerCase().includes(interaction.substance.toLowerCase())
      )
    );
    
    if (potentialInteractions) {
      adjustedEfficacy = Math.floor(efficacyPercentage * 0.85); // Réduction de 15% de l'efficacité attendue
    }
  }
  
  return {
    supplementId,
    name: supplement.name,
    priorityScore: scoreData.priorityScore,
    matchScore: scoreData.matchScore,
    efficacyPercentage: adjustedEfficacy,
    timeFrame: adjustedTimeFrame,
    dosage: fullDosageInfo,
    timing,
    personalizedReason,
    targetSymptoms: scoreData.targetSymptoms,
    targetGoals: scoreData.targetGoals,
    safetyNotes: scoreData.safetyNotes,
    interactionWarnings: scoreData.interactionWarnings,
    naturalAlternatives,
    demographicFactors: {
      ageAdjusted: userProfile.age ? true : false,
      genderAdjusted: userProfile.gender ? true : false,
      medicationAdjusted: (userProfile.medications && userProfile.medications.length > 0) ? true : false
    }
  };
}
