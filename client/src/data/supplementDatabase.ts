/**
 * Base de données enrichie des suppléments avec informations détaillées
 * pour le système de recommandation et d'analyse des synergies
 */

// Types principaux
export type SupplementCategory = 
  | 'herb' 
  | 'vitamin' 
  | 'mineral' 
  | 'amino' 
  | 'fatty_acid' 
  | 'probiotic' 
  | 'enzyme' 
  | 'adaptogen'
  | 'mushroom'
  | 'phytonutrient'
  | 'hormone'
  | 'nootropic'
  | 'other';

export type TargetSystem = 
  | 'digestive' 
  | 'immune' 
  | 'nervous' 
  | 'endocrine' 
  | 'cardiovascular' 
  | 'respiratory' 
  | 'musculoskeletal' 
  | 'integumentary'
  | 'urinary'
  | 'reproductive'
  | 'lymphatic'
  | 'hepatic'
  | 'cognitive';

export type ChronoEffect = 
  | 'morning_activation'
  | 'daytime_performance'
  | 'evening_relaxation'
  | 'sleep_support'
  | 'cyclic_adaptation'
  | 'time_independent';

export type BioactiveCompound = {
  name: string;
  potency: number; // 0-1
  standardization?: string;
  halfLife?: string;
  effects: string[];
};

export type EvidenceLevel = 
  | 'strong'        // Multiples essais cliniques randomisés, méta-analyses
  | 'moderate'      // Quelques essais cliniques, preuves consistantes
  | 'preliminary'   // Études pilotes, quelques preuves humaines limitées
  | 'preclinical'   // Études animales et in vitro principalement
  | 'traditional'   // Usage traditionnel établi mais preuves modernes limitées
  | 'theoretical'   // Mécanisme plausible mais peu d'études directes
  | 'conflicting'   // Études avec résultats contradictoires
  | 'insufficient';  // Trop peu d'études pour tirer des conclusions

export type PhysiologicalEffect = {
  system: TargetSystem;
  effect: string;
  mechanism: string;
  timeToOnset: string;
  duration: string;
  potency: number; // 0-1
  consistency: number; // 0-1 (fiabilité de l'effet)
};

export type MetabolicPathway = 
  | 'phase1_cyp450'
  | 'phase2_conjugation'
  | 'glucuronidation'
  | 'sulfation'
  | 'methylation'
  | 'acetylation'
  | 'glutathione_conjugation'
  | 'amino_acid_conjugation'
  | 'peptide_transport'
  | 'fatty_acid_metabolism'
  | 'glucose_metabolism';

export type GeneticPolymorphism = {
  gene: string;
  snp: string;
  effect: string;
  recommendation: string;
};

export interface SupplementInfo {
  // Informations de base
  id: string;
  name: string;
  latinName?: string;
  alternateName?: string[];
  description: string;
  category: SupplementCategory;
  subCategory?: string;
  
  // Composition et principes actifs
  activeCompounds: BioactiveCompound[];
  standardization?: {
    method: string;
    compounds: string[];
    percentage: string;
  };
  spectrum?: 'full_spectrum' | 'extract' | 'isolate' | 'synthetic';
  
  // Bénéfices et effets ciblés
  primaryBenefits: string[];
  secondaryBenefits: string[];
  tertiaryBenefits?: string[];
  physiologicalEffects: PhysiologicalEffect[];
  mechanismsOfAction: string[];
  targetSystems: TargetSystem[];
  biomarkers?: Array<{
    name: string;
    effect: string;
    magnitude: number; // -1 à 1, négatif signifie réduction
    timeframe: string;
  }>;
  
  // Chronobiologie et timing
  chronoEffects?: ChronoEffect[];
  circadianConsiderations?: string[];
  
  // Dosage et administration
  commonDosages: {
    standard: string;
    minimum: string;
    therapeutic: string;
    maximum: string;
    timing?: string;
    frequency?: string;
    cycleRecommendations?: string;
    loadingPhase?: string;
    maintenancePhase?: string;
  };
  
  // Facteurs d'absorption et de métabolisme
  absorptionFactors: {
    enhancers: string[];
    inhibitors: string[];
    fatSoluble: boolean;
    waterSoluble: boolean;
    bioavailability: number; // Pourcentage d'absorption 0-1
    peakPlasmaTime?: string;
  };
  
  metabolicPathways?: MetabolicPathway[];
  halfLife?: string;
  eliminationRoute?: ('renal' | 'hepatic' | 'pulmonary' | 'intestinal')[];
  
  // Interactions pharmacologiques
  drugInteractionRisk: number; // 0-1, risque global d'interactions
  pharmacokinetics?: {
    absorption: string;
    distribution: string;
    metabolism: string;
    excretion: string;
  };
  
  // Profil de sécurité
  safetyProfile: {
    sideEffects: string[];
    sideEffectIncidence: number; // 0-1, probabilité d'effets secondaires
    contraindications: string[];
    drugInteractions: string[];
    pregnancySafety: 'safe' | 'caution' | 'contraindicated' | 'insufficient_data';
    nursingCompatibility?: 'safe' | 'caution' | 'contraindicated' | 'insufficient_data';
    longTermSafety: 'well_established' | 'likely_safe' | 'possibly_safe' | 'insufficient_data';
    upperLimit?: string;
    toxicityRisk: number; // 0-1
    adverseEventReports?: string[];
  };
  
  // Personnalisation génétique
  geneticConsiderations?: GeneticPolymorphism[];
  
  // Preuves scientifiques
  scientificEvidence: {
    level: EvidenceLevel;
    keyStudies: string[];
    metaAnalyses?: string[];
    recentFindings?: string[];
    researchGaps: string[];
    controversies?: string[];
    strengthOfEvidence: number; // 0-1, score global de la qualité des preuves
  };
  
  // Formulation et considérations pratiques
  formulations?: Array<{
    type: string; // ex: "capsule", "liquid", "powder"
    bioavailability: number; // 0-1
    advantages: string[];
    disadvantages: string[];
  }>;
  
  qualityConsiderations?: {
    sourcingFactors: string[];
    processingFactors: string[];
    testingRecommendations: string[];
    stabilityFactors: string[];
    storageRequirements: string[];
  };
  
  // Considérations particulières
  specialConsiderations?: string[];
  costEffectivenessRatio?: number; // 0-1, rapport coût-efficacité
  sustainabilityIssues?: string[];
  
  // Facteurs individuels modulant l'efficacité
  effectModifiers?: Array<{
    factor: string;
    impact: string;
    direction: 'increase' | 'decrease' | 'variable';
    magnitude: number; // 0-1
  }>;
}

export const SUPPLEMENT_DATABASE: Record<string, SupplementInfo> = {
  "magnesium": {
    id: "magnesium",
    name: "Magnésium",
    alternateName: ["Mg", "Sel de magnésium"],
    description: "Minéral essentiel impliqué dans plus de 300 réactions enzymatiques dans le corps, crucial pour la fonction musculaire, nerveuse et métabolique",
    category: "mineral",
    subCategory: "macroMineral",
    
    activeCompounds: [
      {
        name: "Magnésium élémentaire",
        potency: 1,
        effects: ["Cofacteur enzymatique", "Régulation neuromusculaire", "Production d'ATP"]
      }
    ],
    standardization: {
      method: "Concentration élémentaire",
      compounds: ["Magnésium élémentaire"],
      percentage: "Variable selon la forme (10-25%)"
    },
    
    primaryBenefits: [
      "Relaxation musculaire",
      "Soutien de la fonction nerveuse",
      "Production d'énergie cellulaire",
      "Santé cardiovasculaire"
    ],
    secondaryBenefits: [
      "Amélioration du sommeil",
      "Réduction du stress",
      "Régulation du rythme cardiaque",
      "Soutien à la densité osseuse"
    ],
    tertiaryBenefits: [
      "Équilibre glycémique",
      "Réduction des migraines",
      "Soutien à la détoxification"
    ],
    
    physiologicalEffects: [
      {
        system: "nervous",
        effect: "Stabilisation de l'activité neuronale",
        mechanism: "Régulation des récepteurs NMDA et de l'influx calcique",
        timeToOnset: "2-4 heures",
        duration: "6-8 heures",
        potency: 0.8,
        consistency: 0.85
      },
      {
        system: "musculoskeletal",
        effect: "Relaxation musculaire",
        mechanism: "Antagonisme du calcium au niveau des fibres musculaires",
        timeToOnset: "1-3 heures",
        duration: "4-6 heures",
        potency: 0.9,
        consistency: 0.9
      },
      {
        system: "cardiovascular",
        effect: "Vasodilatation et régulation du rythme cardiaque",
        mechanism: "Modulation des canaux calciques et potassiques",
        timeToOnset: "4-8 heures",
        duration: "12-24 heures",
        potency: 0.75,
        consistency: 0.8
      },
      {
        system: "endocrine",
        effect: "Amélioration de la sensibilité à l'insuline",
        mechanism: "Modulation de la signalisation insuline-dépendante",
        timeToOnset: "1-2 semaines",
        duration: "Continue avec supplémentation",
        potency: 0.6,
        consistency: 0.7
      }
    ],
    
    mechanismsOfAction: [
      "Cofacteur enzymatique pour plus de 300 réactions ATP-dépendantes",
      "Régulation des canaux calciques et potassiques",
      "Stabilisation des membranes cellulaires",
      "Modulation de la transmission neuromusculaire",
      "Régulation de la synthèse d'ADN et de protéines",
      "Équilibrage des électrolytes intracellulaires"
    ],
    
    targetSystems: ["nervous", "musculoskeletal", "cardiovascular", "endocrine", "digestive"],
    
    biomarkers: [
      {
        name: "Magnésium sérique",
        effect: "Élévation transitoire",
        magnitude: 0.3,
        timeframe: "24-48 heures"
      },
      {
        name: "Magnésium érythrocytaire",
        effect: "Augmentation progressive",
        magnitude: 0.6,
        timeframe: "2-4 semaines"
      },
      {
        name: "Pression artérielle systolique",
        effect: "Réduction",
        magnitude: -0.25,
        timeframe: "2-4 semaines"
      },
      {
        name: "Sensibilité à l'insuline",
        effect: "Amélioration",
        magnitude: 0.3,
        timeframe: "3-6 semaines"
      }
    ],
    
    chronoEffects: ["evening_relaxation", "sleep_support"],
    circadianConsiderations: [
      "Efficacité optimale pour le sommeil lorsque pris 1-2 heures avant le coucher",
      "La forme glycinate ou thréonate peut améliorer les effets sur le sommeil",
      "L'oxyde de magnésium a une action plus lente, idéale pour la prise nocturne"
    ],
    
    commonDosages: {
      standard: "300-400mg par jour",
      minimum: "200mg par jour",
      therapeutic: "400-600mg par jour",
      maximum: "800mg par jour",
      timing: "Diviser en 2-3 prises, préférentiellement avec les repas",
      frequency: "Quotidienne",
      cycleRecommendations: "Administration continue recommandée",
      loadingPhase: "600-800mg pendant 2 semaines peut accélérer la correction des déficiences",
      maintenancePhase: "300-400mg quotidiennement"
    },
    
    absorptionFactors: {
      enhancers: [
        "Vitamine D3",
        "Vitamine B6",
        "Acides organiques (citrique, malique)",
        "Probiotiques",
        "Présence de protéines"
      ],
      inhibitors: [
        "Oxalates (épinards, rhubarbe)",
        "Phytates (grains entiers non préparés)",
        "Excès de calcium",
        "Excès de zinc",
        "Excès de fer",
        "Consommation excessive d'alcool",
        "Caféine"
      ],
      fatSoluble: false,
      waterSoluble: true,
      bioavailability: 0.35,
      peakPlasmaTime: "2-4 heures selon la forme"
    },
    
    metabolicPathways: ["renal_excretion"],
    halfLife: "Variable selon la forme (magnésium citrate: ~4h, glycinate: ~6-8h)",
    eliminationRoute: ["renal", "intestinal"],
    
    drugInteractionRisk: 0.4,
    pharmacokinetics: {
      absorption: "Variable selon la forme (10-55%)",
      distribution: "60% dans les os, 39% intracellulaire, 1% sérique",
      metabolism: "Non métabolisé",
      excretion: "Principalement rénale, secondairement fécale"
    },
    
    safetyProfile: {
      sideEffects: [
        "Diarrhée",
        "Crampes abdominales",
        "Nausées à doses élevées",
        "Effet laxatif (particulièrement l'oxyde et le sulfate)"
      ],
      sideEffectIncidence: 0.15,
      contraindications: [
        "Insuffisance rénale sévère",
        "Blocs cardiaques",
        "Myasthénie grave",
        "Maladie d'Addison",
        "Syndrome de l'intestin court"
      ],
      drugInteractions: [
        "Antibiotiques tétracyclines et quinolones (réduction d'absorption)",
        "Bisphosphonates (réduction d'absorption)",
        "Diurétiques d'épargne potassique (risque d'hypermagnésémie)",
        "Digoxine (effet potentialisé)",
        "Gabapentine (réduction d'absorption)",
        "Inhibiteurs calciques (effet additif)",
        "Relaxants musculaires (effet potentialisé)"
      ],
      pregnancySafety: "safe",
      nursingCompatibility: "safe",
      longTermSafety: "well_established",
      upperLimit: "350mg/jour de magnésium supplémentaire (hors alimentation)",
      toxicityRisk: 0.1,
      adverseEventReports: [
        "Hypermagnésémie chez les insuffisants rénaux",
        "Interactions médicamenteuses"
      ]
    },
    
    geneticConsiderations: [
      {
        gene: "TRPM6",
        snp: "rs3750425",
        effect: "Diminution de la capacité d'absorption intestinale",
        recommendation: "Augmenter les doses et/ou utiliser des formes plus biodisponibles (glycinate, thréonate)"
      },
      {
        gene: "FADS1",
        snp: "rs174537",
        effect: "Altération du métabolisme des acides gras liée au statut en magnésium",
        recommendation: "Combiner avec des oméga-3 pour une synergie optimale"
      }
    ],
    
    scientificEvidence: {
      level: "strong",
      keyStudies: [
        "Méta-analyse sur le magnésium et la tension artérielle (Kass et al., 2012)",
        "Étude sur le magnésium et la qualité du sommeil (Abbasi et al., 2012)",
        "Essai contrôlé randomisé sur magnésium et migraines (Peikert et al., 1996)",
        "Méta-analyse sur magnésium et diabète de type 2 (Dong et al., 2011)"
      ],
      metaAnalyses: [
        "Zhang et al. (2016): Magnésium et risque cardiovasculaire",
        "Fang et al. (2016): Magnésium et syndrome métabolique"
      ],
      recentFindings: [
        "Le magnésium thréonate traverse plus efficacement la barrière hémato-encéphalique (Slutsky et al., 2010)",
        "Association entre statut en magnésium et fonction cognitive (Clerc et al., 2021)"
      ],
      researchGaps: [
        "Formes optimales pour des conditions spécifiques",
        "Dosages personnalisés selon les profils génétiques",
        "Effets à long terme sur la cognition et la neuroprotection",
        "Interactions avec le microbiome intestinal"
      ],
      controversies: [
        "Utilité limitée des tests sériques standard pour évaluer le statut en magnésium",
        "Efficacité variable selon les formes chimiques"
      ],
      strengthOfEvidence: 0.85
    },
    
    formulations: [
      {
        type: "Citrate de magnésium",
        bioavailability: 0.3,
        advantages: ["Bonne biodisponibilité", "Effet légèrement laxatif bénéfique"],
        disadvantages: ["Peut causer des selles molles"]
      },
      {
        type: "Glycinate de magnésium",
        bioavailability: 0.4,
        advantages: ["Excellente biodisponibilité", "Bien toléré", "Idéal pour effets neurologiques"],
        disadvantages: ["Coût plus élevé"]
      },
      {
        type: "Thréonate de magnésium",
        bioavailability: 0.4,
        advantages: ["Traverse la barrière hémato-encéphalique", "Effets cognitifs supérieurs"],
        disadvantages: ["Coût élevé", "Nécessite des doses plus élevées"]
      },
      {
        type: "Oxyde de magnésium",
        bioavailability: 0.04,
        advantages: ["Concentration élevée en magnésium élémentaire", "Peu coûteux"],
        disadvantages: ["Très faible biodisponibilité", "Effet laxatif prononcé"]
      },
      {
        type: "Chlorure de magnésium",
        bioavailability: 0.2,
        advantages: ["Biodisponibilité moyenne", "Utile pour acidité gastrique"],
        disadvantages: ["Goût amer", "Peut irriter l'estomac"]
      }
    ],
    
    qualityConsiderations: {
      sourcingFactors: [
        "Pureté de la source minérale",
        "Contamination potentielle par métaux lourds",
        "Type de chélation pour les formes organiques"
      ],
      processingFactors: [
        "Méthodes d'extraction et de purification",
        "Stabilisateurs et additifs utilisés"
      ],
      testingRecommendations: [
        "Vérification de la teneur en magnésium élémentaire",
        "Tests de métaux lourds",
        "Dissolution in vitro"
      ],
      stabilityFactors: [
        "Sensible à l'humidité pour certaines formes",
        "Stable à température ambiante"
      ],
      storageRequirements: [
        "Conserver dans un endroit frais et sec",
        "Protéger de la lumière directe"
      ]
    },
    
    specialConsiderations: [
      "L'effet thérapeutique optimal peut nécessiter 4-6 semaines de supplémentation continue",
      "La correction d'une déficience profonde peut prendre 3-6 mois",
      "Les formes liposomales peuvent offrir une meilleure biodisponibilité",
      "La biodisponibilité varie considérablement selon la forme chimique (oxyde < chlorure < citrate < glycinate < thréonate)"
    ],
    
    costEffectivenessRatio: 0.8,
    
    sustainabilityIssues: [
      "L'extraction minière du magnésium peut avoir un impact environnemental",
      "Les formes synthétiques ont généralement une empreinte carbone plus élevée"
    ],
    
    effectModifiers: [
      {
        factor: "Déficit en vitamine D",
        impact: "Réduction de l'absorption et de l'efficacité",
        direction: "decrease",
        magnitude: 0.3
      },
      {
        factor: "Exposition au stress chronique",
        impact: "Augmentation des besoins",
        direction: "increase",
        magnitude: 0.4
      },
      {
        factor: "Consommation d'alcool élevée",
        impact: "Augmentation de l'excrétion rénale",
        direction: "decrease",
        magnitude: 0.5
      },
      {
        factor: "Activité physique intense",
        impact: "Augmentation des besoins via la transpiration",
        direction: "increase",
        magnitude: 0.3
      },
      {
        factor: "Alimentation riche en produits raffinés",
        impact: "Aggravation des déficiences et réduction de l'efficacité",
        direction: "decrease",
        magnitude: 0.4
      }
    ]
  },
  "zinc": {
    id: "zinc",
    name: "Zinc",
    description: "Oligo-élément essentiel à de nombreux processus biochimiques et à la fonction immunitaire",
    category: "mineral",
    activeCompounds: ["Zinc élémentaire"],
    primaryBenefits: [
      "Support immunitaire",
      "Cicatrisation des tissus",
      "Fonction enzymatique",
      "Santé de la peau"
    ],
    secondaryBenefits: [
      "Fonction cognitive",
      "Métabolisme hormonal",
      "Protection antioxydante",
      "Santé prostatique"
    ],
    mechanismsOfAction: [
      "Cofacteur pour plus de 300 enzymes",
      "Stabilisation de membranes cellulaires",
      "Régulation de l'expression génique",
      "Modulation de la réponse immunitaire"
    ],
    targetSystems: ["immune", "integumentary", "endocrine", "digestive"],
    commonDosages: {
      standard: "15-30mg par jour",
      minimum: "8mg par jour",
      maximum: "40mg par jour",
      timing: "Avec un repas pour réduire l'irritation gastrique"
    },
    absorptionFactors: {
      enhancers: ["Protéines animales", "Acides organiques", "Vitamine A"],
      inhibitors: ["Phytates", "Excès de fer", "Excès de calcium", "Excès de cuivre"],
      fatSoluble: false,
      waterSoluble: true
    },
    safetyProfile: {
      sideEffects: ["Nausées", "Goût métallique", "Diminution d'absorption du cuivre à doses élevées"],
      contraindications: ["Excès de zinc préexistant", "Déficit en cuivre"],
      drugInteractions: ["Antibiotiques quinolones", "Tétracyclines", "Pénicillamine"],
      pregnancySafety: "safe",
      longTermSafety: "well_established"
    },
    scientificEvidence: {
      level: "strong",
      keyStudies: [
        "Méta-analyse sur le zinc et les infections respiratoires (Singh & Das, 2013)",
        "Étude sur le zinc et la cicatrisation (Lansdown et al., 2007)"
      ],
      researchGaps: [
        "Doses optimales pour différentes conditions immunitaires",
        "Effets à long terme sur les biomarqueurs inflammatoires"
      ]
    }
  },
  "vitamin_d3": {
    id: "vitamin_d3",
    name: "Vitamine D3",
    latinName: "Cholecalciférol",
    description: "Hormone stéroïdienne essentielle pour l'absorption du calcium et de nombreuses fonctions métaboliques",
    category: "vitamin",
    activeCompounds: ["Cholécalciférol", "Calcitriol (forme active)"],
    primaryBenefits: [
      "Absorption du calcium",
      "Santé osseuse",
      "Fonction immunitaire",
      "Régulation hormonale"
    ],
    secondaryBenefits: [
      "Santé cardiovasculaire",
      "Équilibre émotionnel",
      "Fonction musculaire",
      "Métabolisme du glucose"
    ],
    mechanismsOfAction: [
      "Régulation de l'expression génique via récepteurs nucléaires",
      "Stimulation de l'absorption intestinale du calcium",
      "Modulation des cellules immunitaires",
      "Régulation de la prolifération cellulaire"
    ],
    targetSystems: ["musculoskeletal", "immune", "endocrine", "cardiovascular"],
    commonDosages: {
      standard: "1000-2000 UI par jour",
      minimum: "600 UI par jour",
      maximum: "4000 UI par jour",
      timing: "Avec un repas contenant des graisses pour une meilleure absorption"
    },
    absorptionFactors: {
      enhancers: ["Graisses alimentaires", "Magnésium", "Vitamine K2"],
      inhibitors: ["Obésité", "Syndromes de malabsorption", "Insuffisance hépatique"],
      fatSoluble: true,
      waterSoluble: false
    },
    safetyProfile: {
      sideEffects: ["Hypercalcémie à doses très élevées", "Calculs rénaux (rares)"],
      contraindications: ["Hypercalcémie", "Sarcoïdose", "Hyperparathyroïdie"],
      drugInteractions: ["Corticostéroïdes", "Anticonvulsivants", "Statines"],
      pregnancySafety: "safe",
      longTermSafety: "well_established"
    },
    scientificEvidence: {
      level: "strong",
      keyStudies: [
        "Méta-analyse sur la vitamine D et la mortalité (Autier & Gandini, 2007)",
        "Étude sur la vitamine D et la fonction immunitaire (Aranow, 2011)"
      ],
      researchGaps: [
        "Niveaux optimaux pour différentes populations ethniques",
        "Effets sur l'immunité adaptative spécifique"
      ]
    }
  },
  "omega3": {
    id: "omega3",
    name: "Oméga-3 EPA/DHA",
    description: "Acides gras essentiels polyinsaturés importants pour la santé cardiovasculaire et cérébrale",
    category: "fatty_acid",
    activeCompounds: ["Acide eicosapentaénoïque (EPA)", "Acide docosahexaénoïque (DHA)"],
    primaryBenefits: [
      "Santé cardiovasculaire",
      "Fonction cognitive",
      "Réduction de l'inflammation",
      "Support neurologique"
    ],
    secondaryBenefits: [
      "Santé oculaire",
      "Équilibre émotionnel",
      "Santé cutanée",
      "Support pendant la grossesse"
    ],
    mechanismsOfAction: [
      "Production de médiateurs anti-inflammatoires",
      "Incorporation dans les membranes cellulaires",
      "Modulation de l'expression génique",
      "Régulation des voies de signalisation cellulaire"
    ],
    targetSystems: ["cardiovascular", "nervous", "immune", "integumentary"],
    commonDosages: {
      standard: "1000-2000mg combinés EPA/DHA par jour",
      minimum: "500mg combinés EPA/DHA par jour",
      maximum: "3000mg combinés EPA/DHA par jour",
      timing: "Avec les repas pour réduire les reflux"
    },
    absorptionFactors: {
      enhancers: ["Repas gras", "Émulsifiants", "Enzymes lipases"],
      inhibitors: ["Alcool excessif", "Problèmes d'absorption des graisses"],
      fatSoluble: true,
      waterSoluble: false
    },
    safetyProfile: {
      sideEffects: ["Éructations à goût de poisson", "Reflux gastrique", "Risque de saignement à doses très élevées"],
      contraindications: ["Troubles de la coagulation sévères", "Allergie aux poissons (pour certaines sources)"],
      drugInteractions: ["Anticoagulants", "Antiplaquettaires", "Anti-inflammatoires"],
      pregnancySafety: "safe",
      longTermSafety: "well_established"
    },
    scientificEvidence: {
      level: "strong",
      keyStudies: [
        "Méta-analyse sur les oméga-3 et les maladies cardiovasculaires (Mozaffarian & Wu, 2011)",
        "Étude sur DHA et développement cognitif (Kuratko et al., 2013)"
      ],
      researchGaps: [
        "Ratios optimaux EPA:DHA pour différentes conditions",
        "Formes optimales d'administration"
      ]
    }
  },
  "vitamin_c": {
    id: "vitamin_c",
    name: "Vitamine C",
    latinName: "Acide ascorbique",
    description: "Puissant antioxydant hydrosoluble essentiel à la synthèse du collagène et à la fonction immunitaire",
    category: "vitamin",
    activeCompounds: ["Acide ascorbique", "Déhydroascorbate"],
    primaryBenefits: [
      "Soutien immunitaire",
      "Protection antioxydante",
      "Synthèse du collagène",
      "Absorption du fer non-héminique"
    ],
    secondaryBenefits: [
      "Santé cardiovasculaire",
      "Santé de la peau",
      "Fonction cognitive",
      "Production d'énergie cellulaire"
    ],
    mechanismsOfAction: [
      "Donneur d'électrons dans les réactions enzymatiques",
      "Cofacteur pour la synthèse du collagène",
      "Recyclage d'autres antioxydants",
      "Modulation de la signalisation redox"
    ],
    targetSystems: ["immune", "integumentary", "cardiovascular", "nervous"],
    commonDosages: {
      standard: "500-1000mg par jour",
      minimum: "75-90mg par jour",
      maximum: "2000mg par jour",
      timing: "Fractionné dans la journée pour maintenir des niveaux sanguins stables"
    },
    absorptionFactors: {
      enhancers: ["Flavonoïdes", "Doses fractionnées", "Formulations liposomales"],
      inhibitors: ["Fumée de cigarette", "Alcool", "Cuisson excessive", "Stress oxydatif élevé"],
      fatSoluble: false,
      waterSoluble: true
    },
    safetyProfile: {
      sideEffects: ["Troubles digestifs à doses élevées", "Diarrhée osmotique", "Acidité urinaire accrue"],
      contraindications: ["Hémochromatose", "Thalassémie", "Prédisposition aux calculs rénaux d'oxalate"],
      drugInteractions: ["Anticoagulants", "Chimothérapies", "Contraceptifs oraux"],
      pregnancySafety: "safe",
      longTermSafety: "well_established"
    },
    scientificEvidence: {
      level: "strong",
      keyStudies: [
        "Méta-analyse sur la vitamine C et les infections respiratoires (Hemilä & Chalker, 2013)",
        "Étude sur la vitamine C et la fonction endothéliale (Ashor et al., 2014)"
      ],
      researchGaps: [
        "Pharmacocinétique des différentes formes",
        "Impact sur la méthylation de l'ADN"
      ]
    }
  },
  "quercetin": {
    id: "quercetin",
    name: "Quercétine",
    description: "Flavonoïde polyphénolique aux propriétés anti-inflammatoires et antioxydantes puissantes",
    category: "other",
    activeCompounds: ["Quercétine", "Quercétine-3-O-glucoside", "Quercétine-3-O-rutinoside"],
    primaryBenefits: [
      "Effets anti-inflammatoires",
      "Protection antioxydante",
      "Support immunitaire",
      "Santé cardiovasculaire"
    ],
    secondaryBenefits: [
      "Stabilisation des mastocytes",
      "Support anti-allergique",
      "Modulation de la glycémie",
      "Santé mitochondriale"
    ],
    mechanismsOfAction: [
      "Inhibition des voies inflammatoires (NF-κB, COX, LOX)",
      "Piégeage des radicaux libres",
      "Chélation des métaux pro-oxydants",
      "Modulation de l'expression des enzymes de détoxification"
    ],
    targetSystems: ["immune", "cardiovascular", "respiratory", "endocrine"],
    commonDosages: {
      standard: "500-1000mg par jour",
      minimum: "250mg par jour",
      maximum: "1500mg par jour",
      timing: "Avec des repas contenant des graisses, idéalement divisé en 2 prises"
    },
    absorptionFactors: {
      enhancers: ["Bromélaïne", "Vitamine C", "Lipides", "Formulations phytosomales"],
      inhibitors: ["Faible biodisponibilité naturelle", "Métabolisme de premier passage hépatique"],
      fatSoluble: true,
      waterSoluble: false
    },
    safetyProfile: {
      sideEffects: ["Maux de tête (rares)", "Troubles digestifs légers à doses élevées"],
      contraindications: ["Allergies aux flavonoïdes", "Prudence avec certains médicaments métabolisés par CYP3A4"],
      drugInteractions: ["Anticoagulants", "Inhibiteurs de CYP3A4", "Transporteurs P-gp"],
      pregnancySafety: "insufficient_data",
      longTermSafety: "likely_safe"
    },
    scientificEvidence: {
      level: "moderate",
      keyStudies: [
        "Étude sur la quercétine et l'inflammation (Li et al., 2016)",
        "Recherche sur la quercétine et la fonction endothéliale (Perez-Vizcaino et al., 2010)"
      ],
      researchGaps: [
        "Biodisponibilité des différentes formulations",
        "Effets à long terme sur les biomarqueurs inflammatoires"
      ]
    },
    specialConsiderations: [
      "La combinaison avec bromélaïne et vitamine C améliore significativement l'absorption",
      "Les formes phytosomales ont une biodisponibilité jusqu'à 20 fois supérieure"
    ]
  },
  "nac": {
    id: "nac",
    name: "N-Acétyl Cystéine",
    description: "Précurseur du glutathion avec des propriétés mucolytiques et antioxydantes puissantes",
    category: "amino",
    activeCompounds: ["N-Acétyl-L-Cystéine", "L-Cystéine (après métabolisme)"],
    primaryBenefits: [
      "Production de glutathion",
      "Effets mucolytiques",
      "Détoxification hépatique",
      "Protection antioxydante"
    ],
    secondaryBenefits: [
      "Santé respiratoire",
      "Fonction cognitive",
      "Support immunitaire",
      "Santé cardiovasculaire"
    ],
    mechanismsOfAction: [
      "Précurseur direct du glutathion intracellulaire",
      "Rupture des ponts disulfure dans les mucines",
      "Modulation des voies inflammatoires",
      "Chélation des métaux lourds"
    ],
    targetSystems: ["respiratory", "immune", "digestive", "nervous"],
    commonDosages: {
      standard: "600-1200mg par jour",
      minimum: "500mg par jour",
      maximum: "1800mg par jour",
      timing: "À jeun ou 2h après les repas, à distance des protéines"
    },
    absorptionFactors: {
      enhancers: ["Prise à jeun", "Vitamine C", "Gingembre"],
      inhibitors: ["Prise avec des protéines", "Oxydation de la substance"],
      fatSoluble: false,
      waterSoluble: true
    },
    safetyProfile: {
      sideEffects: ["Nausées", "Reflux gastrique", "Réactions cutanées (rares)"],
      contraindications: ["Asthme non contrôlé (dans certains cas)", "Ulcères gastro-intestinaux actifs"],
      drugInteractions: ["Nitroglycérine", "Carbamazépine", "Certaines chimiothérapies"],
      pregnancySafety: "caution",
      longTermSafety: "likely_safe"
    },
    scientificEvidence: {
      level: "moderate",
      keyStudies: [
        "Méta-analyse sur NAC et BPCO (Cazzola et al., 2015)",
        "Étude sur NAC et compulsions (Grant et al., 2016)"
      ],
      researchGaps: [
        "Effets neuropsychiatriques à long terme",
        "Utilisation chronique et profil redox"
      ]
    },
    specialConsiderations: [
      "Odeur de soufre caractéristique",
      "Conservation dans un endroit frais et sec pour prévenir l'oxydation",
      "La forme liposomale offre une meilleure biodisponibilité"
    ]
  },
  "coq10": {
    id: "coq10",
    name: "Coenzyme Q10",
    latinName: "Ubiquinone/Ubiquinol",
    description: "Coenzyme essentielle à la production d'énergie cellulaire et puissant antioxydant lipophile",
    category: "other",
    activeCompounds: ["Ubiquinone (forme oxydée)", "Ubiquinol (forme réduite active)"],
    primaryBenefits: [
      "Production d'énergie mitochondriale",
      "Protection antioxydante",
      "Santé cardiovasculaire",
      "Santé musculaire"
    ],
    secondaryBenefits: [
      "Santé des gencives",
      "Protection neurologique",
      "Soutien à la fertilité",
      "Atténuation des effets secondaires des statines"
    ],
    mechanismsOfAction: [
      "Transport d'électrons dans la chaîne respiratoire mitochondriale",
      "Protection des membranes contre la peroxydation lipidique",
      "Régénération d'autres antioxydants",
      "Stabilisation des membranes cellulaires"
    ],
    targetSystems: ["cardiovascular", "musculoskeletal", "nervous", "immune"],
    commonDosages: {
      standard: "100-200mg par jour",
      minimum: "30mg par jour",
      maximum: "300mg par jour",
      timing: "Avec un repas contenant des graisses pour améliorer l'absorption"
    },
    absorptionFactors: {
      enhancers: ["Huiles/graisses", "Poivre noir", "Forme d'ubiquinol", "Formulations micellaires"],
      inhibitors: ["Âge avancé", "Prise sans matières grasses", "Statines"],
      fatSoluble: true,
      waterSoluble: false
    },
    safetyProfile: {
      sideEffects: ["Troubles digestifs légers", "Insomnie (si pris le soir)", "Baisse de tension (rare)"],
      contraindications: ["Prudence avec anticoagulants", "Prudence avec chimiothérapie"],
      drugInteractions: ["Warfarine", "Statines", "Bêta-bloquants"],
      pregnancySafety: "insufficient_data",
      longTermSafety: "likely_safe"
    },
    scientificEvidence: {
      level: "moderate",
      keyStudies: [
        "Méta-analyse sur CoQ10 et insuffisance cardiaque (Fotino et al., 2013)",
        "Étude sur CoQ10 et migraines (Sândor et al., 2005)"
      ],
      researchGaps: [
        "Biodisponibilité comparée des différentes formulations",
        "Effets sur la longévité humaine"
      ]
    },
    specialConsiderations: [
      "La forme ubiquinol est mieux absorbée chez les personnes de plus de 40 ans",
      "Les formulations liposomales ou avec émulsifiants améliorent l'absorption de 3-5 fois"
    ]
  }
};

export const getSupplement = (id: string): SupplementInfo | undefined => {
  return SUPPLEMENT_DATABASE[id];
};

export const getSupplementsByCategory = (category: string): SupplementInfo[] => {
  return Object.values(SUPPLEMENT_DATABASE).filter(supp => supp.category === category);
};

export const getSupplementsByTargetSystem = (system: string): SupplementInfo[] => {
  return Object.values(SUPPLEMENT_DATABASE).filter(supp => 
    supp.targetSystems.includes(system as any)
  );
};

export const getSupplementsByBenefit = (benefit: string): SupplementInfo[] => {
  return Object.values(SUPPLEMENT_DATABASE).filter(supp => 
    supp.primaryBenefits.some(b => b.toLowerCase().includes(benefit.toLowerCase())) ||
    supp.secondaryBenefits.some(b => b.toLowerCase().includes(benefit.toLowerCase()))
  );
};

export const getAllSupplementNames = (): Record<string, string> => {
  const result: Record<string, string> = {};
  Object.values(SUPPLEMENT_DATABASE).forEach(supp => {
    result[supp.id] = supp.name;
  });
  return result;
};