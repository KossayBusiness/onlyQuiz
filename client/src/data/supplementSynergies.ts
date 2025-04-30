/**
 * Base de données des synergies entre suppléments
 * Définit les interactions positives et les mécanismes d'action
 */

import { SynergyCategory, SynergySubCategory, SynergyRecord } from '@/utils/synergyTypes';

export const SYNERGY_PAIRS: SynergyRecord[] = [
  // Magnésium + Vitamine D3
  {
    pair: ["magnesium", "vitamin_d3"],
    synergyScore: 0.85,
    mechanism: "Le magnésium est nécessaire comme cofacteur pour l'activation métabolique de la vitamine D",
    effect: "Amélioration de l'absorption et de l'activation de la vitamine D",
    category: "metabolism",
    subCategory: "metabolicActivation",
    evidence: {
      level: "strong",
      summary: "Des études ont démontré que le statut en magnésium affecte directement le métabolisme de la vitamine D",
      references: ["Rosanoff et al., 2016", "Uwitonze & Razzaque, 2018"]
    },
    optimizationStrategy: {
      timing: "Prendre ensemble avec un repas contenant des graisses",
      dosageAdjustment: "Privilégier un rapport magnésium:vitamine D équilibré",
      cyclicUse: false,
      foodInteractions: ["Aliments riches en graisses saines"]
    }
  },

  // Zinc + Vitamine C
  {
    pair: ["zinc", "vitamin_c"],
    synergyScore: 0.78,
    mechanism: "La vitamine C améliore l'absorption du zinc et les deux nutriments renforcent mutuellement leurs effets sur l'immunité",
    effect: "Potentialisation des effets immunomodulateurs et amélioration de l'absorption du zinc",
    category: "absorption",
    subCategory: "bioavailabilityBoost",
    evidence: {
      level: "moderate",
      summary: "Des études cliniques montrent une meilleure réponse immunitaire lorsque ces nutriments sont combinés",
      references: ["Wintergerst et al., 2006", "Maggini et al., 2012"]
    },
    optimizationStrategy: {
      timing: "Prendre ensemble à distance des repas riches en phytates",
      dosageAdjustment: "Ratio optimal : 75-100mg de vitamine C pour 15mg de zinc",
      cyclicUse: false
    }
  },

  // Oméga-3 + Vitamine D3
  {
    pair: ["omega3", "vitamin_d3"],
    synergyScore: 0.82,
    mechanism: "Les oméga-3 et la vitamine D agissent sur des voies inflammatoires complémentaires et améliorent réciproquement leur biodisponibilité",
    effect: "Potentialisation des effets anti-inflammatoires et neuroprotecteurs",
    category: "function",
    subCategory: "inflammatoryPathway",
    evidence: {
      level: "moderate",
      summary: "Effet synergique observé dans des études sur les marqueurs inflammatoires et la santé cognitive",
      references: ["Kouchaki et al., 2017", "Jamilian et al., 2018"]
    },
    optimizationStrategy: {
      timing: "Prendre ensemble avec un repas principal contenant des graisses",
      dosageAdjustment: "Augmentation de l'efficacité permet de réduire les doses individuelles",
      cyclicUse: false,
      foodInteractions: ["Huiles végétales de qualité", "Poissons gras"]
    }
  },

  // Quercétine + Vitamine C
  {
    pair: ["quercetin", "vitamin_c"],
    synergyScore: 0.9,
    mechanism: "La vitamine C régénère la quercétine oxydée et prolonge son activité antioxydante; la quercétine protège la vitamine C de l'oxydation",
    effect: "Amplification et prolongation des effets antioxydants et anti-inflammatoires",
    category: "protection",
    subCategory: "antioxidantNetwork",
    evidence: {
      level: "moderate",
      summary: "Interaction synergique démontrée dans des études in vitro et confirmée par des essais cliniques",
      references: ["Boots et al., 2008", "Lakhanpal & Rai, 2007"]
    },
    optimizationStrategy: {
      timing: "Prendre simultanément, idéalement en 2-3 doses quotidiennes",
      dosageAdjustment: "Ratio optimal : 500mg de quercétine pour 500-1000mg de vitamine C",
      cyclicUse: false
    }
  },

  // Magnésium + Zinc
  {
    pair: ["magnesium", "zinc"],
    synergyScore: 0.65,
    mechanism: "Coopération dans la régulation enzymatique et l'homéostasie cellulaire; protection contre la compétition d'absorption",
    effect: "Optimisation des fonctions enzymatiques et équilibre électrolytique",
    category: "function",
    subCategory: "enzymeInhibition",
    evidence: {
      level: "preliminary",
      summary: "Des études suggèrent une synergie fonctionnelle dans la régulation de l'activité cellulaire",
      references: ["Rosanoff et al., 2012", "Razzaque, 2018"]
    },
    optimizationStrategy: {
      timing: "Prendre avec un intervalle de 2 heures pour limiter la compétition d'absorption",
      dosageAdjustment: "Rapport magnésium:zinc d'environ 15:1 recommandé",
      cyclicUse: false
    }
  },

  // NAC + Vitamine C
  {
    pair: ["nac", "vitamin_c"],
    synergyScore: 0.88,
    mechanism: "Régénération mutuelle et effets complémentaires sur le glutathion et le statut redox cellulaire",
    effect: "Amplification du potentiel antioxydant et des capacités de détoxification",
    category: "elimination",
    subCategory: "detoxificationSupport",
    evidence: {
      level: "moderate",
      summary: "Études montrant une augmentation significative des niveaux de glutathion avec la combinaison",
      references: ["Tiwari et al., 2011", "De Flora et al., 1995"]
    },
    optimizationStrategy: {
      timing: "Prendre ensemble à jeun ou entre les repas",
      dosageAdjustment: "Ratio optimal : 600mg NAC pour 500mg vitamine C",
      cyclicUse: false
    }
  },

  // CoQ10 + Oméga-3
  {
    pair: ["coq10", "omega3"],
    synergyScore: 0.75,
    mechanism: "Protection des oméga-3 contre l'oxydation et effets complémentaires sur la fonction mitochondriale et cardiovasculaire",
    effect: "Optimisation de la santé cardiovasculaire et de la production d'énergie cellulaire",
    category: "protection",
    subCategory: "antioxidantNetwork",
    evidence: {
      level: "moderate",
      summary: "Études cliniques montrant des bénéfices supérieurs sur les marqueurs cardiovasculaires",
      references: ["Lee et al., 2013", "Zhai et al., 2017"]
    },
    optimizationStrategy: {
      timing: "Prendre ensemble avec un repas contenant des graisses",
      dosageAdjustment: "CoQ10 sous forme d'ubiquinol pour une meilleure synergie",
      cyclicUse: false,
      foodInteractions: ["Huiles végétales de qualité"]
    }
  },

  // Quercétine + Zinc
  {
    pair: ["quercetin", "zinc"],
    synergyScore: 0.8,
    mechanism: "La quercétine agit comme ionophore du zinc, facilitant son entrée cellulaire et amplification mutuelle des effets antiviraux",
    effect: "Potentialisation des propriétés antivirales et immunomodulatrices",
    category: "absorption",
    subCategory: "transporterEnhancement",
    evidence: {
      level: "preliminary",
      summary: "Des études in vitro et quelques essais cliniques suggèrent une synergie significative",
      references: ["Dabbagh-Bazarbachi et al., 2014", "Colunga Biancatelli et al., 2020"]
    },
    optimizationStrategy: {
      timing: "Prendre ensemble en dehors des repas riches en phytates",
      dosageAdjustment: "Ratio optimal : 500mg de quercétine pour 15-30mg de zinc",
      cyclicUse: false
    }
  },

  // Magnésium + CoQ10
  {
    pair: ["magnesium", "coq10"],
    synergyScore: 0.7,
    mechanism: "Le magnésium est essentiel pour la production et l'utilisation de l'ATP, processus dans lequel CoQ10 joue un rôle clé",
    effect: "Amélioration de la production d'énergie cellulaire et de la fonction mitochondriale",
    category: "function",
    subCategory: "metabolicActivation",
    evidence: {
      level: "preliminary",
      summary: "Études précliniques et observations cliniques suggérant des effets métaboliques complémentaires",
      references: ["Littarru & Tiano, 2010", "DiNicolantonio et al., 2018"]
    },
    optimizationStrategy: {
      timing: "Prendre ensemble avec un repas contenant des graisses",
      dosageAdjustment: "Privilégier l'ubiquinol (forme réduite de CoQ10)",
      cyclicUse: false
    }
  }
];

export function getSynergyBetween(supplementId1: string, supplementId2: string): SynergyRecord | undefined {
  return SYNERGY_PAIRS.find(pair => 
    (pair.pair[0] === supplementId1 && pair.pair[1] === supplementId2) || 
    (pair.pair[0] === supplementId2 && pair.pair[1] === supplementId1)
  );
}

export function getSynergiesForSupplement(supplementId: string): SynergyRecord[] {
  return SYNERGY_PAIRS.filter(pair => 
    pair.pair[0] === supplementId || pair.pair[1] === supplementId
  );
}

export function getStrongestSynergies(count: number = 5): SynergyRecord[] {
  return [...SYNERGY_PAIRS]
    .sort((a, b) => b.synergyScore - a.synergyScore)
    .slice(0, count);
}

export function getSynergiesByCategory(category: SynergyCategory): SynergyRecord[] {
  return SYNERGY_PAIRS.filter(pair => pair.category === category);
}

export function calculateOverallSynergyScore(supplementIds: string[]): number {
  if (supplementIds.length <= 1) return 0;
  
  let totalScore = 0;
  let pairCount = 0;
  
  // Parcourir toutes les paires possibles
  for (let i = 0; i < supplementIds.length; i++) {
    for (let j = i + 1; j < supplementIds.length; j++) {
      const synergy = getSynergyBetween(supplementIds[i], supplementIds[j]);
      if (synergy) {
        totalScore += synergy.synergyScore;
        pairCount++;
      }
    }
  }
  
  // Retourner la moyenne, ou 0 s'il n'y a pas de synergies
  return pairCount > 0 ? totalScore / pairCount : 0;
}