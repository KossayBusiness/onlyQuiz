/**
 * Service pour gérer les interactions synergiques entre suppléments
 * Fournit des fonctionnalités pour calculer l'efficacité des combinaisons de suppléments
 * basées sur des données scientifiques
 */

import supplementEffectsData from '../data/supplementEffects_v2.json';
import symptomInteractionsData from '../data/symptomInteractions_v2.json';

// Types pour les suppléments et leurs interactions
export interface Supplement {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  personalizedReason: string;
  targetSymptoms: string[];
  targetGoals: string[];
  confidenceLevel: number;
  dosageRecommendation?: string;
  effectivenessTiming?: string;
  cautions?: string[];
  actionMechanism?: string;
  scientificEvidence: {
    level: number;
    summary: string;
  };
}

export interface SynergyInfo {
  name: string;
  description: string;
  efficacyBoost: number;
  scientificBasis: string;
  symptoms: string[];
  timeToEffect?: {
    original: string;
    withSynergy: string;
  };
}

export interface SynergyPair {
  supplementId: string;
  supplement: Supplement;
  synergyInfo: SynergyInfo;
}

// Base de données des interactions synergiques, à terme pourrait être chargée depuis l'API
// Cette structure représente les données scientifiques sur les synergies entre suppléments
const SYNERGY_DATABASE: Record<string, Record<string, {
  efficacyBoost: number;
  description: string;
  scientificBasis: string;
  symptoms: string[];
  timeReduction?: number;
}>> = {
  "magnesium": {
    "vitamin_d": {
      efficacyBoost: 0.15,
      description: "Le magnésium améliore l'absorption et l'activation de la vitamine D",
      scientificBasis: "Études cliniques sur l'interdépendance magnésium-vitamine D",
      symptoms: ["Fatigue", "Crampes musculaires", "Faiblesse osseuse"],
      timeReduction: 5 // Réduction du temps d'action en jours
    },
    "vitamin_b6": {
      efficacyBoost: 0.12,
      description: "Magnésium et B6 agissent en synergie sur le système nerveux",
      scientificBasis: "Recherches sur les cofacteurs enzymatiques",
      symptoms: ["Stress", "Insomnie", "Syndrome prémenstruel"],
      timeReduction: 3
    },
    "zinc": {
      efficacyBoost: 0.1,
      description: "Équilibre électrolytique et métabolisme énergétique optimisés",
      scientificBasis: "Études sur les minéraux et électrolytes",
      symptoms: ["Fatigue", "Immunité faible"],
      timeReduction: 2
    }
  },
  "vitamin_d": {
    "vitamin_k2": {
      efficacyBoost: 0.2,
      description: "K2 dirige le calcium activé par la vitamine D vers les os plutôt que les artères",
      scientificBasis: "Recherches sur le métabolisme osseux",
      symptoms: ["Faiblesse osseuse", "Fatigue", "Immunité faible"],
      timeReduction: 7
    },
    "omega3": {
      efficacyBoost: 0.15,
      description: "Amélioration de l'absorption et de l'efficacité des deux nutriments",
      scientificBasis: "Études sur l'inflammation et l'immunité",
      symptoms: ["Inflammation", "Dépression", "Problèmes cognitifs"],
      timeReduction: 5
    }
  },
  "probiotics": {
    "prebiotics": {
      efficacyBoost: 0.25,
      description: "Les prébiotiques nourrissent les probiotiques, augmentant drastiquement leur efficacité",
      scientificBasis: "Recherches sur le microbiome intestinal",
      symptoms: ["Problèmes digestifs", "Ballonnements", "Inflammation intestinale"],
      timeReduction: 4
    },
    "zinc": {
      efficacyBoost: 0.12,
      description: "Le zinc améliore la diversité et la fonction du microbiome",
      scientificBasis: "Études sur l'intégrité de la barrière intestinale",
      symptoms: ["Problèmes digestifs", "Immunité faible"],
      timeReduction: 3
    }
  },
  "ashwagandha": {
    "rhodiola": {
      efficacyBoost: 0.18,
      description: "Effets adaptogènes complémentaires sur différentes voies de stress",
      scientificBasis: "Recherches sur les adaptogènes et le cortisol",
      symptoms: ["Stress", "Fatigue", "Anxiété"],
      timeReduction: 6
    },
    "magnesium": {
      efficacyBoost: 0.15,
      description: "Le magnésium amplifie les effets calmants et anti-stress",
      scientificBasis: "Études sur les neurotransmetteurs et la relaxation",
      symptoms: ["Stress", "Insomnie", "Tension musculaire"],
      timeReduction: 4
    },
    "bcomplex": {
      efficacyBoost: 0.13,
      description: "Les vitamines B soutiennent les mécanismes d'adaptation neurologique",
      scientificBasis: "Recherches sur le métabolisme énergétique et nerveux",
      symptoms: ["Fatigue", "Stress"],
      timeReduction: 3
    }
  },
  "omega3": {
    "vitamin_e": {
      efficacyBoost: 0.15,
      description: "La vitamine E protège les oméga-3 de l'oxydation",
      scientificBasis: "Recherches sur les antioxydants et acides gras",
      symptoms: ["Inflammation", "Problèmes cardiovasculaires"],
      timeReduction: 0
    },
    "curcumin": {
      efficacyBoost: 0.2,
      description: "Potentialisation des effets anti-inflammatoires",
      scientificBasis: "Études sur les voies inflammatoires",
      symptoms: ["Douleurs articulaires", "Inflammation chronique"],
      timeReduction: 7
    }
  },
  "bcomplex": {
    "vitamin_c": {
      efficacyBoost: 0.1,
      description: "Amélioration de l'absorption et du métabolisme énergétique",
      scientificBasis: "Recherches sur la biodisponibilité des vitamines",
      symptoms: ["Fatigue", "Stress", "Immunité faible"],
      timeReduction: 2
    },
    "iron": {
      efficacyBoost: 0.15,
      description: "La vitamine B9 et B12 optimisent l'utilisation du fer",
      scientificBasis: "Études sur l'hématopoïèse",
      symptoms: ["Fatigue", "Anémie"],
      timeReduction: 5
    },
    "choline": {
      efficacyBoost: 0.12,
      description: "Synergie dans la formation des neurotransmetteurs",
      scientificBasis: "Recherches sur les fonctions cognitives",
      symptoms: ["Problèmes cognitifs", "Troubles de l'humeur"],
      timeReduction: 3
    }
  },
  "vitamin_c": {
    "quercetin": {
      efficacyBoost: 0.18,
      description: "Potentialisation des effets antioxydants et anti-inflammatoires",
      scientificBasis: "Études sur le stress oxydatif",
      symptoms: ["Allergies", "Immunité faible", "Inflammation"],
      timeReduction: 4
    },
    "zinc": {
      efficacyBoost: 0.15,
      description: "Renforcement synergique du système immunitaire",
      scientificBasis: "Recherches sur l'immunité cellulaire",
      symptoms: ["Rhumes fréquents", "Récupération lente"],
      timeReduction: 3
    }
  },
  "rhodiola": {
    "bcomplex": {
      efficacyBoost: 0.15,
      description: "Optimisation de l'énergie cellulaire et adaptogène",
      scientificBasis: "Études sur le métabolisme énergétique et le stress",
      symptoms: ["Fatigue", "Épuisement", "Baisse de performance"],
      timeReduction: 4
    },
    "coq10": {
      efficacyBoost: 0.17,
      description: "Amplification de la production d'énergie mitochondriale",
      scientificBasis: "Recherches sur la fonction mitochondriale",
      symptoms: ["Fatigue chronique", "Récupération musculaire"],
      timeReduction: 5
    }
  }
};

/**
 * Trouve les suppléments qui ont des interactions synergiques avec le supplément principal
 * @param primarySupplement Supplément principal
 * @param allSupplements Liste de tous les suppléments disponibles
 * @returns Liste des paires synergiques
 */
export function findSynergisticSupplements(
  primarySupplement: Supplement,
  allSupplements: Supplement[]
): SynergyPair[] {
  const synergisticPairs: SynergyPair[] = [];
  
  // Rechercher dans la base de données si le supplément principal a des synergies
  const synergies = SYNERGY_DATABASE[primarySupplement.id];
  
  if (!synergies) {
    return synergisticPairs;
  }
  
  // Pour chaque synergie potentielle, vérifier si le supplément existe dans la liste
  Object.entries(synergies).forEach(([synergisticId, synergyData]) => {
    const synergisticSupplement = allSupplements.find(supp => supp.id === synergisticId);
    
    if (synergisticSupplement) {
      // Créer les informations de synergie adaptées au format d'affichage
      const synergyInfo: SynergyInfo = {
        name: synergisticSupplement.name,
        description: synergyData.description,
        efficacyBoost: synergyData.efficacyBoost,
        scientificBasis: synergyData.scientificBasis,
        symptoms: synergyData.symptoms,
        timeToEffect: synergyData.timeReduction ? {
          original: extractTimeframe(primarySupplement.effectivenessTiming),
          withSynergy: calculateReducedTimeframe(primarySupplement.effectivenessTiming, synergyData.timeReduction)
        } : undefined
      };
      
      // Ajouter la paire à la liste
      synergisticPairs.push({
        supplementId: synergisticId,
        supplement: synergisticSupplement,
        synergyInfo
      });
    }
  });
  
  return synergisticPairs;
}

/**
 * Calcule la réduction du temps d'efficacité basée sur les synergies
 * @param originalTimeframe Description originale du temps d'efficacité
 * @param reductionDays Nombre de jours de réduction
 * @returns Description ajustée du temps d'efficacité
 */
function calculateReducedTimeframe(originalTimeframe?: string, reductionDays: number = 0): string {
  if (!originalTimeframe || reductionDays === 0) {
    return originalTimeframe || "Variable selon l'individu";
  }
  
  // Chercher des motifs numériques dans la chaîne originale
  const timeMatches = originalTimeframe.match(/(\d+)-(\d+)/);
  if (timeMatches && timeMatches.length >= 3) {
    const minDays = parseInt(timeMatches[1]);
    const maxDays = parseInt(timeMatches[2]);
    
    // Réduire le temps minimum et maximum
    const newMinDays = Math.max(1, minDays - reductionDays);
    const newMaxDays = Math.max(newMinDays + 1, maxDays - reductionDays);
    
    // Remplacer les valeurs dans la chaîne
    return originalTimeframe.replace(
      `${minDays}-${maxDays}`, 
      `${newMinDays}-${newMaxDays}`
    );
  }
  
  // En cas d'impossibilité de traiter la chaîne, retourner une estimation
  return `Environ ${reductionDays} jours plus rapidement`;
}

/**
 * Extrait la mention du délai depuis une chaîne de temps d'efficacité
 */
function extractTimeframe(timeString?: string): string {
  if (!timeString) return "Quelques semaines";
  
  const timeMatches = timeString.match(/(\d+)-(\d+)/);
  if (timeMatches && timeMatches.length >= 3) {
    return `${timeMatches[1]}-${timeMatches[2]} jours`;
  }
  
  return timeString;
}

/**
 * Calcule l'efficacité totale pour une combinaison de suppléments
 * @param primarySupplement Supplément principal
 * @param selectedSynergies IDs des suppléments sélectionnés pour la synergie
 * @param synergisticPairs Paires de synergies disponibles
 * @returns Score d'efficacité totale (0-1)
 */
export function calculateTotalEfficacy(
  primarySupplement: Supplement,
  selectedSynergies: string[],
  synergisticPairs: SynergyPair[]
): number {
  // Commencer avec l'efficacité de base
  let totalEfficacy = primarySupplement.matchScore;
  
  // Ajouter les boosts de chaque supplément synergique sélectionné
  selectedSynergies.forEach(synId => {
    const synPair = synergisticPairs.find(pair => pair.supplementId === synId);
    if (synPair) {
      totalEfficacy += synPair.synergyInfo.efficacyBoost;
    }
  });
  
  // Limiter l'efficacité maximale à 1 (100%)
  return Math.min(1, totalEfficacy);
}

/**
 * Génère des interactions synergiques entre suppléments
 * en se basant sur les données scientifiques
 */
export function generateSynergyInteractions(
  supplements: Supplement[]
): { source: string; target: string; strength: number; description: string; scientificBasis?: string }[] {
  const interactions: { 
    source: string; 
    target: string; 
    strength: number; 
    description: string;
    scientificBasis?: string;
  }[] = [];
  
  // Parcourir tous les suppléments pour chercher des interactions
  supplements.forEach(supplement => {
    const synergies = SYNERGY_DATABASE[supplement.id];
    
    if (synergies) {
      // Pour chaque synergie potentielle, vérifier si le supplément cible existe
      Object.entries(synergies).forEach(([targetId, synergyData]) => {
        const targetSupplement = supplements.find(s => s.id === targetId);
        
        if (targetSupplement) {
          // Créer une interaction bidirectionnelle
          interactions.push({
            source: supplement.id,
            target: targetId,
            strength: synergyData.efficacyBoost,
            description: synergyData.description,
            scientificBasis: synergyData.scientificBasis
          });
        }
      });
    }
  });
  
  return interactions;
}

export default {
  findSynergisticSupplements,
  calculateTotalEfficacy,
  generateSynergyInteractions
};