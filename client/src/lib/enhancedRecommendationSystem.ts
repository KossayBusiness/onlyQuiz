/**
 * Système de recommandation amélioré intégrant l'analyse des synergies
 * pour des recommandations plus personnalisées et efficaces
 */
import { QuizResponse, RecommendationResult, SupplementRecommendation, UserProfile } from "@/utils/types";
import { generateRecommendations } from "./recommendationSystem";
import { DETAILED_SUPPLEMENTS } from "@/data/supplementDatabase";
import { getSynergyBetweenSupplements, SYNERGY_DATABASE } from "@/data/supplementSynergies";
import { calculateCompoundSynergyEffect, generateSynergyNarrative, buildSynergyGraph } from "@/utils/compoundSynergyEffects";
import { SynergyCategory } from "@/utils/synergyTypes";

// L'export manquant qui était référencé ailleurs
// Cette fonction est adaptée pour prendre des paramètres différents de calculateCompoundSynergyEffect
export function analyzeCompoundSynergisticEffects(
  supplementIds: string[],
  userProfile: any,
  targetConditions: string[]
): { 
  synergyScore: number,
  enhancementPercentage: number,
  keyInteractions: Array<{ supplements: string[], mechanism: string, category: string }>
} {
  // Utiliser la base de données de synergies
  const relevantSynergies = SYNERGY_DATABASE.filter(synergy => {
    const [supp1, supp2] = synergy.pair;
    return supplementIds.includes(supp1) && supplementIds.includes(supp2);
  });
  
  // Calculer le score synergique global
  const synergyMultiplier = calculateCompoundSynergyEffect(
    supplementIds,
    relevantSynergies
  );
  
  // Préparer les interactions clés
  const keyInteractions = relevantSynergies
    .sort((a, b) => b.synergyScore - a.synergyScore)
    .slice(0, 3)
    .map(synergy => ({
      supplements: synergy.pair,
      mechanism: synergy.mechanism,
      category: synergy.category
    }));
  
  return {
    synergyScore: synergyMultiplier,
    enhancementPercentage: Math.round((synergyMultiplier - 1) * 100),
    keyInteractions
  };
}

/**
 * Génère des recommandations personnalisées améliorées avec analyse de synergies
 * et optimisation des combinaisons de suppléments
 */
export function generateEnhancedRecommendations(
  quizData: QuizResponse
): RecommendationResult {
  // Obtenir les recommandations de base
  const baseRecommendations = generateRecommendations(quizData);
  
  // Extraire les IDs des suppléments recommandés
  const primarySupplementIds = baseRecommendations.primaryRecommendations.map(rec => rec.id);
  const secondarySupplementIds = baseRecommendations.secondaryRecommendations.map(rec => rec.id);
  const allSupplementIds = [...primarySupplementIds, ...secondarySupplementIds];
  
  // Créer un mapping des noms de suppléments pour les visualisations
  const supplementNames: Record<string, string> = {};
  [...baseRecommendations.primaryRecommendations, ...baseRecommendations.secondaryRecommendations]
    .forEach(rec => {
      supplementNames[rec.id] = rec.name;
    });
  
  // Analyser les synergies entre les suppléments recommandés
  const synergyAnalysis = analyzeSupplementSynergies(
    primarySupplementIds,
    secondarySupplementIds,
    supplementNames
  );
  
  // Reclasser les recommandations en fonction des synergies
  const optimizedRecommendations = optimizeRecommendationsBySync(
    baseRecommendations.primaryRecommendations,
    baseRecommendations.secondaryRecommendations,
    synergyAnalysis
  );
  
  // Enrichir les données des recommandations avec les informations sur les synergies
  const enhancedPrimaryRecommendations = enhanceRecommendationsWithSynergyInfo(
    optimizedRecommendations.primaryRecommendations,
    allSupplementIds,
    synergyAnalysis
  );
  
  const enhancedSecondaryRecommendations = enhanceRecommendationsWithSynergyInfo(
    optimizedRecommendations.secondaryRecommendations,
    allSupplementIds,
    synergyAnalysis
  );
  
  // Ajouter l'analyse narrative des synergies à la section d'analyse du profil
  const enhancedProfileAnalysis = {
    ...baseRecommendations.profileAnalysis,
    synergyAnalysis: {
      narrative: synergyAnalysis.narrative,
      effectivenessMultiplier: synergyAnalysis.overallMultiplier,
      keySynergies: synergyAnalysis.keySynergicPairs.map(pair => ({
        supplements: [
          supplementNames[pair.pair[0]] || pair.pair[0],
          supplementNames[pair.pair[1]] || pair.pair[1]
        ],
        effect: pair.effect,
        mechanism: pair.mechanism,
        category: pair.category
      })),
      synergyGraph: synergyAnalysis.graphData
    }
  };
  
  return {
    primaryRecommendations: enhancedPrimaryRecommendations,
    secondaryRecommendations: enhancedSecondaryRecommendations,
    nutritionRecommendations: baseRecommendations.nutritionRecommendations,
    lifestyleRecommendations: baseRecommendations.lifestyleRecommendations,
    profileAnalysis: enhancedProfileAnalysis
  };
}

/**
 * Analyse les synergies entre les suppléments recommandés
 */
function analyzeSupplementSynergies(
  primarySupplementIds: string[],
  secondarySupplementIds: string[],
  supplementNames: Record<string, string>
) {
  const allSupplementIds = [...primarySupplementIds, ...secondarySupplementIds];
  
  // Récupérer toutes les paires synergiques pertinentes
  const synergyPairs = SYNERGY_DATABASE.filter(synergy => {
    const [supp1, supp2] = synergy.pair;
    return (
      allSupplementIds.includes(supp1) && 
      allSupplementIds.includes(supp2)
    );
  });
  
  // Calculer l'effet synergique global
  const overallMultiplier = calculateCompoundSynergyEffect(
    allSupplementIds,
    synergyPairs
  );
  
  // Identifier les paires les plus synergiques
  const keySynergicPairs = [...synergyPairs]
    .sort((a, b) => b.synergyScore - a.synergyScore)
    .slice(0, 5); // Top 5
  
  // Construire le graphe de synergies
  const graphData = buildSynergyGraph(
    allSupplementIds,
    supplementNames,
    synergyPairs
  );
  
  // Générer un narratif explicatif des synergies
  const narrative = generateSynergyNarrative(graphData, supplementNames);
  
  // Calculer les scores synergiques pour chaque supplément
  const supplementSynergyScores = calculateSupplementSynergyScores(
    allSupplementIds,
    synergyPairs
  );
  
  return {
    synergyPairs,
    keySynergicPairs,
    overallMultiplier,
    supplementSynergyScores,
    narrative,
    graphData
  };
}

/**
 * Calcule un score synergique pour chaque supplément
 * basé sur le nombre et la force de ses interactions
 */
function calculateSupplementSynergyScores(
  supplementIds: string[],
  synergyPairs: typeof SYNERGY_DATABASE
): Record<string, { score: number, pairs: typeof SYNERGY_DATABASE }> {
  const result: Record<string, { score: number, pairs: typeof SYNERGY_DATABASE }> = {};
  
  // Initialiser les scores
  supplementIds.forEach(id => {
    result[id] = { score: 0, pairs: [] };
  });
  
  // Calculer le score pour chaque supplément
  synergyPairs.forEach(synergy => {
    const [supp1, supp2] = synergy.pair;
    const synergyValue = synergy.synergyScore - 1.0; // Valeur nette de l'amélioration
    
    if (result[supp1]) {
      result[supp1].score += synergyValue;
      result[supp1].pairs.push(synergy);
    }
    
    if (result[supp2]) {
      result[supp2].score += synergyValue;
      result[supp2].pairs.push(synergy);
    }
  });
  
  return result;
}

/**
 * Optimise les recommandations en fonction des synergies détectées
 */
function optimizeRecommendationsBySync(
  primaryRecommendations: SupplementRecommendation[],
  secondaryRecommendations: SupplementRecommendation[],
  synergyAnalysis: ReturnType<typeof analyzeSupplementSynergies>
): { 
  primaryRecommendations: SupplementRecommendation[],
  secondaryRecommendations: SupplementRecommendation[] 
} {
  // Copier les recommandations pour les modifier
  const newPrimary = [...primaryRecommendations];
  const newSecondary = [...secondaryRecommendations];
  
  // Identifier les suppléments secondaires qui ont des synergies fortes
  // avec les suppléments primaires
  const synergisticSecondaryIds = new Set<string>();
  
  // Calculer les scores synergiques pour chaque supplément secondaire
  // en fonction de ses interactions avec les suppléments primaires
  const secondaryScores = newSecondary.map(rec => {
    const synergyScore = synergyAnalysis.supplementSynergyScores[rec.id]?.score || 0;
    return {
      recommendation: rec,
      synergyScore,
      combinedScore: rec.matchScore * (1 + synergyScore) // Combiner le score de base avec le score synergique
    };
  });
  
  // Trier les recommandations secondaires par score combiné
  secondaryScores.sort((a, b) => b.combinedScore - a.combinedScore);
  
  // Identifier les meilleurs candidats à "promouvoir"
  const promotionCandidates = secondaryScores
    .filter(item => item.synergyScore > 0.5) // Seuil de synergie significative
    .map(item => item.recommendation);
  
  // Limiter le nombre de promotions (max 1)
  const promotions = promotionCandidates.slice(0, Math.min(1, promotionCandidates.length));
  
  // Effectuer les promotions/rétrogradations si nécessaire
  if (promotions.length > 0) {
    // Pour chaque promotion, trouver le supplément primaire le moins important à rétrograder
    promotions.forEach(promotion => {
      // Retirer la promotion des recommandations secondaires
      const promotionIndex = newSecondary.findIndex(rec => rec.id === promotion.id);
      if (promotionIndex !== -1) {
        newSecondary.splice(promotionIndex, 1);
      }
      
      // Trouver le candidat à la rétrogradation (celui avec le moins de synergies)
      const primaryScores = newPrimary.map(rec => {
        const synergyScore = synergyAnalysis.supplementSynergyScores[rec.id]?.score || 0;
        return {
          recommendation: rec,
          synergyScore,
          matchScore: rec.matchScore
        };
      });
      
      // Trier par score synergique, puis par matchScore en cas d'égalité
      primaryScores.sort((a, b) => {
        if (a.synergyScore !== b.synergyScore) {
          return a.synergyScore - b.synergyScore;
        }
        return a.matchScore - b.matchScore;
      });
      
      // S'il y a un candidat à rétrograder
      if (primaryScores.length > 0) {
        const demotion = primaryScores[0].recommendation;
        
        // Retirer la rétrogradation des recommandations primaires
        const demotionIndex = newPrimary.findIndex(rec => rec.id === demotion.id);
        if (demotionIndex !== -1) {
          newPrimary.splice(demotionIndex, 1);
        }
        
        // Ajouter la promotion aux recommandations primaires
        newPrimary.push(promotion);
        
        // Ajouter la rétrogradation aux recommandations secondaires
        newSecondary.push(demotion);
      }
    });
  }
  
  // Trier les recommandations finales
  newPrimary.sort((a, b) => {
    const aScore = (synergyAnalysis.supplementSynergyScores[a.id]?.score || 0) * 0.3 + a.matchScore * 0.7;
    const bScore = (synergyAnalysis.supplementSynergyScores[b.id]?.score || 0) * 0.3 + b.matchScore * 0.7;
    return bScore - aScore;
  });
  
  newSecondary.sort((a, b) => {
    const aScore = (synergyAnalysis.supplementSynergyScores[a.id]?.score || 0) * 0.3 + a.matchScore * 0.7;
    const bScore = (synergyAnalysis.supplementSynergyScores[b.id]?.score || 0) * 0.3 + b.matchScore * 0.7;
    return bScore - aScore;
  });
  
  return {
    primaryRecommendations: newPrimary,
    secondaryRecommendations: newSecondary
  };
}

/**
 * Enrichit les recommandations avec des informations sur les synergies
 */
function enhanceRecommendationsWithSynergyInfo(
  recommendations: SupplementRecommendation[],
  allSupplementIds: string[],
  synergyAnalysis: ReturnType<typeof analyzeSupplementSynergies>
): SupplementRecommendation[] {
  return recommendations.map(recommendation => {
    const id = recommendation.id;
    const synergyInfo = synergyAnalysis.supplementSynergyScores[id];
    
    if (!synergyInfo || synergyInfo.pairs.length === 0) {
      // Pas de synergies détectées
      return recommendation;
    }
    
    // Trouver les suppléments avec lesquels celui-ci a une synergie
    const synergisticWith = synergyInfo.pairs
      .map(synergy => {
        const otherId = synergy.pair[0] === id ? synergy.pair[1] : synergy.pair[0];
        if (!allSupplementIds.includes(otherId)) return null;
        
        return {
          id: otherId,
          name: getSafeName(otherId),
          effect: synergy.synergyScore,
          category: synergy.category
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.effect - a!.effect);
    
    // Construire les informations de synergie
    const synergyBoost = Math.max(0, synergyInfo.score);
    const boostPercentage = Math.round(synergyBoost * 100);
    
    // Assembler la section de synergie de la raison personnalisée
    let synergyReason = '';
    
    if (synergisticWith.length > 0) {
      const topSynergies = synergisticWith.slice(0, 2);
      
      synergyReason = `\n\nCe supplément présente des synergies importantes avec ${
        topSynergies.map(s => s!.name).join(' et ')
      }, potentialisant son efficacité de ${boostPercentage}% dans votre protocole complet.`;
    }
    
    // Créer la recommandation améliorée
    return {
      ...recommendation,
      personalizedReason: recommendation.personalizedReason + synergyReason,
      synergies: synergisticWith.map(s => s!),
      synergyBoostPercentage: boostPercentage
    };
  });
}

/**
 * Utilitaire pour obtenir le nom d'un supplément de manière sécurisée
 */
function getSafeName(supplementId: string): string {
  return DETAILED_SUPPLEMENTS[supplementId]?.name || 
         supplementId.charAt(0).toUpperCase() + supplementId.slice(1);
}