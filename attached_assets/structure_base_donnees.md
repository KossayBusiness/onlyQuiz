# Structure de la Base de Données Enrichie pour les Compléments Alimentaires

Cette structure de données définit un format complet et détaillé pour stocker les informations sur les compléments alimentaires naturels, permettant des recommandations personnalisées et scientifiquement fondées.

## Interface TypeScript pour les Compléments Alimentaires

```typescript
/**
 * Structure complète d'un complément alimentaire
 */
export interface SupplementInfo {
  // Identifiants et informations de base
  id: string;                     // Identifiant unique du complément
  name: string;                   // Nom commercial courant
  scientificName: string;         // Nom scientifique
  category: SupplementCategory;   // Catégorie du complément
  type: SupplementType;           // Type de complément (vitamine, minéral, plante, etc.)
  
  // Descriptions et mécanismes d'action
  shortDescription: string;       // Description courte (1-2 phrases)
  fullDescription: string;        // Description détaillée
  biochemicalMechanism: string;   // Explication du mécanisme d'action biochimique
  
  // Efficacité et bénéfices
  benefits: Benefit[];            // Liste des bénéfices spécifiques
  primaryBenefits: string[];      // Bénéfices principaux (textes formatés)
  secondaryBenefits: string[];    // Bénéfices secondaires (textes formatés)
  
  // Efficacité temporelle
  timeToEffect: {
    initial: string;              // Temps pour ressentir les premiers effets
    optimal: string;              // Temps pour atteindre l'effet optimal
    duration: string;             // Durée de l'effet après arrêt
  };
  
  // Efficacité quantifiée par symptôme/objectif
  efficacyRatings: {
    [symptomOrGoalId: string]: EfficacyRating;
  };
  
  // Dosage et administration
  standardDosage: {
    amount: string;               // Quantité standard
    frequency: string;            // Fréquence d'administration
    timing: string;               // Moment optimal (à jeun, avec repas, etc.)
    notes: string;                // Notes spécifiques sur le dosage
  };
  
  // Dosages spécifiques selon profil
  specificDosages: {
    [profileType: string]: {
      amount: string;
      notes: string;
    };
  };
  
  // Sources naturelles
  naturalSources: {
    name: string;                 // Nom de la source
    concentration: string;        // Concentration approximative
    notes: string;                // Notes sur la biodisponibilité
  }[];
  
  // Sécurité et précautions
  safetyProfile: {
    generalSafety: SafetyRating;  // Niveau de sécurité général
    pregnancySafety: SafetyRating; // Sécurité pendant la grossesse
    childrenSafety: SafetyRating; // Sécurité pour les enfants
    elderSafety: SafetyRating;    // Sécurité pour les personnes âgées
  };
  
  // Contre-indications
  contraindications: {
    condition: string;            // Condition médicale
    severity: ContraindicationSeverity; // Sévérité de la contre-indication
    description: string;          // Description détaillée
  }[];
  
  // Interactions
  interactions: {
    interactionType: InteractionType; // Type d'interaction
    substance: string;            // Substance avec laquelle il interagit
    effect: string;               // Effet de l'interaction
    severity: InteractionSeverity; // Sévérité de l'interaction
    recommendation: string;       // Recommandation pour gérer l'interaction
  }[];
  
  // Données démographiques cibles
  targetDemographics: {
    ageRange?: [number, number];  // Tranche d'âge optimale [min, max]
    gender?: Gender;              // Genre spécifique si applicable
    conditions?: string[];        // Conditions spécifiques ciblées
    lifestyleFactors?: string[];  // Facteurs de style de vie pertinents
  };
  
  // Preuves scientifiques
  scientificEvidence: {
    overallEvidenceLevel: EvidenceLevel; // Niveau global de preuve scientifique
    keyStudies: Study[];          // Études clés
  };
  
  // Informations complémentaires
  additionalInfo: {
    commonNames?: string[];       // Autres noms courants
    history?: string;             // Histoire et utilisation traditionnelle
    sustainabilitySourcing?: string; // Informations sur la durabilité
    certifications?: string[];    // Certifications (bio, sans OGM, etc.)
  };
  
  // Symptômes et objectifs ciblés
  targetSymptoms: string[];       // IDs des symptômes ciblés
  targetGoals: string[];          // IDs des objectifs ciblés
  
  // Métadonnées pour le système
  systemMetadata: {
    lastUpdated: string;          // Date de dernière mise à jour
    popularity: number;           // Score de popularité (0-100)
    controversyLevel: number;     // Niveau de controverse (0-100)
    tags: string[];               // Tags pour la recherche
  };
}

/**
 * Bénéfice spécifique d'un complément
 */
export interface Benefit {
  description: string;            // Description du bénéfice
  efficacyPercentage: number;     // Pourcentage d'efficacité (0-100)
  timeFrame: string;              // Période pour atteindre ce bénéfice
  evidenceLevel: EvidenceLevel;   // Niveau de preuve scientifique
  conditions?: string[];          // Conditions spécifiques pour ce bénéfice
}

/**
 * Évaluation d'efficacité pour un symptôme ou objectif spécifique
 */
export interface EfficacyRating {
  percentage: number;             // Pourcentage d'efficacité (0-100)
  timeFrame: string;              // Période pour atteindre cette efficacité
  confidenceLevel: number;        // Niveau de confiance (0-100)
  notes: string;                  // Notes spécifiques sur l'efficacité
  conditionalFactors: {           // Facteurs qui peuvent influencer l'efficacité
    factor: string;               // Facteur (âge, sexe, etc.)
    impact: string;               // Impact sur l'efficacité
  }[];
}

/**
 * Étude scientifique
 */
export interface Study {
  authors: string;                // Auteurs de l'étude
  title: string;                  // Titre de l'étude
  journal: string;                // Journal de publication
  year: number;                   // Année de publication
  doi?: string;                   // DOI (Digital Object Identifier)
  url?: string;                   // URL de l'étude
  sampleSize?: number;            // Taille de l'échantillon
  studyType: StudyType;           // Type d'étude
  findings: string;               // Résultats principaux
  relevance: string;              // Pertinence pour ce complément
}

/**
 * Types et énumérations
 */
export enum SupplementCategory {
  VITAMIN = "vitamin",
  MINERAL = "mineral",
  HERB = "herb",
  AMINO_ACID = "amino_acid",
  ENZYME = "enzyme",
  PROBIOTIC = "probiotic",
  FATTY_ACID = "fatty_acid",
  ANTIOXIDANT = "antioxidant",
  ADAPTOGEN = "adaptogen",
  OTHER = "other"
}

export enum SupplementType {
  CAPSULE = "capsule",
  TABLET = "tablet",
  LIQUID = "liquid",
  POWDER = "powder",
  TEA = "tea",
  OIL = "oil",
  TINCTURE = "tincture",
  TOPICAL = "topical",
  FOOD = "food"
}

export enum EvidenceLevel {
  STRONG = "strong",              // Multiples essais cliniques randomisés
  MODERATE = "moderate",          // Quelques essais cliniques ou grandes études observationnelles
  PRELIMINARY = "preliminary",    // Études préliminaires ou petites études
  TRADITIONAL = "traditional",    // Usage traditionnel sans études modernes
  ANECDOTAL = "anecdotal",        // Preuves anecdotiques
  CONFLICTING = "conflicting",    // Résultats contradictoires
  INSUFFICIENT = "insufficient"   // Données insuffisantes
}

export enum SafetyRating {
  VERY_SAFE = "very_safe",        // Très sûr, peu d'effets secondaires
  GENERALLY_SAFE = "generally_safe", // Généralement sûr avec précautions
  CAUTION = "caution",            // Utiliser avec prudence
  UNSAFE = "unsafe",              // Non recommandé
  UNKNOWN = "unknown"             // Sécurité inconnue
}

export enum ContraindicationSeverity {
  ABSOLUTE = "absolute",          // Ne jamais utiliser
  RELATIVE = "relative",          // Utiliser avec précaution
  MINOR = "minor",                // Précaution mineure
  THEORETICAL = "theoretical"     // Risque théorique
}

export enum InteractionType {
  DRUG = "drug",                  // Interaction avec médicament
  SUPPLEMENT = "supplement",      // Interaction avec autre complément
  FOOD = "food",                  // Interaction avec aliment
  CONDITION = "condition"         // Interaction avec condition médicale
}

export enum InteractionSeverity {
  SEVERE = "severe",              // Interaction grave
  MODERATE = "moderate",          // Interaction modérée
  MILD = "mild",                  // Interaction légère
  THEORETICAL = "theoretical"     // Interaction théorique
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  ALL = "all"
}

export enum StudyType {
  RCT = "randomized_controlled_trial",
  COHORT = "cohort_study",
  CASE_CONTROL = "case_control",
  SYSTEMATIC_REVIEW = "systematic_review",
  META_ANALYSIS = "meta_analysis",
  IN_VITRO = "in_vitro",
  ANIMAL = "animal_study",
  OBSERVATIONAL = "observational",
  CASE_REPORT = "case_report"
}
```

## Interface TypeScript pour les Symptômes et Objectifs

```typescript
/**
 * Structure d'un symptôme
 */
export interface Symptom {
  id: string;                     // Identifiant unique du symptôme
  name: string;                   // Nom du symptôme
  description: string;            // Description détaillée
  category: SymptomCategory;      // Catégorie du symptôme
  severity: {                     // Impact sur la qualité de vie
    min: number;                  // Impact minimum (1-10)
    max: number;                  // Impact maximum (1-10)
    default: number;              // Impact par défaut
  };
  priorityWeight: number;         // Poids de priorité (1-100, plus élevé = plus prioritaire)
  relatedSymptoms: string[];      // IDs des symptômes connexes
  potentialCauses: string[];      // Causes potentielles
  recommendedTests?: string[];    // Tests médicaux recommandés
  warningFlags?: string[];        // Drapeaux d'avertissement (quand consulter un médecin)
  
  // Métadonnées pour le système
  systemMetadata: {
    displayOrder: number;         // Ordre d'affichage dans le quiz
    tags: string[];               // Tags pour la recherche
  };
}

/**
 * Structure d'un objectif de santé
 */
export interface HealthGoal {
  id: string;                     // Identifiant unique de l'objectif
  name: string;                   // Nom de l'objectif
  description: string;            // Description détaillée
  category: GoalCategory;         // Catégorie de l'objectif
  timeFrame: {                    // Période typique pour atteindre l'objectif
    min: string;                  // Période minimum
    typical: string;              // Période typique
    max: string;                  // Période maximum
  };
  priorityWeight: number;         // Poids de priorité (1-100)
  measurableOutcomes: {           // Résultats mesurables
    metric: string;               // Métrique (ex: "niveau d'énergie")
    measurement: string;          // Comment mesurer
    expectedImprovement: string;  // Amélioration attendue
  }[];
  relatedGoals: string[];         // IDs des objectifs connexes
  relatedSymptoms: string[];      // IDs des symptômes connexes
  
  // Métadonnées pour le système
  systemMetadata: {
    displayOrder: number;         // Ordre d'affichage dans le quiz
    popularity: number;           // Score de popularité (0-100)
    tags: string[];               // Tags pour la recherche
  };
}

/**
 * Types et énumérations
 */
export enum SymptomCategory {
  DIGESTIVE = "digestive",
  ENERGY = "energy",
  SLEEP = "sleep",
  MOOD = "mood",
  COGNITIVE = "cognitive",
  IMMUNE = "immune",
  HORMONAL = "hormonal",
  MUSCULOSKELETAL = "musculoskeletal",
  CARDIOVASCULAR = "cardiovascular",
  RESPIRATORY = "respiratory",
  SKIN = "skin",
  OTHER = "other"
}

export enum GoalCategory {
  ENERGY_IMPROVEMENT = "energy_improvement",
  STRESS_MANAGEMENT = "stress_management",
  SLEEP_OPTIMIZATION = "sleep_optimization",
  COGNITIVE_ENHANCEMENT = "cognitive_enhancement",
  IMMUNE_SUPPORT = "immune_support",
  DIGESTIVE_HEALTH = "digestive_health",
  HORMONAL_BALANCE = "hormonal_balance",
  PHYSICAL_PERFORMANCE = "physical_performance",
  LONGEVITY = "longevity",
  WEIGHT_MANAGEMENT = "weight_management",
  DETOXIFICATION = "detoxification",
  BEAUTY = "beauty",
  OTHER = "other"
}
```

## Interface TypeScript pour les Mappings

```typescript
/**
 * Mapping entre symptômes et compléments
 */
export interface SymptomSupplementMapping {
  symptomId: string;              // ID du symptôme
  supplements: {
    supplementId: string;         // ID du complément
    efficacyScore: number;        // Score d'efficacité (0-100)
    primaryRecommendation: boolean; // Recommandation principale?
    conditionalFactors: {         // Facteurs conditionnels
      factor: string;             // Facteur (âge, sexe, etc.)
      condition: string;          // Condition (ex: ">50", "female")
      adjustedScore?: number;     // Score ajusté si condition remplie
    }[];
    customDescription?: string;   // Description personnalisée pour ce symptôme
  }[];
}

/**
 * Mapping entre objectifs et compléments
 */
export interface GoalSupplementMapping {
  goalId: string;                 // ID de l'objectif
  supplements: {
    supplementId: string;         // ID du complément
    relevanceScore: number;       // Score de pertinence (0-100)
    primaryRecommendation: boolean; // Recommandation principale?
    timeToResult: string;         // Temps pour voir des résultats
    conditionalFactors: {         // Facteurs conditionnels
      factor: string;             // Facteur (âge, sexe, etc.)
      condition: string;          // Condition (ex: ">50", "female")
      adjustedScore?: number;     // Score ajusté si condition remplie
    }[];
    customDescription?: string;   // Description personnalisée pour cet objectif
  }[];
}

/**
 * Mapping des combinaisons synergiques
 */
export interface SynergisticCombination {
  supplementIds: string[];        // IDs des compléments qui fonctionnent ensemble
  synergisticEffect: string;      // Description de l'effet synergique
  efficacyBoost: number;          // Boost d'efficacité en pourcentage
  targetSymptoms?: string[];      // Symptômes spécifiquement ciblés par cette combinaison
  targetGoals?: string[];         // Objectifs spécifiquement ciblés par cette combinaison
  scientificBasis: string;        // Base scientifique de cette synergie
  evidenceLevel: EvidenceLevel;   // Niveau de preuve pour cette synergie
}
```

## Exemple d'Implémentation pour un Complément

```typescript
// Exemple d'un complément alimentaire avec données complètes
export const MAGNESIUM_SUPPLEMENT: SupplementInfo = {
  id: "magnesium-glycinate",
  name: "Magnésium Glycinate",
  scientificName: "Bis-glycinate de magnésium",
  category: SupplementCategory.MINERAL,
  type: SupplementType.CAPSULE,
  
  shortDescription: "Forme hautement biodisponible de magnésium liée à l'acide aminé glycine, particulièrement efficace pour le stress et la relaxation musculaire.",
  fullDescription: "Le magnésium glycinate est une forme chélatée de magnésium liée à l'acide aminé glycine, ce qui améliore son absorption et réduit les effets secondaires digestifs souvent associés à d'autres formes de magnésium. Ce minéral essentiel est impliqué dans plus de 300 réactions enzymatiques dans le corps, notamment la production d'énergie, la synthèse des protéines, la fonction musculaire et nerveuse, et la régulation de la glycémie. Sa forme glycinate est particulièrement reconnue pour ses effets calmants sur le système nerveux et sa capacité à favoriser la relaxation musculaire.",
  biochemicalMechanism: "Le magnésium agit comme cofacteur enzymatique dans de nombreuses réactions biochimiques. Il régule les canaux calciques dans les cellules nerveuses et musculaires, modulant ainsi l'excitabilité neuronale et la contraction musculaire. Il active également la production d'ATP, principale source d'énergie cellulaire. La glycine, quant à elle, est un neurotransmetteur inhibiteur qui renforce les effets relaxants du magnésium sur le système nerveux central.",
  
  benefits: [
    {
      description: "Réduction du stress et de l'anxiété",
      efficacyPercentage: 78,
      timeFrame: "2-4 semaines",
      evidenceLevel: EvidenceLevel.MODERATE
    },
    {
      description: "Amélioration de la qualité du sommeil",
      efficacyPercentage: 72,
      timeFrame: "1-3 semaines",
      evidenceLevel: EvidenceLevel.MODERATE
    },
    {
      description: "Réduction des tensions musculaires et crampes",
      efficacyPercentage: 85,
      timeFrame: "1-2 semaines",
      evidenceLevel: EvidenceLevel.STRONG
    },
    {
      description: "Soutien de la fonction cognitive",
      efficacyPercentage: 65,
      timeFrame: "4-8 semaines",
      evidenceLevel: EvidenceLevel.PRELIMINARY
    },
    {
      description: "Régulation du rythme cardiaque",
      efficacyPercentage: 70,
      timeFrame: "2-6 semaines",
      evidenceLevel: EvidenceLevel.MODERATE
    }
  ],
  
  primaryBenefits: [
    "Réduit significativement les niveaux de stress et d'anxiété en régulant les neurotransmetteurs",
    "Améliore la qualité du sommeil en favorisant la relaxation et en régulant la mélatonine",
    "Soulage efficacement les tensions musculaires et prévient les crampes nocturnes"
  ],
  
  secondaryBenefits: [
    "Contribue à la santé cardiovasculaire en régulant le rythme cardiaque",
    "Soutient la fonction cognitive et la clarté mentale",
    "Aide à maintenir une glycémie équilibrée",
    "Participe à la formation et au maintien de la densité osseuse"
  ],
  
  timeToEffect: {
    initial: "3-5 jours pour les effets sur la relaxation musculaire",
    optimal: "2-4 semaines pour les effets complets sur le stress et le sommeil",
    duration: "Les effets se maintiennent tant que la supplémentation continue, avec une diminution progressive sur 1-2 semaines après l'arrêt"
  },
  
  efficacyRatings: {
    "stress": {
      percentage: 78,
      timeFrame: "2-4 semaines",
      confidenceLevel: 85,
      notes: "Particulièrement efficace pour le stress chronique lié à l'hyperactivité du système nerveux",
      conditionalFactors: [
        {
          factor: "Niveau de déficit initial",
          impact: "Efficacité accrue chez les personnes présentant une carence en magnésium"
        },
        {
          factor: "Âge",
          impact: "Efficacité légèrement réduite chez les personnes âgées de plus de 65 ans"
        }
      ]
    },
    "insomnia": {
      percentage: 72,
      timeFrame: "1-3 semaines",
      confidenceLevel: 80,
      notes: "Plus efficace pour les troubles d'endormissement que pour les réveils nocturnes",
      conditionalFactors: [
        {
          factor: "Type d'insomnie",
          impact: "Plus efficace pour l'insomnie liée à l'anxiété ou aux tensions musculaires"
        }
      ]
    },
    "muscle_cramps": {
      percentage: 85,
      timeFrame: "1-2 semaines",
      confidenceLevel: 90,
      notes: "Très efficace pour les crampes nocturnes et les tensions musculaires",
      conditionalFactors: []
    }
  },
  
  standardDosage: {
    amount: "300-400 mg de magnésium élémentaire par jour",
    frequency: "Réparti en 1-2 prises quotidiennes",
    timing: "De préférence avec les repas pour améliorer l'absorption et réduire les effets secondaires digestifs. La prise du soir est recommandée pour les effets sur le sommeil.",
    notes: "La teneur en magnésium élémentaire varie selon les produits. Vérifier le pourcentage de magnésium élémentaire sur l'étiquette."
  },
  
  specificDosages: {
    "elderly": {
      amount: "250-350 mg par jour",
      notes: "Commencer à dose plus faible et augmenter progressivement pour éviter les effets laxatifs"
    },
    "athletes": {
      amount: "400-500 mg par jour",
      notes: "Besoins accrus en raison des pertes par la transpiration et du métabolisme musculaire"
    },
    "pregnant_women": {
      amount: "350-400 mg par jour",
      notes: "Consulter un professionnel de santé avant la supplémentation"
    }
  },
  
  naturalSources: [
    {
      name: "Graines de citrouille",
      concentration: "156 mg pour 100g",
      notes: "Excellente source végétale, riche en zinc également"
    },
    {
      name: "Épinards",
      concentration: "79 mg pour 100g",
      notes: "Contient également des oxalates qui peuvent réduire l'absorption"
    },
    {
      name: "Amandes",
      concentration: "270 mg pour 100g",
      notes: "Source pratique pour une consommation quotidienne"
    },
    {
      name: "Avocat",
      concentration: "29 mg pour 100g",
      notes: "Bonne source avec des graisses saines"
    }
  ],
  
  safetyProfile: {
    generalSafety: SafetyRating.VERY_SAFE,
    pregnancySafety: SafetyRating.GENERALLY_SAFE,
    childrenSafety: SafetyRating.GENERALLY_SAFE,
    elderSafety: SafetyRating.GENERALLY_SAFE
  },
  
  contraindications: [
    {
      condition: "Insuffisance rénale sévère",
      severity: ContraindicationSeverity.ABSOLUTE,
      description: "Le magnésium est principalement excrété par les reins. Une insuffisance rénale sévère peut entraîner une accumulation dangereuse."
    },
    {
      condition: "Bloc cardiaque",
      severity: ContraindicationSeverity.RELATIVE,
      description: "Le magnésium peut affecter la conduction cardiaque. Consulter un médecin avant utilisation."
    },
    {
      condition: "Myasthénie grave",
      severity: ContraindicationSeverity.RELATIVE,
      description: "Peut théoriquement aggraver les symptômes en raison de ses effets sur la fonction neuromusculaire."
    }
  ],
  
  interactions: [
    {
      interactionType: InteractionType.DRUG,
      substance: "Antibiotiques tétracyclines",
      effect: "Réduction de l'absorption des antibiotiques",
      severity: InteractionSeverity.MODERATE,
      recommendation: "Prendre le magnésium 2-3 heures avant ou après l'antibiotique"
    },
    {
      interactionType: InteractionType.DRUG,
      substance: "Diurétiques thiazidiques",
      effect: "Réduction de l'excrétion du magnésium, risque d'accumulation",
      severity: InteractionSeverity.MILD,
      recommendation: "Surveillance des niveaux de magnésium recommandée"
    },
    {
      interactionType: InteractionType.DRUG,
      substance: "Bisphosphonates",
      effect: "Réduction de l'absorption des bisphosphonates",
      severity: InteractionSeverity.MODERATE,
      recommendation: "Prendre le magnésium 2 heures après le bisphosphonate"
    },
    {
      interactionType: InteractionType.SUPPLEMENT,
      substance: "Calcium",
      effect: "Compétition pour l'absorption",
      severity: InteractionSeverity.MILD,
      recommendation: "Prendre à différents moments de la journée si possible"
    }
  ],
  
  targetDemographics: {
    ageRange: [18, 99],
    gender: Gender.ALL,
    conditions: ["stress", "insomnia", "muscle_tension", "fatigue", "migraine"],
    lifestyleFactors: ["high_stress_occupation", "athletic_activity", "poor_sleep_quality"]
  },
  
  scientificEvidence: {
    overallEvidenceLevel: EvidenceLevel.MODERATE,
    keyStudies: [
      {
        authors: "Boyle NB, Lawton C, Dye L",
        title: "The Effects of Magnesium Supplementation on Subjective Anxiety and Stress—A Systematic Review",
        journal: "Nutrients",
        year: 2017,
        doi: "10.3390/nu9050429",
        studyType: StudyType.SYSTEMATIC_REVIEW,
        findings: "La supplémentation en magnésium peut avoir un effet bénéfique sur les symptômes d'anxiété subjective chez les personnes vulnérables au stress",
        relevance: "Soutient l'utilisation du magnésium pour la gestion du stress et de l'anxiété"
      },
      {
        authors: "Abbasi B, Kimiagar M, Sadeghniiat K, et al.",
        title: "The effect of magnesium supplementation on primary insomnia in elderly: A double-blind placebo-controlled clinical trial",
        journal: "Journal of Research in Medical Sciences",
        year: 2012,
        studyType: StudyType.RCT,
        sampleSize: 46,
        findings: "Le magnésium améliore les paramètres subjectifs et objectifs du sommeil chez les personnes âgées souffrant d'insomnie primaire",
        relevance: "Démontre l'efficacité du magnésium pour améliorer la qualité du sommeil"
      },
      {
        authors: "Veronese N, Berton L, Carraro S, et al.",
        title: "Effect of oral magnesium supplementation on physical performance in healthy elderly women involved in a weekly exercise program: a randomized controlled trial",
        journal: "American Journal of Clinical Nutrition",
        year: 2014,
        studyType: StudyType.RCT,
        sampleSize: 139,
        findings: "La supplémentation en magnésium améliore les performances physiques chez les femmes âgées actives",
        relevance: "Soutient l'utilisation du magnésium pour la fonction musculaire et les performances physiques"
      }
    ]
  },
  
  additionalInfo: {
    commonNames: ["Diglycinate de magnésium", "Chélate de magnésium"],
    history: "Le magnésium est utilisé depuis l'Antiquité sous forme de sels d'Epsom pour ses propriétés relaxantes. La forme glycinate est une innovation moderne visant à améliorer l'absorption et réduire les effets secondaires digestifs.",
    sustainabilitySourcing: "Le magnésium est généralement extrait de l'eau de mer ou de dépôts minéraux. La production est considérée comme ayant un impact environnemental modéré.",
    certifications: ["Sans OGM", "Sans gluten", "Végétalien"]
  },
  
  targetSymptoms: [
    "stress", 
    "anxiety", 
    "insomnia", 
    "muscle_cramps", 
    "muscle_tension", 
    "fatigue", 
    "irritability", 
    "headache", 
    "migraine", 
    "pms"
  ],
  
  targetGoals: [
    "stress_management", 
    "sleep_improvement", 
    "energy_enhancement", 
    "muscle_recovery", 
    "cognitive_function", 
    "mood_stabilization", 
    "cardiovascular_health"
  ],
  
  systemMetadata: {
    lastUpdated: "2025-03-15",
    popularity: 92,
    controversyLevel: 10,
    tags: ["mineral", "stress", "sleep", "muscle", "relaxation", "energy"]
  }
};
```

## Exemple d'Implémentation pour un Symptôme

```typescript
// Exemple d'un symptôme avec données complètes
export const STRESS_SYMPTOM: Symptom = {
  id: "stress",
  name: "Stress chronique",
  description: "État de tension physique et émotionnelle persistant en réponse à des pressions internes ou externes, caractérisé par une activation prolongée du système nerveux sympathique et de l'axe hypothalamo-hypophyso-surrénalien.",
  category: SymptomCategory.MOOD,
  
  severity: {
    min: 3,
    max: 9,
    default: 6
  },
  
  priorityWeight: 85, // Priorité élevée car impacte de nombreux systèmes
  
  relatedSymptoms: [
    "anxiety",
    "insomnia",
    "fatigue",
    "irritability",
    "concentration_problems",
    "digestive_issues"
  ],
  
  potentialCauses: [
    "Surcharge professionnelle",
    "Conflits relationnels",
    "Difficultés financières",
    "Traumatismes non résolus",
    "Perfectionnisme",
    "Déséquilibre hormonal",
    "Inflammation chronique",
    "Carences nutritionnelles (magnésium, vitamines B)",
    "Dysbiose intestinale"
  ],
  
  recommendedTests: [
    "Cortisol salivaire (rythme circadien)",
    "DHEA-S sanguin",
    "Ratio cortisol/DHEA",
    "Variabilité de la fréquence cardiaque (HRV)",
    "Évaluation psychologique standardisée"
  ],
  
  warningFlags: [
    "Idées suicidaires",
    "Palpitations cardiaques sévères",
    "Attaques de panique fréquentes",
    "Perte de poids significative",
    "Hypertension non contrôlée"
  ],
  
  systemMetadata: {
    displayOrder: 3,
    tags: ["stress", "burnout", "anxiety", "cortisol", "adrenal", "nervous_system"]
  }
};
```

## Exemple d'Implémentation pour un Objectif

```typescript
// Exemple d'un objectif de santé avec données complètes
export const STRESS_MANAGEMENT_GOAL: HealthGoal = {
  id: "stress_management",
  name: "Gestion optimale du stress",
  description: "Développer la capacité à faire face efficacement aux pressions quotidiennes tout en maintenant un équilibre émotionnel et physiologique, réduisant ainsi l'impact négatif du stress sur la santé physique et mentale.",
  category: GoalCategory.STRESS_MANAGEMENT,
  
  timeFrame: {
    min: "2 semaines",
    typical: "1-3 mois",
    max: "6 mois"
  },
  
  priorityWeight: 90, // Priorité très élevée car fondamental pour de nombreux aspects de la santé
  
  measurableOutcomes: [
    {
      metric: "Niveau de stress perçu",
      measurement: "Échelle de stress perçu (PSS)",
      expectedImprovement: "Réduction de 30-50% du score"
    },
    {
      metric: "Qualité du sommeil",
      measurement: "Indice de qualité du sommeil de Pittsburgh (PSQI)",
      expectedImprovement: "Amélioration de 40-60% du score"
    },
    {
      metric: "Variabilité de la fréquence cardiaque",
      measurement: "Mesure HRV via application ou dispositif",
      expectedImprovement: "Augmentation de 20-40% de la cohérence cardiaque"
    },
    {
      metric: "Niveau d'énergie",
      measurement: "Auto-évaluation quotidienne (échelle 1-10)",
      expectedImprovement: "Augmentation de 3-5 points"
    }
  ],
  
  relatedGoals: [
    "sleep_optimization",
    "energy_enhancement",
    "cognitive_performance",
    "emotional_balance",
    "immune_support"
  ],
  
  relatedSymptoms: [
    "stress",
    "anxiety",
    "fatigue",
    "insomnia",
    "irritability",
    "concentration_problems",
    "digestive_issues"
  ],
  
  systemMetadata: {
    displayOrder: 2,
    popularity: 95,
    tags: ["stress", "relaxation", "resilience", "cortisol", "adaptation", "balance"]
  }
};
```

## Exemple d'Implémentation pour un Mapping

```typescript
// Exemple de mapping entre symptôme et compléments
export const STRESS_SUPPLEMENT_MAPPING: SymptomSupplementMapping = {
  symptomId: "stress",
  supplements: [
    {
      supplementId: "ashwagandha-extract",
      efficacyScore: 92,
      primaryRecommendation: true,
      conditionalFactors: [
        {
          factor: "Niveau de stress",
          condition: "severe",
          adjustedScore: 95
        },
        {
          factor: "Insomnie associée",
          condition: "present",
          adjustedScore: 94
        }
      ],
      customDescription: "L'ashwagandha est particulièrement efficace pour réduire le stress chronique en modulant la réponse de l'axe HPA et en réduisant les niveaux de cortisol. Des études cliniques montrent une réduction du stress perçu de 44% en moyenne après 60 jours d'utilisation."
    },
    {
      supplementId: "magnesium-glycinate",
      efficacyScore: 85,
      primaryRecommendation: true,
      conditionalFactors: [
        {
          factor: "Tension musculaire",
          condition: "present",
          adjustedScore: 90
        }
      ],
      customDescription: "Le magnésium glycinate aide à réguler la réponse au stress en soutenant la fonction du système nerveux parasympathique et en réduisant l'excitabilité neuronale. Il est particulièrement efficace lorsque le stress s'accompagne de tensions musculaires ou de difficultés à se détendre."
    },
    {
      supplementId: "l-theanine",
      efficacyScore: 82,
      primaryRecommendation: false,
      conditionalFactors: [
        {
          factor: "Anxiété associée",
          condition: "present",
          adjustedScore: 88
        },
        {
          factor: "Consommation de caféine",
          condition: "high",
          adjustedScore: 90
        }
      ],
      customDescription: "La L-théanine favorise un état de relaxation alerte en augmentant les ondes alpha cérébrales et en modulant les neurotransmetteurs GABA, sérotonine et dopamine. Elle est particulièrement utile pour contrebalancer les effets stimulants de la caféine tout en maintenant la clarté mentale."
    },
    {
      supplementId: "rhodiola-rosea",
      efficacyScore: 80,
      primaryRecommendation: false,
      conditionalFactors: [
        {
          factor: "Fatigue associée",
          condition: "present",
          adjustedScore: 88
        },
        {
          factor: "Performance cognitive",
          condition: "reduced",
          adjustedScore: 85
        }
      ],
      customDescription: "La rhodiola est un adaptogène qui aide l'organisme à s'adapter au stress tout en combattant la fatigue et en améliorant les performances cognitives. Elle est particulièrement indiquée lorsque le stress s'accompagne d'épuisement physique et mental."
    },
    {
      supplementId: "holy-basil",
      efficacyScore: 78,
      primaryRecommendation: false,
      conditionalFactors: [
        {
          factor: "Inflammation",
          condition: "present",
          adjustedScore: 85
        }
      ],
      customDescription: "Le basilic sacré (tulsi) combine des propriétés adaptogènes et anti-inflammatoires, aidant à réduire le stress tout en atténuant l'inflammation associée. Il favorise également la clarté mentale et l'équilibre émotionnel."
    }
  ]
};
```

Cette structure de données complète permettra de créer un système de recommandation hautement personnalisé, capable de fournir des informations détaillées et scientifiquement fondées sur les compléments alimentaires naturels en fonction des symptômes et objectifs spécifiques de chaque utilisateur.
