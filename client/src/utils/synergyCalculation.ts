/**
 * Système avancé de calcul des synergies médicinales
 * Implémente des algorithmes sophistiqués pour quantifier les effets synergiques
 */

import { SynergyCategory, SynergyRecord, SynergyNode, SynergyLink, SynergyGraph } from '@/utils/synergyTypes';
import { SYNERGY_PAIRS, getSynergyBetween } from '@/data/supplementSynergies';
import { getSupplement } from '@/data/supplementDatabase';

/**
 * Calcule un score de synergie composé en considérant toutes les interactions entre suppléments
 * @param supplementIds Liste des IDs des suppléments à analyser
 * @returns Score de synergie global (0-1)
 */
export function calculateCompoundSynergyScore(supplementIds: string[]): number {
  if (supplementIds.length <= 1) return 0;
  
  // Nombre total de paires possibles
  const totalPossiblePairs = (supplementIds.length * (supplementIds.length - 1)) / 2;
  
  // Nombre de synergies détectées et leur score cumulé
  let detectedSynergies = 0;
  let cumulativeScore = 0;
  
  // Calculer le score pour chaque paire possible
  for (let i = 0; i < supplementIds.length; i++) {
    for (let j = i + 1; j < supplementIds.length; j++) {
      const synergy = getSynergyBetween(supplementIds[i], supplementIds[j]);
      
      if (synergy) {
        detectedSynergies++;
        cumulativeScore += synergy.synergyScore;
      }
    }
  }
  
  // Facteur de densité du réseau (% de synergies détectées sur le total possible)
  const networkDensity = detectedSynergies / totalPossiblePairs;
  
  // Score moyen des synergies détectées
  const averageSynergyScore = detectedSynergies > 0 ? cumulativeScore / detectedSynergies : 0;
  
  // Facteur d'amplification basé sur la densité du réseau
  // Plus la densité est élevée, plus l'effet global est amplifié
  const amplificationFactor = Math.sqrt(networkDensity) * 1.5;
  
  // Calcul du score final
  // Formule: score moyen de synergie * (1 + facteur d'amplification)
  return averageSynergyScore * (1 + amplificationFactor);
}

/**
 * Génère un graphe de réseau de synergies pour visualisation
 * @param supplementIds Liste des IDs des suppléments
 * @returns Structure de graphe avec nœuds et liens pour visualisation
 */
export function generateSynergyGraph(supplementIds: string[]): SynergyGraph {
  // Créer les nœuds du graphe
  const nodes: SynergyNode[] = supplementIds.map(id => {
    const supplement = getSupplement(id);
    return {
      id,
      name: supplement ? supplement.name : id,
      strength: calculateSupplementCentrality(id, supplementIds),
      category: supplement ? supplement.category : undefined
    };
  });
  
  // Créer les liens entre les nœuds
  const links: SynergyLink[] = [];
  
  for (let i = 0; i < supplementIds.length; i++) {
    for (let j = i + 1; j < supplementIds.length; j++) {
      const synergy = getSynergyBetween(supplementIds[i], supplementIds[j]);
      
      if (synergy) {
        links.push({
          source: supplementIds[i],
          target: supplementIds[j],
          strength: synergy.synergyScore,
          effect: 'synergistic', // Pourrait être 'antagonistic' ou 'neutral' dans une version future
          mechanism: synergy.category
        });
      }
    }
  }
  
  return { nodes, links };
}

/**
 * Calcule la centralité d'un supplément dans le réseau de synergies
 * Plus un supplément a d'interactions fortes avec d'autres suppléments, plus sa centralité est élevée
 * @param supplementId ID du supplément à analyser
 * @param allSupplementIds Tous les IDs des suppléments dans le réseau
 * @returns Score de centralité (0-1)
 */
function calculateSupplementCentrality(supplementId: string, allSupplementIds: string[]): number {
  const otherSupplements = allSupplementIds.filter(id => id !== supplementId);
  
  if (otherSupplements.length === 0) return 0;
  
  let totalSynergyScore = 0;
  let synergyCount = 0;
  
  // Examiner toutes les synergies possibles avec ce supplément
  otherSupplements.forEach(otherId => {
    const synergy = getSynergyBetween(supplementId, otherId);
    if (synergy) {
      totalSynergyScore += synergy.synergyScore;
      synergyCount++;
    }
  });
  
  // Score moyen des synergies
  const averageSynergyScore = synergyCount > 0 ? totalSynergyScore / synergyCount : 0;
  
  // Ratio de connexion (nombre de synergies / nombre total possible)
  const connectionRatio = synergyCount / otherSupplements.length;
  
  // Formule de centralité: moyenne pondérée du score moyen et du ratio de connexion
  return (averageSynergyScore * 0.7) + (connectionRatio * 0.3);
}

/**
 * Calcule l'impact des synergies sur un symptôme spécifique
 * @param symptom Symptôme à évaluer
 * @param supplementIds Liste des IDs des suppléments
 * @returns Score d'impact (0-1)
 */
export function calculateSymptomSynergyImpact(symptom: string, supplementIds: string[]): number {
  // Identifier les suppléments qui ciblent ce symptôme
  const targetingSupplements = supplementIds.filter(id => {
    const supplement = getSupplement(id);
    return supplement && (
      supplement.primaryBenefits.some(b => b.toLowerCase().includes(symptom.toLowerCase())) ||
      supplement.secondaryBenefits.some(b => b.toLowerCase().includes(symptom.toLowerCase()))
    );
  });
  
  if (targetingSupplements.length <= 1) {
    return targetingSupplements.length === 1 ? 0.4 : 0; // Effet de base d'un seul supplément
  }
  
  // Calculer les synergies entre les suppléments ciblant le symptôme
  const synergyScore = calculateCompoundSynergyScore(targetingSupplements);
  
  // Appliquer une formule d'efficacité: base + bonus synergique
  return Math.min(0.4 + (synergyScore * 0.6), 1.0);
}

/**
 * Calcule l'ordre optimal de prise des suppléments pour maximiser les synergies
 * @param supplementIds Liste des IDs des suppléments
 * @returns Structure d'horaire optimisé
 */
export function calculateOptimalIntakeSchedule(supplementIds: string[]): {
  morning: string[];
  afternoon: string[];
  evening: string[];
  recommendations: Record<string, string>;
} {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];
  const recommendations: Record<string, string> = {};
  
  // Pour chaque supplément, déterminer le moment optimal de prise
  supplementIds.forEach(id => {
    const supplement = getSupplement(id);
    
    if (!supplement) {
      // Par défaut, placer dans l'après-midi si info non disponible
      afternoon.push(id);
      recommendations[id] = "Prendre avec un repas pour une meilleure absorption";
      return;
    }
    
    // Déterminer le meilleur moment basé sur le type de supplément et les synergies
    if (supplement.absorptionFactors.fatSoluble) {
      // Les suppléments liposolubles sont mieux absorbés avec des repas
      // Vérifier s'il y a des facteurs spécifiques d'optimisation
      const synergies = supplementIds
        .filter(otherId => otherId !== id)
        .map(otherId => getSynergyBetween(id, otherId))
        .filter(s => s !== undefined) as SynergyRecord[];
      
      if (synergies.some(s => s.category === "metabolism" || s.subCategory === "metabolicActivation")) {
        // Les activateurs métaboliques sont généralement mieux le matin
        morning.push(id);
        recommendations[id] = "Prendre au petit-déjeuner pour optimiser les effets métaboliques";
      } else if (synergies.some(s => s.category === "protection")) {
        // Les protecteurs peuvent être répartis dans la journée
        afternoon.push(id);
        recommendations[id] = "Prendre au déjeuner avec des graisses saines pour une absorption optimale";
      } else {
        // Par défaut, suppléments liposolubles au repas du soir
        evening.push(id);
        recommendations[id] = "Prendre au dîner pour maximiser l'absorption par les graisses alimentaires";
      }
    } else if (supplement.category === "amino" || supplement.id === "nac") {
      // Les acides aminés sont généralement mieux absorbés à jeun
      morning.push(id);
      recommendations[id] = "Prendre à jeun, 30 minutes avant le petit-déjeuner";
    } else if (supplement.category === "vitamin" && supplement.absorptionFactors.waterSoluble) {
      // Vitamines hydrosolubles: répartir dans la journée
      if (morning.length <= evening.length) {
        morning.push(id);
        recommendations[id] = "Prendre au petit-déjeuner pour maintenir les niveaux tout au long de la journée";
      } else {
        evening.push(id);
        recommendations[id] = "Prendre au dîner pour maintenir les niveaux pendant la nuit";
      }
    } else {
      // Pour les autres suppléments, répartir équitablement
      const minGroupSize = Math.min(morning.length, afternoon.length, evening.length);
      if (morning.length === minGroupSize) {
        morning.push(id);
        recommendations[id] = "Prendre au petit-déjeuner";
      } else if (afternoon.length === minGroupSize) {
        afternoon.push(id);
        recommendations[id] = "Prendre au déjeuner";
      } else {
        evening.push(id);
        recommendations[id] = "Prendre au dîner";
      }
    }
  });
  
  // Appliquer des ajustements basés sur les interactions connues
  // (exemple simplifié - pourrait être beaucoup plus complexe dans une version complète)
  supplementIds.forEach(id => {
    const conflicts = supplementIds.filter(otherId => {
      const synergy = getSynergyBetween(id, otherId);
      return synergy && synergy.optimizationStrategy.timing?.includes("distance");
    });
    
    if (conflicts.length > 0) {
      const idMoment = morning.includes(id) ? "morning" : 
                      afternoon.includes(id) ? "afternoon" : "evening";
      
      conflicts.forEach(conflictId => {
        const conflictMoment = morning.includes(conflictId) ? "morning" : 
                             afternoon.includes(conflictId) ? "afternoon" : "evening";
        
        if (idMoment === conflictMoment) {
          // Déplacer le conflit si possible
          const alternativeMoment = ["morning", "afternoon", "evening"].find(m => 
            m !== idMoment && m !== conflictMoment
          );
          
          if (alternativeMoment === "morning") {
            morning.push(conflictId);
            afternoon.splice(afternoon.indexOf(conflictId), 1);
            evening.splice(evening.indexOf(conflictId), 1);
          } else if (alternativeMoment === "afternoon") {
            afternoon.push(conflictId);
            morning.splice(morning.indexOf(conflictId), 1);
            evening.splice(evening.indexOf(conflictId), 1);
          } else {
            evening.push(conflictId);
            morning.splice(morning.indexOf(conflictId), 1);
            afternoon.splice(afternoon.indexOf(conflictId), 1);
          }
          
          recommendations[conflictId] = `Prendre séparément de ${getSupplement(id)?.name || id} pour éviter les interférences`;
        }
      });
    }
  });
  
  return { morning, afternoon, evening, recommendations };
}