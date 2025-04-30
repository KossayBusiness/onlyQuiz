/**
 * Système de résolution des conflits entre synergies
 * Détecte et résout les conflits potentiels dans les combinaisons de suppléments
 */

import { generateSynergyMatrix, SynergyMatrixCell } from "./synergyMatrix";
import { SupplementSynergy } from "./synergyTypes";
import { SUPPLEMENT_SYNERGIES } from "../data/supplementSynergies";

/**
 * Types de conflits pouvant survenir entre suppléments
 */
export enum ConflictType {
  TIMING_CONFLICT = "timing_conflict",               // Conflits de timing optimal
  ABSORPTION_COMPETITION = "absorption_competition", // Compétition pour l'absorption
  PATHWAY_CONFLICT = "pathway_conflict",             // Conflits de voies métaboliques
  MECHANISM_CONFLICT = "mechanism_conflict",         // Conflits de mécanismes d'action
  DOSAGE_CONFLICT = "dosage_conflict"                // Conflits de dosage
}

/**
 * Interface pour un conflit entre synergies
 */
export interface SynergyConflict {
  supplements: string[];           // Suppléments impliqués dans le conflit
  conflictType: ConflictType;      // Type de conflit
  description: string;             // Description du conflit
  severity: number;                // Sévérité du conflit (1-10)
  resolution: {
    type: string;                  // Type de résolution
    description: string;           // Description de la résolution
    implementationSteps: string[]; // Étapes pour mettre en œuvre la résolution
  };
  alternatives?: {
    supplements: string[];         // Suppléments alternatifs suggérés
    rationale: string;             // Justification des alternatives
  };
}

/**
 * Règles de conflits connus entre suppléments
 */
const KNOWN_CONFLICT_RULES: Array<{
  supplements: string[];
  conflictType: ConflictType;
  description: string;
  severity: number;
  resolution: {
    type: string;
    description: string;
    implementationSteps: string[];
  };
  alternativesFunction?: (supplements: string[]) => string[] | null;
}> = [
  // Conflit de compétition pour l'absorption - Fer et Zinc
  {
    supplements: ["iron", "zinc"],
    conflictType: ConflictType.ABSORPTION_COMPETITION,
    description: "Le fer et le zinc sont en compétition pour les mêmes transporteurs intestinaux, réduisant mutuellement leur absorption.",
    severity: 7,
    resolution: {
      type: "timing_separation",
      description: "Séparer la prise du fer et du zinc d'au moins 2 heures",
      implementationSteps: [
        "Prendre le fer le matin à jeun avec de la vitamine C pour améliorer l'absorption",
        "Prendre le zinc en fin d'après-midi ou en soirée, au moins 2 heures après le fer"
      ]
    },
    alternativesFunction: (supplements) => {
      // Si le fer est pour l'anémie, suggérer la vitamine B12 comme alternative potentielle
      return ["vitamin_b12", "heme_iron"];
    }
  },
  
  // Conflit de timing pour la mélatonine
  {
    supplements: ["melatonin", "stimulant"],
    conflictType: ConflictType.TIMING_CONFLICT,
    description: "La mélatonine induit le sommeil, tandis que les stimulants (comme la caféine) l'inhibent.",
    severity: 9,
    resolution: {
      type: "temporal_separation",
      description: "Séparer ces suppléments par au moins 8 heures",
      implementationSteps: [
        "Prendre les stimulants uniquement le matin avant 14h",
        "Réserver la mélatonine exclusivement pour le soir, 30-60 minutes avant le coucher"
      ]
    }
  },
  
  // Conflit d'absorption avec le calcium
  {
    supplements: ["calcium", "iron"],
    conflictType: ConflictType.ABSORPTION_COMPETITION,
    description: "Le calcium inhibe significativement l'absorption du fer, réduisant son efficacité.",
    severity: 8,
    resolution: {
      type: "timing_separation",
      description: "Séparer la prise du calcium et du fer d'au moins 3-4 heures",
      implementationSteps: [
        "Prendre le fer le matin à jeun",
        "Prendre le calcium au dîner ou avant le coucher"
      ]
    }
  },
  
  // Conflit entre zinc et cuivre
  {
    supplements: ["zinc", "copper"],
    conflictType: ConflictType.ABSORPTION_COMPETITION,
    description: "Des doses élevées de zinc peuvent inhiber l'absorption du cuivre et vice versa, créant potentiellement des déséquilibres.",
    severity: 6,
    resolution: {
      type: "balanced_dosage",
      description: "Maintenir un ratio zinc:cuivre approprié (8-15:1)",
      implementationSteps: [
        "Si vous prenez plus de 30mg de zinc quotidiennement, assurez-vous d'avoir 2-3mg de cuivre",
        "Préférer les formules combinées zinc-cuivre avec un ratio approprié"
      ]
    }
  },
  
  // Conflit entre oméga-3 et anticoagulants
  {
    supplements: ["omega3", "vitamin_e"],
    conflictType: ConflictType.MECHANISM_CONFLICT,
    description: "Les acides gras oméga-3 et la vitamine E ont tous deux des effets anticoagulants qui peuvent s'additionner, augmentant potentiellement le risque de saignement.",
    severity: 5,
    resolution: {
      type: "dosage_adjustment",
      description: "Surveiller les signes de saignement et ajuster les dosages",
      implementationSteps: [
        "Limiter la dose combinée d'oméga-3 à 3g par jour",
        "Maintenir la vitamine E sous 400 UI quotidiennement",
        "Consulter un professionnel de santé avant une intervention chirurgicale"
      ]
    }
  }
];

/**
 * Identifie et résout les conflits potentiels entre synergies
 * @param supplementIds Liste des IDs de suppléments
 * @returns Conflits identifiés et leurs résolutions
 */
export function identifyAndResolveSynergyConflicts(supplementIds: string[]): SynergyConflict[] {
  // Initialiser le résultat
  const conflicts: SynergyConflict[] = [];
  
  // Génerer la matrice de synergies
  const synergyMatrix = generateSynergyMatrix(supplementIds);
  
  // Vérifier les conflits connus
  for (const rule of KNOWN_CONFLICT_RULES) {
    const matchingSupplements = supplementIds.filter(id => 
      rule.supplements.includes(id) ||
      rule.supplements.some(s => id.includes(s) || s.includes(id))
    );
    
    // Si au moins deux suppléments correspondent à la règle de conflit
    if (matchingSupplements.length >= 2) {
      const conflict: SynergyConflict = {
        supplements: matchingSupplements,
        conflictType: rule.conflictType,
        description: rule.description,
        severity: rule.severity,
        resolution: rule.resolution
      };
      
      // Ajouter des alternatives si disponibles
      if (rule.alternativesFunction) {
        const alternatives = rule.alternativesFunction(matchingSupplements);
        if (alternatives) {
          conflict.alternatives = {
            supplements: alternatives,
            rationale: "Alternatives suggérées pour réduire les conflits d'interaction"
          };
        }
      }
      
      conflicts.push(conflict);
    }
  }
  
  // Détecter les conflits de timing
  const timingConflicts = detectTimingConflicts(supplementIds);
  conflicts.push(...timingConflicts);
  
  return conflicts;
}

/**
 * Détecte les conflits de timing entre suppléments
 * @param supplementIds Liste des IDs de suppléments
 * @returns Conflits de timing identifiés
 */
function detectTimingConflicts(supplementIds: string[]): SynergyConflict[] {
  const conflicts: SynergyConflict[] = [];
  const timingGroups: Record<string, string[]> = {
    morning: [],
    midday: [],
    evening: [],
    withFood: [],
    empty: []
  };
  
  // Répartir les suppléments dans des groupes de timing
  for (const suppId of supplementIds) {
    const supplement = SUPPLEMENT_SYNERGIES
      .flatMap(syn => [syn.supplementPair[0], syn.supplementPair[1]])
      .includes(suppId);
    
    // Simplification pour la démonstration - utilisation de règles générales
    if (["vitamin_b12", "vitamin_b", "iron"].includes(suppId)) {
      timingGroups.morning.push(suppId);
      timingGroups.empty.push(suppId);
    } else if (["calcium", "magnesium"].includes(suppId)) {
      timingGroups.evening.push(suppId);
      timingGroups.withFood.push(suppId);
    } else if (["vitamin_c", "zinc"].includes(suppId)) {
      timingGroups.midday.push(suppId);
    } else if (["melatonin", "l_theanine"].includes(suppId)) {
      timingGroups.evening.push(suppId);
    }
  }
  
  // Vérifier les conflits entre 'à jeun' et 'avec nourriture'
  if (timingGroups.empty.length > 0 && timingGroups.withFood.length > 0) {
    const overlapSupplements = timingGroups.empty.filter(supp => 
      timingGroups.withFood.includes(supp)
    );
    
    if (overlapSupplements.length > 0) {
      conflicts.push({
        supplements: [...timingGroups.empty, ...timingGroups.withFood],
        conflictType: ConflictType.TIMING_CONFLICT,
        description: `Certains suppléments doivent être pris à jeun (${timingGroups.empty.join(', ')}) alors que d'autres nécessitent d'être pris avec de la nourriture (${timingGroups.withFood.join(', ')}).`,
        severity: 6,
        resolution: {
          type: "timing_optimization",
          description: "Organisation temporelle optimisée des prises",
          implementationSteps: [
            "Prendre les suppléments à jeun le matin",
            "Prendre les suppléments avec nourriture au déjeuner ou au dîner",
            "Maintenir un intervalle d'au moins 2 heures entre les groupes"
          ]
        }
      });
    }
  }
  
  return conflicts;
}

/**
 * Génère un plan de prise optimisé tenant compte des interactions synergiques et des conflits
 * @param supplementIds Liste des IDs de suppléments
 * @returns Plan de prise optimisé
 */
export function generateOptimizedIntakePlan(supplementIds: string[]): {
  timingGroups: Record<string, string[]>;
  instructions: string[];
  specialNotes: Record<string, string>;
} {
  // Identifier les conflits
  const conflicts = identifyAndResolveSynergyConflicts(supplementIds);
  
  // Créer des groupes de timing initiaux basés sur les règles générales
  const timingGroups: Record<string, string[]> = {
    morningEmpty: [],  // Matin à jeun
    morningMeal: [],   // Matin avec repas
    middayMeal: [],    // Midi avec repas
    eveningMeal: [],   // Soir avec repas
    bedtime: []        // Avant le coucher
  };
  
  // Instructions spéciales par supplément
  const specialNotes: Record<string, string> = {};
  
  // Répartir les suppléments dans les groupes en fonction des règles standards
  for (const suppId of supplementIds) {
    // Règles de répartition par défaut
    if (["vitamin_b12", "vitamin_b", "iron"].includes(suppId)) {
      timingGroups.morningEmpty.push(suppId);
    } else if (["vitamin_d", "vitamin_c", "multivitamin"].includes(suppId)) {
      timingGroups.morningMeal.push(suppId);
    } else if (["zinc", "probiotics"].includes(suppId)) {
      timingGroups.middayMeal.push(suppId);
    } else if (["calcium", "magnesium"].includes(suppId)) {
      timingGroups.eveningMeal.push(suppId);
    } else if (["melatonin", "l_theanine"].includes(suppId)) {
      timingGroups.bedtime.push(suppId);
    } else {
      // Répartition par défaut si pas de règle spécifique
      timingGroups.middayMeal.push(suppId);
    }
  }
  
  // Appliquer les ajustements basés sur les conflits identifiés
  for (const conflict of conflicts) {
    if (conflict.conflictType === ConflictType.ABSORPTION_COMPETITION) {
      // Séparation des suppléments en conflit d'absorption
      const [supp1, supp2] = conflict.supplements;
      
      // Si les deux suppléments sont dans le même groupe, déplacer le second
      for (const group in timingGroups) {
        if (timingGroups[group].includes(supp1) && timingGroups[group].includes(supp2)) {
          // Déplacer le second supplément vers un groupe plus éloigné dans le temps
          timingGroups[group] = timingGroups[group].filter(s => s !== supp2);
          
          if (group === 'morningEmpty' || group === 'morningMeal') {
            timingGroups.eveningMeal.push(supp2);
          } else {
            timingGroups.morningMeal.push(supp2);
          }
          
          // Ajouter une note spéciale
          specialNotes[supp2] = `Séparé de ${supp1} pour éviter une compétition pour l'absorption`;
        }
      }
    }
  }
  
  // Générer des instructions à partir du plan
  const instructions: string[] = [
    "Matin à jeun (30 minutes avant le petit-déjeuner) : " + (timingGroups.morningEmpty.length > 0 ? timingGroups.morningEmpty.join(', ') : "Aucun supplément"),
    "Matin avec petit-déjeuner : " + (timingGroups.morningMeal.length > 0 ? timingGroups.morningMeal.join(', ') : "Aucun supplément"),
    "Midi avec repas : " + (timingGroups.middayMeal.length > 0 ? timingGroups.middayMeal.join(', ') : "Aucun supplément"),
    "Soir avec repas : " + (timingGroups.eveningMeal.length > 0 ? timingGroups.eveningMeal.join(', ') : "Aucun supplément"),
    "Avant le coucher : " + (timingGroups.bedtime.length > 0 ? timingGroups.bedtime.join(', ') : "Aucun supplément")
  ];
  
  return {
    timingGroups,
    instructions,
    specialNotes
  };
}

/**
 * Analyse les combinaisons synergiques optimales pour atteindre un objectif spécifique
 * @param targetObjective Objectif à atteindre
 * @param availableSupplements Suppléments disponibles
 * @returns Combinaisons optimales avec scores d'efficacité
 */
export function analyzeSynergyForObjective(
  targetObjective: string,
  availableSupplements: string[]
): Array<{
  combination: string[];
  efficacyScore: number;
  synergisticEffect: number;
  scientificEvidence: string;
}> {
  // Résultat par défaut
  const results: Array<{
    combination: string[];
    efficacyScore: number;
    synergisticEffect: number;
    scientificEvidence: string;
  }> = [];
  
  // Objectifs et conditions associées
  const objectiveConditions: Record<string, string[]> = {
    "Améliorer le sommeil": ["Insomnia", "Sleep quality", "Sleep latency"],
    "Réduire le stress": ["Stress", "Anxiety", "Cortisol levels"],
    "Améliorer l'immunité": ["Immune function", "Cold and flu", "Respiratory health"],
    "Améliorer la cognition": ["Cognitive function", "Memory", "Focus"],
    "Supporter la santé cardiovasculaire": ["Cardiovascular health", "Blood pressure", "Cholesterol"],
    "Réduire l'inflammation": ["Inflammation", "Joint pain", "Systemic inflammation"]
  };
  
  // Conditions associées à l'objectif ciblé
  const relatedConditions = objectiveConditions[targetObjective] || [];
  
  // Trouver les suppléments efficaces pour ces conditions
  const relevantSupplements = availableSupplements.filter(supp => {
    // Trouver les synergies impliquant ce supplément
    const synergies = SUPPLEMENT_SYNERGIES.filter(syn => 
      syn.supplementPair[0] === supp || syn.supplementPair[1] === supp
    );
    
    // Vérifier si les synergies ciblent les conditions associées à l'objectif
    return synergies.some(syn => 
      syn.targetConditions.some(cond => 
        relatedConditions.some(rc => cond.toLowerCase().includes(rc.toLowerCase()))
      )
    );
  });
  
  // Générer toutes les combinaisons possibles de 2 à 3 suppléments
  const combinations = generateCombinations(relevantSupplements, 3);
  
  // Évaluer chaque combinaison
  for (const combination of combinations) {
    // Si la combinaison contient au moins 2 suppléments
    if (combination.length >= 2) {
      // Calculer l'efficacité de la combinaison pour l'objectif
      const efficacyData = calculateCombinationEfficacy(combination, relatedConditions);
      
      // Si l'efficacité est significative
      if (efficacyData.efficacyScore > 0) {
        results.push({
          combination,
          efficacyScore: efficacyData.efficacyScore,
          synergisticEffect: efficacyData.synergisticEffect,
          scientificEvidence: efficacyData.scientificEvidence
        });
      }
    }
  }
  
  // Trier par score d'efficacité décroissant
  return results.sort((a, b) => b.efficacyScore - a.efficacyScore);
}

/**
 * Génère toutes les combinaisons possibles de suppléments jusqu'à un certain nombre
 * @param supplements Liste des suppléments disponibles
 * @param maxSize Taille maximale des combinaisons
 * @returns Toutes les combinaisons possibles
 */
function generateCombinations(supplements: string[], maxSize: number): string[][] {
  const result: string[][] = [];
  
  // Combinaisons de taille 2
  for (let i = 0; i < supplements.length; i++) {
    for (let j = i + 1; j < supplements.length; j++) {
      result.push([supplements[i], supplements[j]]);
    }
  }
  
  // Si maxSize > 2, ajouter des combinaisons de taille 3
  if (maxSize > 2) {
    for (let i = 0; i < supplements.length; i++) {
      for (let j = i + 1; j < supplements.length; j++) {
        for (let k = j + 1; k < supplements.length; k++) {
          result.push([supplements[i], supplements[j], supplements[k]]);
        }
      }
    }
  }
  
  return result;
}

/**
 * Calcule l'efficacité d'une combinaison de suppléments pour des conditions ciblées
 * @param combination Combinaison de suppléments
 * @param targetConditions Conditions ciblées
 * @returns Score d'efficacité et effet synergique
 */
function calculateCombinationEfficacy(
  combination: string[],
  targetConditions: string[]
): {
  efficacyScore: number;
  synergisticEffect: number;
  scientificEvidence: string;
} {
  let baseScore = 0;
  let synergisticEffect = 1.0;
  let evidenceLevel = 'insufficient';
  
  // Calculer le score de base pour chaque paire de suppléments
  for (let i = 0; i < combination.length; i++) {
    for (let j = i + 1; j < combination.length; j++) {
      const supp1 = combination[i];
      const supp2 = combination[j];
      
      // Rechercher les synergies entre ces suppléments
      const synergy = SUPPLEMENT_SYNERGIES.find(syn => 
        (syn.supplementPair[0] === supp1 && syn.supplementPair[1] === supp2) ||
        (syn.supplementPair[0] === supp2 && syn.supplementPair[1] === supp1)
      );
      
      if (synergy) {
        // Calculer la pertinence pour les conditions ciblées
        const targetRelevance = synergy.targetConditions.filter(cond => 
          targetConditions.some(tc => cond.toLowerCase().includes(tc.toLowerCase()))
        ).length / Math.max(1, targetConditions.length);
        
        // Calculer le score pour cette paire
        const pairScore = (synergy.synergisticEffect - 1) * 
                          targetRelevance * 
                          getEvidenceLevelMultiplier(synergy.scientificEvidence.level);
        
        baseScore += pairScore;
        
        // Mettre à jour l'effet synergique global
        if (targetRelevance > 0) {
          synergisticEffect *= (1 + (synergy.synergisticEffect - 1) * targetRelevance * 0.5);
        }
        
        // Mettre à jour le niveau d'évidence
        evidenceLevel = updateEvidenceLevel(evidenceLevel, synergy.scientificEvidence.level);
      }
    }
  }
  
  // Normaliser le score d'efficacité (0-100)
  const normalizedScore = Math.min(100, Math.round(baseScore * 100));
  
  // Limiter l'effet synergique à une valeur réaliste
  synergisticEffect = Math.min(2.0, synergisticEffect);
  
  return {
    efficacyScore: normalizedScore,
    synergisticEffect: Number(synergisticEffect.toFixed(2)),
    scientificEvidence: evidenceLevel
  };
}

/**
 * Obtient le multiplicateur pour un niveau de preuve scientifique
 * @param evidenceLevel Niveau de preuve
 * @returns Multiplicateur correspondant
 */
function getEvidenceLevelMultiplier(evidenceLevel: string): number {
  switch (evidenceLevel) {
    case 'strong':
      return 1.0;
    case 'moderate':
      return 0.7;
    case 'limited':
      return 0.4;
    case 'theoretical':
    default:
      return 0.2;
  }
}

/**
 * Met à jour le niveau d'évidence global en fonction d'un nouveau niveau
 * @param currentLevel Niveau d'évidence actuel
 * @param newLevel Nouveau niveau d'évidence
 * @returns Niveau d'évidence mis à jour
 */
function updateEvidenceLevel(currentLevel: string, newLevel: string): string {
  const levels = ['insufficient', 'theoretical', 'limited', 'moderate', 'strong'];
  const currentIndex = levels.indexOf(currentLevel);
  const newIndex = levels.indexOf(newLevel);
  
  // Si le nouveau niveau est plus élevé, le conserver
  if (newIndex > currentIndex) {
    return newLevel;
  }
  
  // Sinon, garder le niveau actuel
  return currentLevel;
}