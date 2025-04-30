/**
 * Matrice de synergies avancée pour modéliser les interactions entre suppléments
 * Permet de visualiser et analyser le réseau complet de synergies médicinales
 */

import { SupplementSynergy } from "./synergyTypes";
import { SUPPLEMENT_SYNERGIES } from "../data/supplementSynergies";

/**
 * Interface pour une cellule de la matrice de synergies
 */
export interface SynergyMatrixCell {
  supplement1: string;
  supplement2: string;
  synergyEffect: number;       // Multiplicateur d'effet (1.0 = pas d'effet, 2.0 = effet doublé)
  synergyMechanism: string;    // Mécanisme principal de synergie
  evidenceLevel: string;       // Niveau de preuve scientifique
  adverseInteraction: boolean; // Indique si l'interaction peut être négative dans certains cas
  optimalTiming: string;       // Timing optimal pour maximiser la synergie
}

/**
 * Interface pour la matrice de synergies complète
 */
export interface SynergyMatrix {
  supplements: string[];       // Liste des suppléments dans la matrice
  cells: SynergyMatrixCell[];  // Cellules représentant les interactions entre suppléments
}

/**
 * Génère une matrice de synergies à partir d'une liste de suppléments
 * @param supplementIds Liste des IDs de suppléments à inclure dans la matrice
 * @returns Matrice de synergies complète
 */
export function generateSynergyMatrix(supplementIds: string[]): SynergyMatrix {
  // Filtrer les IDs de suppléments uniques
  const uniqueSupplements = Array.from(new Set(supplementIds));
  
  // Initialiser les cellules de la matrice
  const cells: SynergyMatrixCell[] = [];
  
  // Remplir la matrice avec les données de synergie connues
  for (let i = 0; i < uniqueSupplements.length; i++) {
    for (let j = i + 1; j < uniqueSupplements.length; j++) {
      const supp1 = uniqueSupplements[i];
      const supp2 = uniqueSupplements[j];
      
      // Rechercher une synergie existante entre ces suppléments
      const existingSynergy = findSynergyBetweenSupplements(supp1, supp2);
      
      if (existingSynergy) {
        // Ajouter une cellule avec les données de synergie
        cells.push({
          supplement1: supp1,
          supplement2: supp2,
          synergyEffect: existingSynergy.synergisticEffect,
          synergyMechanism: existingSynergy.primaryMechanism,
          evidenceLevel: existingSynergy.scientificEvidence.level,
          adverseInteraction: false, // Par défaut, on suppose qu'il n'y a pas d'interaction négative
          optimalTiming: existingSynergy.optimalTiming.relativeIntake
        });
      } else {
        // Ajouter une cellule avec des valeurs neutres (pas d'interaction connue)
        cells.push({
          supplement1: supp1,
          supplement2: supp2,
          synergyEffect: 1.0, // Aucun effet synergique
          synergyMechanism: "neutral",
          evidenceLevel: "none",
          adverseInteraction: false,
          optimalTiming: "any"
        });
      }
    }
  }
  
  return {
    supplements: uniqueSupplements,
    cells
  };
}

/**
 * Recherche une synergie entre deux suppléments dans la base de données
 * @param supp1 Premier supplément
 * @param supp2 Second supplément
 * @returns Données de synergie si trouvées, sinon undefined
 */
function findSynergyBetweenSupplements(supp1: string, supp2: string): SupplementSynergy | undefined {
  return SUPPLEMENT_SYNERGIES.find(syn => 
    (syn.supplementPair[0] === supp1 && syn.supplementPair[1] === supp2) ||
    (syn.supplementPair[0] === supp2 && syn.supplementPair[1] === supp1)
  );
}

/**
 * Récupère les interactions synergiques pour un supplément spécifique
 * @param supplementId ID du supplément
 * @param matrix Matrice de synergies
 * @returns Cellules de la matrice concernant ce supplément
 */
export function getSynergyInteractionsForSupplement(supplementId: string, matrix: SynergyMatrix): SynergyMatrixCell[] {
  return matrix.cells.filter(cell => 
    cell.supplement1 === supplementId || cell.supplement2 === supplementId
  );
}

/**
 * Calcule le score de centralité d'un supplément dans le réseau de synergies
 * Indique l'importance du supplément dans le réseau global
 * @param supplementId ID du supplément
 * @param matrix Matrice de synergies
 * @returns Score de centralité (plus élevé = plus central)
 */
export function calculateCentralityScore(supplementId: string, matrix: SynergyMatrix): number {
  const interactions = getSynergyInteractionsForSupplement(supplementId, matrix);
  
  // Si aucune interaction, retourner 0
  if (interactions.length === 0) return 0;
  
  // Calculer la somme des effets synergiques
  const synergySum = interactions.reduce((sum, cell) => {
    // Convertir l'effet multiplicateur en bonus (1.5 devient 0.5)
    const synergyBonus = cell.synergyEffect - 1;
    return sum + synergyBonus;
  }, 0);
  
  // Normaliser par le nombre d'interactions possibles
  const possibleInteractions = matrix.supplements.length - 1;
  
  // Retourner le score normalisé
  return synergySum / possibleInteractions;
}

/**
 * Identifie les clusters de suppléments fortement synergiques
 * @param matrix Matrice de synergies
 * @param threshold Seuil d'effet synergique à considérer comme significatif
 * @returns Clusters de suppléments synergiques
 */
export function identifySynergyClusters(matrix: SynergyMatrix, threshold: number = 1.2): string[][] {
  // Initialiser les clusters avec chaque supplément dans son propre cluster
  const clusters: Set<string>[] = matrix.supplements.map(supp => new Set([supp]));
  
  // Trier les cellules par effet synergique décroissant
  const sortedCells = [...matrix.cells].sort((a, b) => b.synergyEffect - a.synergyEffect);
  
  // Pour chaque cellule avec un effet synergique significatif
  for (const cell of sortedCells) {
    if (cell.synergyEffect >= threshold) {
      const supp1 = cell.supplement1;
      const supp2 = cell.supplement2;
      
      // Trouver les clusters contenant ces suppléments
      const cluster1Index = clusters.findIndex(cluster => cluster.has(supp1));
      const cluster2Index = clusters.findIndex(cluster => cluster.has(supp2));
      
      // Si les suppléments sont dans des clusters différents, les fusionner
      if (cluster1Index !== -1 && cluster2Index !== -1 && cluster1Index !== cluster2Index) {
        // Fusionner cluster2 dans cluster1
        Array.from(clusters[cluster2Index]).forEach(supp => {
          clusters[cluster1Index].add(supp);
        });
        // Supprimer cluster2
        clusters.splice(cluster2Index, 1);
      }
    }
  }
  
  // Convertir les Sets en arrays
  return clusters.map(cluster => [...Array.from(cluster)]);
}

/**
 * Génère un plan optimal de prise de suppléments basé sur les synergies et les timings
 * @param matrix Matrice de synergies
 * @returns Plan de prise organisé en groupes de timing
 */
export function generateOptimalSupplementationSchedule(matrix: SynergyMatrix): {
  morningGroup: string[];
  middayGroup: string[];
  eveningGroup: string[];
  separatedSupplements: Array<{supplement: string, reason: string}>;
} {
  // Initialiser les groupes
  const morningGroup: string[] = [];
  const middayGroup: string[] = [];
  const eveningGroup: string[] = [];
  const separatedSupplements: Array<{supplement: string, reason: string}> = [];
  
  // Déterminer le moment optimal pour chaque supplément
  for (const supp of matrix.supplements) {
    // Récupérer toutes les interactions pour ce supplément
    const interactions = getSynergyInteractionsForSupplement(supp, matrix);
    
    // Compter les types de timing requis
    let sameTimeCount = 0;
    let separateCount = 0;
    let separateWith: string[] = [];
    
    for (const cell of interactions) {
      const otherSupp = cell.supplement1 === supp ? cell.supplement2 : cell.supplement1;
      
      if (cell.synergyEffect > 1.1) {
        // Synergie significative
        if (cell.optimalTiming === 'same_time') {
          sameTimeCount++;
        } else if (cell.optimalTiming === 'separate') {
          separateCount++;
          separateWith.push(otherSupp);
        }
      }
    }
    
    // Décider du groupe en fonction des comptages
    if (separateCount > sameTimeCount) {
      // Ce supplément doit être pris séparément
      separatedSupplements.push({
        supplement: supp,
        reason: `Doit être séparé de ${separateWith.join(', ')} pour éviter des interactions sous-optimales`
      });
    } else {
      // Assigner à un groupe selon l'heure optimale
      // Logique simplifiée: répartition équilibrée
      const groupIndex = (matrix.supplements.indexOf(supp) % 3);
      
      if (groupIndex === 0) morningGroup.push(supp);
      else if (groupIndex === 1) middayGroup.push(supp);
      else eveningGroup.push(supp);
    }
  }
  
  return {
    morningGroup,
    middayGroup,
    eveningGroup,
    separatedSupplements
  };
}

/**
 * Détermine la complémentarité entre deux suppléments (%)
 * @param supp1 Premier supplément
 * @param supp2 Second supplément
 * @returns Score de complémentarité (0-100%)
 */
export function calculateComplementarityScore(supp1: string, supp2: string): number {
  const synergy = findSynergyBetweenSupplements(supp1, supp2);
  
  if (!synergy) return 0;
  
  // Convertir l'effet synergique en pourcentage
  const synergyPercent = (synergy.synergisticEffect - 1) * 100;
  
  // Ajuster selon le niveau de preuve
  const evidenceMultiplier = {
    'strong': 1.0,
    'moderate': 0.8,
    'limited': 0.6,
    'theoretical': 0.4
  }[synergy.scientificEvidence.level] || 0.5;
  
  return Math.round(synergyPercent * evidenceMultiplier);
}