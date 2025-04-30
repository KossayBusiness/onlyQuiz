/**
 * Base de connaissances sur les mécanismes synergiques
 * Classification et description des différents types de synergies entre suppléments
 */

import { SynergyMechanismCategory } from "../utils/synergyTypes";

/**
 * Classification complète des mécanismes de synergie
 */
export const SYNERGY_MECHANISMS: SynergyMechanismCategory[] = [
  {
    id: "amelioration_biodisponibilite",
    name: "Amélioration de la biodisponibilité",
    description: "Un supplément augmente l'absorption ou réduit le métabolisme de l'autre, augmentant sa concentration sanguine et son efficacité.",
    subTypes: [
      {
        id: "inhibition_metabolique",
        examples: ["turmeric + black_pepper", "quercetin + EGCG"]
      },
      {
        id: "facilitation_absorption",
        examples: ["vitamin_d + vitamin_k", "iron + vitamin_c"]
      },
      {
        id: "transport_cellulaire",
        examples: ["zinc + vitamin_a"]
      }
    ]
  },
  {
    id: "potentialisation_biochimique",
    name: "Potentialisation biochimique",
    description: "Les nutriments agissent comme cofacteurs ou coenzymes dans les mêmes voies métaboliques, amplifiant leurs effets biologiques.",
    subTypes: [
      {
        id: "activation_enzymatique",
        examples: ["magnesium + vitamin_d", "b_complex + CoQ10"]
      },
      {
        id: "regeneration_antioxydante",
        examples: ["nac + vitamin_c", "vitamin_e + vitamin_c"]
      },
      {
        id: "synthese_proteique",
        examples: ["zinc + vitamin_b6", "magnesium + vitamin_b6"]
      }
    ]
  },
  {
    id: "complementarite_fonctionnelle",
    name: "Complémentarité fonctionnelle",
    description: "Les suppléments agissent sur différents aspects d'un même problème ou système physiologique, créant un effet thérapeutique plus complet.",
    subTypes: [
      {
        id: "regulation_multisysteme",
        examples: ["omega3 + vitamin_d", "magnesium + l_theanine"]
      },
      {
        id: "voies_complementaires",
        examples: ["lions_mane + bacopa", "turmeric + boswellia"]
      },
      {
        id: "balance_biochimique",
        examples: ["calcium + magnesium + vitamin_d", "zinc + copper"]
      }
    ]
  },
  {
    id: "symbiose_ecologique",
    name: "Symbiose écologique",
    description: "Un supplément crée un environnement favorable à l'efficacité de l'autre, notamment au niveau du microbiome ou de l'environnement tissulaire.",
    subTypes: [
      {
        id: "support_microbiome",
        examples: ["probiotics + prebiotics", "probiotics + resistant_starch"]
      },
      {
        id: "conditionnement_digestif",
        examples: ["digestive_enzymes + probiotics", "bitter_herbs + probiotics"]
      },
      {
        id: "optimisation_environnement",
        examples: ["magnesium + vitamin_b1", "vitamin_c + iron"]
      }
    ]
  },
  {
    id: "cascade_metabolique",
    name: "Cascade métabolique",
    description: "Un supplément active une voie métabolique qui amplifie l'effet de l'autre, créant un effet domino positif dans la physiologie.",
    subTypes: [
      {
        id: "cascade_signalisation",
        examples: ["berberine + alpha_lipoic_acid", "omega3 + niacin"]
      },
      {
        id: "regulation_genique",
        examples: ["resveratrol + quercetin", "sulforaphane + vitamin_d"]
      },
      {
        id: "sensibilisation_recepteur",
        examples: ["magnesium + vitamin_d", "omega3 + vitamin_d"]
      }
    ]
  }
];

/**
 * Descriptions détaillées des mécanismes principaux
 */
export const MECHANISM_DESCRIPTIONS: Record<string, string> = {
  potentialisation_immunitaire: "Activation synergique de multiples composantes du système immunitaire, amplifiant la réponse antimicrobienne et l'activité des cellules immunitaires.",
  regeneration_antioxydante: "Un antioxydant régénère l'autre après qu'il ait neutralisé des radicaux libres, créant un cycle de protection continu et plus efficace.",
  potentialisation_anti_inflammatoire: "Action complémentaire sur différentes voies inflammatoires, résultant en une réduction plus complète et durable de l'inflammation systémique.",
  activation_enzymatique: "Un nutriment sert de cofacteur essentiel pour les enzymes qui activent ou métabolisent l'autre nutriment, améliorant significativement son efficacité.",
  symbiose_microbiome: "Création d'un environnement intestinal optimisé où un supplément fournit le substrat nécessaire à la prolifération et à l'activité de l'autre.",
  amelioration_biodisponibilite: "Augmentation significative de l'absorption intestinale, réduction du métabolisme de premier passage, ou protection contre la dégradation d'un nutriment par l'autre.",
  neuroprotection_complementaire: "Protection des neurones via différentes voies complémentaires (circulation cérébrale, protection antioxydante, support énergétique, neuroplasticité) pour un effet neuroprotecteur global.",
  potentialisation_antioxydante_tissulaire: "Amplification de la capacité antioxydante dans des tissus spécifiques grâce à des mécanismes complémentaires, créant une protection renforcée contre le stress oxydatif."
};

/**
 * Récupère la description détaillée d'un mécanisme spécifique
 * @param mechanismId Identifiant du mécanisme
 * @returns Description détaillée ou description générique si non trouvée
 */
export function getMechanismDescription(mechanismId: string): string {
  return MECHANISM_DESCRIPTIONS[mechanismId] || 
    "Mécanisme synergique par lequel deux suppléments interagissent pour produire un effet supérieur à la somme de leurs effets individuels.";
}

/**
 * Récupère la catégorie de mécanisme synergique qui contient le sous-type spécifié
 * @param mechanismId Identifiant du mécanisme ou sous-mécanisme
 * @returns Catégorie parente ou undefined
 */
export function getMechanismCategory(mechanismId: string): SynergyMechanismCategory | undefined {
  // Vérifier si c'est une catégorie principale
  const mainCategory = SYNERGY_MECHANISMS.find(cat => cat.id === mechanismId);
  if (mainCategory) return mainCategory;
  
  // Chercher le sous-type dans les catégories
  return SYNERGY_MECHANISMS.find(cat => 
    cat.subTypes.some(subType => subType.id === mechanismId)
  );
}

/**
 * Récupère le nom convivial d'un mécanisme synergique
 * @param mechanismId Identifiant du mécanisme
 * @returns Nom convivial du mécanisme
 */
export function getMechanismFriendlyName(mechanismId: string): string {
  // Vérifier d'abord les catégories principales
  const mainCategory = SYNERGY_MECHANISMS.find(cat => cat.id === mechanismId);
  if (mainCategory) return mainCategory.name;
  
  // Chercher dans les sous-types
  for (const category of SYNERGY_MECHANISMS) {
    const subType = category.subTypes.find(sub => sub.id === mechanismId);
    if (subType) {
      // Convertir l'ID en nom convivial (transformer les underscores en espaces et mettre en majuscule)
      return subType.id
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }
  
  // Retourner une version formatée de l'ID si rien n'est trouvé
  return mechanismId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}