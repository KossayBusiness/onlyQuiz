/**
 * Système d'analyse des effets synergiques composés
 * Évalue et quantifie les interactions synergiques entre suppléments
 * pour optimiser l'efficacité des protocoles
 */

import { 
  SynergyCategory, SynergySubCategory, SynergyGraph, 
  SYNERGY_CATEGORY_COLORS, SYNERGY_CATEGORY_DESCRIPTIONS 
} from '@/utils/synergyTypes';
import { SYNERGY_PAIRS, getSynergyBetween } from '@/data/supplementSynergies';
import { SUPPLEMENT_DATABASE, getSupplement } from '@/data/supplementDatabase';
import { 
  calculateCompoundSynergyScore, 
  generateSynergyGraph,
  calculateSymptomSynergyImpact,
  calculateOptimalIntakeSchedule
} from '@/utils/synergyCalculation';

/**
 * Interface pour le résultat de l'analyse des effets synergiques composés
 */
export interface CompoundSynergyAnalysisResult {
  // Score synergique global
  overallEffectiveness: number;
  
  // Réseau de synergies pour visualisation
  synergyGraph: SynergyGraph;
  
  // Distribution par catégorie d'effet synergique
  synergisticEffects: Record<SynergyCategory, number>;
  
  // Effets temporels (adaptation, état stable)
  timeBasedEffects: {
    initialPhase: number;     // Jours 1-7
    adaptationPhase: number;  // Jours 8-21
    steadyStatePhase: number; // Jours 22+
  };
  
  // Suppléments clés dans le réseau synergique
  keySupplements: Array<{
    id: string;
    centralityScore: number;
    synergisticConnections: number;
  }>;
  
  // Ajustements de dosage recommandés
  dosageAdjustments: Record<string, {
    adjustedDosage: string;
    adjustmentReason: string;
  }>;
  
  // Chronologie de prise optimisée
  optimalIntakeSchedule: {
    morning: string[];
    afternoon: string[];
    evening: string[];
    recommendations: Record<string, string>;
  };
  
  // Amplificateurs environnementaux
  environmentalAmplifiers: Array<{
    factor: string;
    description: string;
    amplificationEffect: number;
  }>;
}

/**
 * Analyse avancée des effets synergiques composés entre plusieurs suppléments
 * 
 * @param supplementIds Liste des IDs des suppléments à analyser
 * @param userProfile Profil de l'utilisateur (optionnel, pour personnalisation)
 * @param targetConditions Conditions ciblées (optionnel, pour analyse spécifique)
 * @returns Résultat détaillé de l'analyse
 */
export function analyzeCompoundSynergisticEffects(
  supplementIds: string[],
  userProfile?: any,
  targetConditions?: string[]
): CompoundSynergyAnalysisResult {
  // Étape 1: Calculer le score synergique global
  const baseScore = calculateCompoundSynergyScore(supplementIds);
  
  // Score d'efficacité normalisé (1.0 = pas de synergie, jusqu'à 1.5 pour synergie maximale)
  const effectivenessScore = 1 + (baseScore * 0.5);
  
  // Étape 2: Générer le graphe de synergies
  const synergyGraph = generateSynergyGraph(supplementIds);
  
  // Étape 3: Calculer la distribution des effets par catégorie
  const categoryDistribution = calculateCategoryDistribution(supplementIds);
  
  // Étape 4: Calculer les effets temporels
  const timeBasedEffects = calculateTimeBasedEffects(supplementIds, categoryDistribution);
  
  // Étape 5: Identifier les suppléments clés dans le réseau
  const keySupplements = identifyKeySupplements(supplementIds, synergyGraph);
  
  // Étape 6: Déterminer les ajustements de dosage recommandés
  const dosageAdjustments = determineDosageAdjustments(
    supplementIds, 
    effectivenessScore, 
    categoryDistribution
  );
  
  // Étape 7: Calculer la planification optimale de prise
  const optimalIntakeSchedule = calculateOptimalIntakeSchedule(supplementIds);
  
  // Étape 8: Identifier les amplificateurs environnementaux
  const environmentalAmplifiers = identifyEnvironmentalAmplifiers(
    supplementIds, 
    categoryDistribution,
    userProfile
  );
  
  // Assembler les résultats
  return {
    overallEffectiveness: effectivenessScore,
    synergyGraph,
    synergisticEffects: categoryDistribution,
    timeBasedEffects,
    keySupplements,
    dosageAdjustments,
    optimalIntakeSchedule,
    environmentalAmplifiers
  };
}

/**
 * Calcule la distribution des effets synergiques par catégorie
 */
function calculateCategoryDistribution(
  supplementIds: string[]
): Record<SynergyCategory, number> {
  // Initialiser toutes les catégories à 0
  const distribution: Record<SynergyCategory, number> = {
    absorption: 0,
    metabolism: 0,
    function: 0,
    protection: 0,
    elimination: 0
  };
  
  // Compter les synergies par catégorie
  let totalSynergyScore = 0;
  
  // Pour chaque paire possible
  for (let i = 0; i < supplementIds.length; i++) {
    for (let j = i + 1; j < supplementIds.length; j++) {
      const synergy = getSynergyBetween(supplementIds[i], supplementIds[j]);
      
      if (synergy) {
        distribution[synergy.category] += synergy.synergyScore;
        totalSynergyScore += synergy.synergyScore;
      }
    }
  }
  
  // Normaliser les valeurs en pourcentages (si des synergies ont été trouvées)
  if (totalSynergyScore > 0) {
    Object.keys(distribution).forEach((category) => {
      distribution[category as SynergyCategory] = Math.round(
        (distribution[category as SynergyCategory] / totalSynergyScore) * 100
      );
    });
  } else {
    // Distribution par défaut si aucune synergie n'est trouvée
    distribution.absorption = 20;
    distribution.metabolism = 20;
    distribution.function = 20;
    distribution.protection = 20;
    distribution.elimination = 20;
  }
  
  return distribution;
}

/**
 * Calcule les effets temporels basés sur les catégories de synergies
 */
function calculateTimeBasedEffects(
  supplementIds: string[],
  categoryDistribution: Record<SynergyCategory, number>
): {
  initialPhase: number;
  adaptationPhase: number;
  steadyStatePhase: number;
} {
  // Facteurs d'influence temporelle par catégorie (valeurs hypothétiques basées sur la littérature)
  const temporalFactors = {
    // Effets rapides mais qui peuvent diminuer
    absorption: { initial: 0.8, adaptation: 1.2, steadyState: 1.0 },
    // Effets qui s'améliorent avec le temps
    metabolism: { initial: 0.6, adaptation: 1.0, steadyState: 1.3 },
    // Effets qui atteignent leur apogée en phase d'adaptation
    function: { initial: 0.7, adaptation: 1.3, steadyState: 1.1 },
    // Effets cumulatifs qui s'améliorent avec le temps
    protection: { initial: 0.5, adaptation: 0.9, steadyState: 1.4 },
    // Effets qui restent relativement constants
    elimination: { initial: 0.9, adaptation: 1.0, steadyState: 1.0 }
  };
  
  // Base des scores temporels (sans synergie)
  const baseScores = {
    initialPhase: 1.0,    // Effet de base
    adaptationPhase: 1.0, // Effet de base
    steadyStatePhase: 1.0 // Effet de base
  };
  
  // Calculer l'influence des catégories sur chaque phase temporelle
  Object.entries(categoryDistribution).forEach(([category, percentage]) => {
    const factors = temporalFactors[category as SynergyCategory];
    const weight = percentage / 100;
    
    // Ajouter la contribution pondérée de chaque catégorie
    baseScores.initialPhase += (factors.initial - 1) * weight;
    baseScores.adaptationPhase += (factors.adaptation - 1) * weight;
    baseScores.steadyStatePhase += (factors.steadyState - 1) * weight;
  });
  
  // Appliquer un facteur de normalisation pour s'assurer que les valeurs sont raisonnables
  const synergyBoostFactor = calculateCompoundSynergyScore(supplementIds) * 0.5;
  
  return {
    initialPhase: 1 + (baseScores.initialPhase - 1) * synergyBoostFactor,
    adaptationPhase: 1 + (baseScores.adaptationPhase - 1) * synergyBoostFactor,
    steadyStatePhase: 1 + (baseScores.steadyStatePhase - 1) * synergyBoostFactor
  };
}

/**
 * Identifie les suppléments clés dans le réseau synergique
 */
function identifyKeySupplements(
  supplementIds: string[],
  synergyGraph: SynergyGraph
): Array<{
  id: string;
  centralityScore: number;
  synergisticConnections: number;
}> {
  // Calculer le score de centralité et le nombre de connexions pour chaque supplément
  const supplementScores = supplementIds.map(id => {
    // Trouver le nœud correspondant dans le graphe
    const node = synergyGraph.nodes.find(n => n.id === id);
    
    // Compter les connexions synergiques
    const connections = synergyGraph.links.filter(link => 
      link.source === id || link.target === id
    );
    
    return {
      id,
      centralityScore: node ? node.strength : 0,
      synergisticConnections: connections.length
    };
  });
  
  // Trier par score de centralité (descendant)
  return supplementScores.sort((a, b) => b.centralityScore - a.centralityScore);
}

/**
 * Détermine les ajustements de dosage recommandés basés sur les synergies
 */
function determineDosageAdjustments(
  supplementIds: string[],
  effectivenessScore: number,
  categoryDistribution: Record<SynergyCategory, number>
): Record<string, {
  adjustedDosage: string;
  adjustmentReason: string;
}> {
  const adjustments: Record<string, {
    adjustedDosage: string;
    adjustmentReason: string;
  }> = {};
  
  // Pour chaque supplément
  supplementIds.forEach(id => {
    const supplement = getSupplement(id);
    if (!supplement) return;
    
    // Récupérer toutes les synergies impliquant ce supplément
    const synergies = supplementIds
      .filter(otherId => otherId !== id)
      .map(otherId => getSynergyBetween(id, otherId))
      .filter(s => s !== undefined);
    
    // Calculer un score d'interaction pour ce supplément
    const interactionScore = synergies.reduce((total, synergy) => {
      if (!synergy) return total;
      return total + synergy.synergyScore;
    }, 0);
    
    // Si le score d'interaction est significatif, proposer un ajustement
    if (interactionScore > 1.5) {
      const mostCommonCategory = Object.entries(categoryDistribution)
        .sort((a, b) => b[1] - a[1])[0][0] as SynergyCategory;
      
      // Déterminer le type d'ajustement en fonction de la catégorie dominante
      switch (mostCommonCategory) {
        case 'absorption':
          adjustments[id] = {
            adjustedDosage: `${Math.round((1 - (interactionScore * 0.1)) * 100)}% de la dose standard`,
            adjustmentReason: "Absorption améliorée par les synergies, une dose réduite est suffisante"
          };
          break;
          
        case 'metabolism':
          adjustments[id] = {
            adjustedDosage: "Fractionner en 2-3 prises quotidiennes",
            adjustmentReason: "Optimisation des voies métaboliques pour une efficacité continue"
          };
          break;
          
        case 'function':
          // Les synergies fonctionnelles peuvent suggérer un timing spécifique
          const timing = supplement.id === "magnesium" || supplement.id === "nac" 
            ? "Prise le soir recommandée"
            : "Prise le matin recommandée";
            
          adjustments[id] = {
            adjustedDosage: timing,
            adjustmentReason: "Synchronisation avec les rythmes biologiques pour maximiser les effets fonctionnels"
          };
          break;
          
        case 'protection':
          // Pour les protecteurs, on peut recommander un cycle
          adjustments[id] = {
            adjustedDosage: "5 jours d'utilisation, 2 jours de pause",
            adjustmentReason: "Prévention de l'adaptation et maintien de la sensibilité aux effets protecteurs"
          };
          break;
          
        case 'elimination':
          // Pour les agents de détoxification, on peut recommander une hydratation accrue
          adjustments[id] = {
            adjustedDosage: "Dose standard avec 2L d'eau minimum par jour",
            adjustmentReason: "Soutien optimal aux fonctions d'élimination et de détoxification"
          };
          break;
      }
    }
  });
  
  return adjustments;
}

/**
 * Identifie les facteurs environnementaux qui peuvent amplifier les effets synergiques
 */
function identifyEnvironmentalAmplifiers(
  supplementIds: string[],
  categoryDistribution: Record<SynergyCategory, number>,
  userProfile?: any
): Array<{
  factor: string;
  description: string;
  amplificationEffect: number;
}> {
  // Liste des amplificateurs par catégorie
  const amplifiersByCategory: Record<SynergyCategory, Array<{
    factor: string;
    description: string;
    baseEffect: number;
  }>> = {
    absorption: [
      {
        factor: "Jeûne intermittent",
        description: "16 heures de jeûne suivies de 8 heures d'alimentation peut améliorer l'absorption de certains suppléments",
        baseEffect: 0.15
      },
      {
        factor: "Combinaison avec des graisses saines",
        description: "Les acides gras à chaîne moyenne (huile de coco, huile MCT) peuvent améliorer l'absorption des suppléments liposolubles",
        baseEffect: 0.12
      }
    ],
    metabolism: [
      {
        factor: "Exercice d'intensité modérée",
        description: "30 minutes d'activité aérobique 3-4 fois par semaine peut optimiser le métabolisme des suppléments",
        baseEffect: 0.18
      },
      {
        factor: "Exposition au froid",
        description: "Les douches froides ou la cryothérapie peuvent activer les voies métaboliques complémentaires",
        baseEffect: 0.10
      }
    ],
    function: [
      {
        factor: "Optimisation du sommeil",
        description: "7-8 heures de sommeil de qualité augmentent l'efficacité des suppléments qui soutiennent les fonctions cognitives",
        baseEffect: 0.20
      },
      {
        factor: "Techniques de respiration",
        description: "La respiration profonde et la cohérence cardiaque peuvent amplifier les effets des adaptagènes et des suppléments nervins",
        baseEffect: 0.08
      }
    ],
    protection: [
      {
        factor: "Réduction de l'exposition aux toxines",
        description: "Minimiser l'exposition aux polluants, pesticides et produits chimiques ménagers améliore l'action des antioxydants",
        baseEffect: 0.15
      },
      {
        factor: "Alimentation riche en polyphénols",
        description: "Les fruits et légumes colorés peuvent créer un effet réseau synergique avec les suppléments antioxydants",
        baseEffect: 0.12
      }
    ],
    elimination: [
      {
        factor: "Hydratation optimale",
        description: "2-3 litres d'eau par jour peuvent améliorer significativement l'efficacité des suppléments de détoxification",
        baseEffect: 0.15
      },
      {
        factor: "Sauna ou transpiration active",
        description: "L'utilisation régulière du sauna peut améliorer l'élimination des toxines et amplifier l'action des suppléments de soutien hépatique",
        baseEffect: 0.12
      }
    ]
  };
  
  // Identifier les catégories dominantes (top 2)
  const dominantCategories = Object.entries(categoryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0] as SynergyCategory);
  
  // Sélectionner les amplificateurs correspondant aux catégories dominantes
  let selectedAmplifiers: Array<{
    factor: string;
    description: string;
    amplificationEffect: number;
  }> = [];
  
  dominantCategories.forEach(category => {
    const amplifiers = amplifiersByCategory[category];
    
    // Ajouter les amplificateurs avec leur effet calculé
    selectedAmplifiers = [
      ...selectedAmplifiers,
      ...amplifiers.map(amp => ({
        factor: amp.factor,
        description: amp.description,
        // Calculer l'effet d'amplification basé sur le pourcentage de la catégorie
        amplificationEffect: amp.baseEffect * (categoryDistribution[category] / 100 * 1.5)
      }))
    ];
  });
  
  // Trier par effet d'amplification (descendant)
  return selectedAmplifiers.sort((a, b) => b.amplificationEffect - a.amplificationEffect);
}