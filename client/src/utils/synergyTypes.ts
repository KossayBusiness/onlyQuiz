/**
 * Types et constantes pour le système de synergies avancé - v5.0
 * 
 * Ce système permet une classification extrêmement fine des effets synergiques
 * pour une personnalisation optimale des protocoles thérapeutiques
 */

// Catégories principales des synergies
export type SynergyCategory = 
  | 'absorption'       // Amélioration de l'absorption et de la biodisponibilité
  | 'metabolism'       // Optimisation des voies métaboliques et enzymatiques
  | 'function'         // Potentialisation des effets fonctionnels et biologiques
  | 'protection'       // Effets protecteurs synergiques contre le stress cellulaire
  | 'elimination'      // Soutien aux processus de détoxification et d'élimination
  | 'signaling'        // Modulation des voies de signalisation cellulaire
  | 'structural'       // Renforcement des structures cellulaires et tissulaires
  | 'energetic'        // Optimisation de la production et l'utilisation d'énergie
  | 'temporal'         // Modulation des effets temporels (durée d'action, latence)
  | 'adaptive';        // Amélioration des réponses adaptatives et homéostatiques

// Sous-catégories de synergies pour une classification plus précise
export type SynergySubCategory =
  // Sous-catégories d'absorption
  | 'enzymeInhibition'         // Inhibition d'enzymes qui dégradent les nutriments
  | 'transporterEnhancement'    // Amélioration des transporteurs membranaires
  | 'bioavailabilityBoost'      // Augmentation générale de la biodisponibilité
  | 'mucosalIntegrity'          // Amélioration de l'intégrité des muqueuses digestives
  | 'biliarySupportEnhanced'    // Soutien à la fonction biliaire
  | 'lymphaticUpregulation'     // Amélioration de l'absorption lymphatique
  | 'solubilityEnhancement'     // Augmentation de la solubilité des composés
  
  // Sous-catégories de métabolisme
  | 'metabolicActivation'       // Activation des voies métaboliques
  | 'enzymeInduction'           // Induction des enzymes métaboliques
  | 'cofactorRegeneration'      // Régénération des cofacteurs enzymatiques
  | 'metaboliteConversion'      // Conversion optimisée des métabolites
  | 'rateEnhancement'           // Accélération du taux métabolique
  | 'metabolicShunt'            // Réacheminement vers voies métaboliques spécifiques
  | 'phaseISupport'             // Soutien aux réactions de phase I
  | 'phaseIIUpregulation'       // Stimulation des réactions de phase II
  
  // Sous-catégories de fonction
  | 'receptorSensitization'     // Sensibilisation des récepteurs cellulaires
  | 'signalAmplification'       // Amplification des signaux cellulaires
  | 'neurotransmitterBalance'   // Équilibrage des neurotransmetteurs
  | 'hormoneModulation'         // Modulation des effets hormonaux
  | 'immuneCoordination'        // Coordination des réponses immunitaires
  | 'vasomotorRegulation'       // Régulation de la fonction vasomotrice
  | 'inflammatoryPathway'       // Modulation des voies inflammatoires
  | 'tissueSpecificEnhancement' // Amélioration d'effets tissus-spécifiques
  
  // Sous-catégories de protection
  | 'antioxidantNetwork'        // Réseau d'effets antioxydants
  | 'membraneFortification'     // Renforcement de l'intégrité membranaire
  | 'dnaProtection'             // Protection de l'ADN contre les dommages
  | 'mitoProtection'            // Protection des mitochondries
  | 'antiglycation'             // Prévention de la glycation
  | 'chelationSynergy'          // Synergie des effets de chélation
  | 'cellularDefenseInduction'  // Induction des défenses cellulaires
  | 'proteinStabilization'      // Stabilisation des protéines
  
  // Sous-catégories d'élimination
  | 'detoxificationSupport'     // Soutien général à la détoxification
  | 'renalClearanceEnhancement' // Amélioration de la clairance rénale
  | 'hepaticFlowOptimization'   // Optimisation du flux hépatique
  | 'lymphaticDrainageSupport'  // Soutien au drainage lymphatique
  | 'microbialClearance'        // Amélioration de l'élimination microbienne
  | 'toxinBindingEnhancement'   // Amélioration de la liaison des toxines
  | 'biliarySynergy'            // Synergie dans l'excrétion biliaire
  | 'bowelRegularity'           // Régulation du transit intestinal
  
  // Sous-catégories de signalisation
  | 'nucleotideSignaling'       // Signalisation par nucléotides
  | 'mapkPathwayModulation'     // Modulation des voies MAPK
  | 'nfkbRegulation'            // Régulation de NF-κB
  | 'ampkActivation'            // Activation d'AMPK
  | 'sirtuinUpregulation'       // Upregulation des sirtuines
  | 'calciumSignaling'          // Signalisation calcique
  | 'redoxSignaling'            // Signalisation redox
  | 'lipidMediators'            // Médiateurs lipidiques
  
  // Sous-catégories structurelles
  | 'collagenSupport'           // Soutien à la synthèse du collagène
  | 'membraneFluidityBalance'   // Équilibre de la fluidité membranaire
  | 'cytoarchitectureSupport'   // Soutien à la cytoarchitecture
  | 'junctionFortification'     // Renforcement des jonctions cellulaires
  | 'ecmStabilization'          // Stabilisation de la matrice extracellulaire
  | 'boneMatrixEnhancement'     // Amélioration de la matrice osseuse
  | 'proteoglycanSynthesis'     // Synthèse de protéoglycanes
  | 'microtubuleStability'      // Stabilité des microtubules
  
  // Sous-catégories énergétiques
  | 'atpProduction'             // Production d'ATP
  | 'electronTransportSupport'  // Soutien au transport d'électrons
  | 'krebs_cycle_enhancement'   // Amélioration du cycle de Krebs
  | 'glycolyticEfficiency'      // Efficacité glycolytique
  | 'betaOxidationSupport'      // Soutien à la bêta-oxydation
  | 'nadRegeneration'           // Régénération du NAD+
  | 'gluconeogenesisRegulation' // Régulation de la néoglucogenèse
  | 'insulinSensitivity'        // Sensibilité à l'insuline
  
  // Sous-catégories temporelles
  | 'halfLifeExtension'         // Extension de la demi-vie
  | 'sustainedReleaseSynergy'   // Synergie à libération prolongée
  | 'circadianOptimization'     // Optimisation circadienne
  | 'pulseReleaseCoordination'  // Coordination de libération pulsatile
  | 'chronotropicRegulation'    // Régulation chronotrope
  | 'multiphaseActivation'      // Activation multiphasique
  | 'sequentialReleasePattern'  // Schéma de libération séquentielle
  | 'metabolicTimingEffect'     // Effet de synchronisation métabolique
  
  // Sous-catégories adaptatives
  | 'hormeticAmplification'     // Amplification hormétique
  | 'stressResponsePriming'     // Préconditionnement à la réponse au stress
  | 'adaptogenicSynergy'        // Synergie adaptogène
  | 'allostericRegulation'      // Régulation allostérique
  | 'epigeneticModulation'      // Modulation épigénétique
  | 'plasticityEnhancement'     // Amélioration de la plasticité
  | 'preconditioning'           // Préconditionnement tissulaire
  | 'resiliencePromotion';      // Promotion de la résilience

export interface SynergyRecord {
  pair: [string, string]; // IDs des deux suppléments
  synergyScore: number; // Score de 0 à 1, indiquant la force de la synergie
  mechanism: string; // Description du mécanisme d'action
  effect: string; // Description de l'effet synergique
  category: SynergyCategory; // Catégorie principale de la synergie
  subCategory?: SynergySubCategory; // Sous-catégorie plus spécifique
  evidence: {
    level: string; // "strong", "moderate", "preliminary", "theoretical"
    summary: string; // Résumé des preuves scientifiques
    references?: string[]; // Références scientifiques (optionnel)
  };
  optimizationStrategy: {
    timing?: string; // Recommandation de prise (matin, soir, etc.)
    dosageAdjustment?: string; // Ajustement de dosage recommandé
    cyclicUse?: boolean; // Utilisation cyclique recommandée
    foodInteractions?: string[]; // Interactions avec la nourriture à considérer
  };
}

export interface SynergyNode {
  id: string; // ID du supplément
  name: string; // Nom complet du supplément
  strength: number; // Importance dans le réseau (0-1)
  category?: string; // Catégorie du supplément (optionnel)
}

export interface SynergyLink {
  source: string; // ID du supplément source
  target: string; // ID du supplément cible
  strength: number; // Force de la synergie (0-1)
  effect: string; // Type d'effet ('synergistic', 'additive', 'antagonistic', 'neutral')
  mechanism: string; // Type de mécanisme
}

export interface SynergyGraph {
  nodes: SynergyNode[];
  links: SynergyLink[];
}

export interface CompoundSynergyAnalysis {
  // Score global et pourcentage d'amélioration
  synergyScore: number;
  enhancementPercentage: number;
  
  // Interactions clés identifiées
  keyInteractions: {
    supplements: string[]; // IDs des suppléments impliqués (2 ou plus)
    mechanism: string; // Description du mécanisme d'interaction
    category: string; // Catégorie de l'interaction
  }[];
  
  // Graphe de synergies pour visualisation
  synergyGraph: SynergyGraph;
  
  // Stratégies optimales d'utilisation
  optimizationStrategies: {
    supplementId: string;
    recommendations: string[];
  }[];
  
  // Facteurs amplificateurs qui peuvent améliorer les synergies
  amplifyingFactors: {
    factor: string;
    description: string;
    supplements: string[];
  }[];
  
  // Effet des synergies sur les symptômes spécifiques
  symptomImpacts: {
    symptom: string;
    enhancedEffectiveness: number; // 0-1
    targetedSupplements: string[];
  }[];
}

// Couleurs par catégorie de synergie (palette étendue)
export const SYNERGY_CATEGORY_COLORS: Record<SynergyCategory, string> = {
  absorption: '#8B5CF6',    // Violet
  metabolism: '#EC4899',    // Rose
  function: '#10B981',      // Vert émeraude 
  protection: '#3B82F6',    // Bleu
  elimination: '#F59E0B',   // Ambre
  signaling: '#6366F1',     // Indigo
  structural: '#0EA5E9',    // Bleu ciel
  energetic: '#EF4444',     // Rouge
  temporal: '#8D8DAA',      // Gris bleuté
  adaptive: '#14B8A6',      // Turquoise
};

// Icônes par catégorie de synergie
export const SYNERGY_CATEGORY_ICONS: Record<SynergyCategory, string> = {
  absorption: 'filter',      // Filtre/absorption
  metabolism: 'activity',    // Graphique d'activité
  function: 'zap',           // Éclair pour activation
  protection: 'shield',      // Bouclier pour protection
  elimination: 'trash',      // Poubelle pour élimination
  signaling: 'radio',        // Ondes radio pour signalisation
  structural: 'layers',      // Couches pour structure
  energetic: 'battery',      // Batterie pour énergie
  temporal: 'clock',         // Horloge pour temporel
  adaptive: 'refresh-cw',    // Flèches circulaires pour adaptation
};

// Descriptions détaillées des catégories
export const SYNERGY_CATEGORY_DESCRIPTIONS: Record<SynergyCategory, string> = {
  absorption: 'Amélioration de l\'absorption et de la biodisponibilité des composés actifs, optimisant leur entrée dans le système circulatoire et les tissus cibles',
  metabolism: 'Optimisation des voies métaboliques et enzymatiques pour une transformation et utilisation plus efficace des nutriments et composés bioactifs',
  function: 'Potentialisation des effets fonctionnels et biologiques, amplifiant les bénéfices thérapeutiques et physiologiques',
  protection: 'Effets protecteurs synergiques contre les différentes formes de stress cellulaire, oxydatif et environnemental',
  elimination: 'Soutien aux processus de détoxification et d\'élimination des métabolites et toxines, optimisant la clairance',
  signaling: 'Modulation coordonnée des voies de signalisation cellulaire et des communications intercellulaires pour des réponses physiologiques optimisées',
  structural: 'Renforcement synergique des structures cellulaires et tissulaires, supportant l\'intégrité et la fonction des systèmes biologiques',
  energetic: 'Optimisation des processus de production et d\'utilisation d\'énergie cellulaire pour une efficacité métabolique supérieure',
  temporal: 'Synchronisation et modulation des effets temporels, permettant une coordination optimale des processus physiologiques dans le temps',
  adaptive: 'Amélioration des réponses adaptatives et homéostatiques, renforçant la résilience et la capacité d\'adaptation du corps aux stress et défis',
};

// Labels utilisateur-friendly pour les catégories de synergies
export const SYNERGY_CATEGORY_LABELS: Record<SynergyCategory, string> = {
  absorption: 'Absorption & biodisponibilité',
  metabolism: 'Métabolisme & transformation',
  function: 'Fonctions biologiques',
  protection: 'Protection cellulaire',
  elimination: 'Détoxification & élimination',
  signaling: 'Signalisation cellulaire',
  structural: 'Support structurel',
  energetic: 'Production d\'énergie',
  temporal: 'Coordination temporelle',
  adaptive: 'Adaptation & résilience',
};

/**
 * Obtient un label convivial pour une catégorie de synergie
 * @param category Catégorie de synergie
 * @returns Label utilisateur-friendly
 */
export function getCategoryLabel(category: SynergyCategory): string {
  return SYNERGY_CATEGORY_LABELS[category] || category;
}

// Descriptions scientifiques approfondies
export const SYNERGY_SCIENTIFIC_EXPLANATIONS: Record<SynergyCategory, string> = {
  absorption: 'Ces synergies modulent les mécanismes d\'absorption intestinale, la perméabilité des membranes, le transport actif et passif des nutriments, et les interactions avec les transporteurs membranaires comme les P-glycoprotéines et les protéines OATP. Elles peuvent inhiber les enzymes de phase I qui métabolisent prématurément les substances ou modifier le pH local pour favoriser l\'absorption.',
  
  metabolism: 'Ces interactions optimisent les voies métaboliques par modulation enzymatique (CYP450, UDP-glucuronosyltransférases), cofacteur synergique, régénération des intermédiaires métaboliques, et régulation allostérique des enzymes. Elles peuvent aussi réorienter le métabolisme vers des voies plus efficaces ou protectrices.',
  
  function: 'Ces synergies amplifient les effets biologiques par potentialisation des récepteurs (sensibilisation ou up-régulation), prolongation de la durée d\'action des médiateurs endogènes, modulation des seconds messagers intracellulaires, et coordination des cascades de signalisation parallèles ou convergentes.',
  
  protection: 'Les mécanismes protecteurs synergiques comprennent la régénération mutuelle des antioxydants (comme la vitamine E recyclée par la vitamine C), la diversification du ciblage antioxydant (hydrophile/lipophile), l\'induction coordonnée des enzymes de phase II (via les éléments de réponse antioxydante), et la stabilisation membranaire contre la peroxydation lipidique.',
  
  elimination: 'Ces synergies optimisent l\'élimination par induction coordonnée des transporteurs d\'efflux, potentialisation des voies de conjugaison hépatique (glutathion, sulfate, glucuronide), régulation du flux biliaire, amélioration de la filtration glomérulaire et de la sécrétion tubulaire, et modulation du transit intestinal pour l\'élimination finale.',
  
  signaling: 'Synergies qui orchestrent la signalisation cellulaire via modulation réciproque des voies de transduction (MAPK, JAK-STAT, NF-κB), intégration des signaux des récepteurs membranaires et nucléaires, régulation des protéines G et seconds messagers (AMPc, Ca2+, IP3), et ajustement de la phosphorylation des protéines cibles.',
  
  structural: 'Interactions qui renforcent les structures biologiques par amélioration de la synthèse et stabilité des constituants structurels (collagène, élastine, protéoglycanes), modulation de la composition et fluidité membranaire, optimisation des jonctions intercellulaires, et renforcement de la matrice extracellulaire.',
  
  energetic: 'Coordination synergique des processus bioénergétiques par optimisation de la phosphorylation oxydative, potentialisation du transport d\'électrons mitochondrial, équilibrage du ratio NAD+/NADH, amélioration de la biogenèse mitochondriale, et modulation du métabolisme du glucose et des acides gras pour la production d\'ATP.',
  
  temporal: 'Ces synergies modulent la chronopharmacologie via prolongation des demi-vies des composés actifs, programmation de libération séquentielle des effets, synchronisation avec les rythmes circadiens, coordination des phases métaboliques, et optimisation des fenêtres temporelles d\'efficacité.',
  
  adaptive: 'Synergies qui améliorent l\'adaptabilité physiologique par potentialisation des voies hormétiques, préconditionnement cellulaire, modulation des réponses au stress, optimisation de la plasticité neuronale et métabolique, et renforcement des mécanismes de résilience via régulation épigénétique et facteurs de transcription.',
};

// Stratégies d'optimisation détaillées par catégorie
export const OPTIMIZATION_STRATEGIES: Record<SynergyCategory, string[]> = {
  absorption: [
    'Prendre à distance des repas riches en fibres qui peuvent réduire l\'absorption',
    'Combiner avec des sources de graisses saines pour les composés liposolubles',
    'Éviter la prise simultanée avec des minéraux qui peuvent interférer',
    'Associer avec des extraits de poivre noir (pipérine) pour les composés à faible biodisponibilité',
    'Utiliser des formulations liposomales ou micellaires pour les nutriments sensibles',
    'Prendre à jeun ou avec un repas selon le mécanisme d\'absorption spécifique'
  ],
  metabolism: [
    'Synchroniser avec le rythme circadien (matin pour les activateurs métaboliques)',
    'Prendre après l\'activité physique pour optimiser l\'utilisation métabolique',
    'Espacer les prises pour maintenir des niveaux stables de cofacteurs métaboliques',
    'Combiner les nutriments qui participent aux mêmes voies métaboliques',
    'Associer les précurseurs métaboliques avec leurs cofacteurs enzymatiques',
    'Équilibrer les inducteurs enzymatiques de phase I et phase II'
  ],
  function: [
    'Coordonner les prises en fonction de l\'activité physiologique ciblée',
    'Alterner les suppléments complémentaires pour éviter l\'adaptation physiologique',
    'Ajuster les doses proportionnellement pour un équilibre optimal des effets',
    'Combiner les modulateurs du même système biologique pour un effet coordonné',
    'Synchroniser avec le besoin physiologique (pré-entraînement, récupération, etc.)',
    'Équilibrer les agonistes et modulateurs allostériques pour des effets optimaux'
  ],
  protection: [
    'Distribuer les prises d\'antioxydants tout au long de la journée pour une protection continue',
    'Augmenter temporairement les doses lors de périodes de stress oxydatif élevé',
    'Combiner différentes classes d\'antioxydants pour un effet réseau complet',
    'Associer les antioxydants liposolubles et hydrosolubles pour une protection complète',
    'Intégrer des inducteurs des enzymes antioxydantes endogènes (Nrf2) à long terme',
    'Alterner les cycles d\'utilisation pour éviter l\'adaptation et maintenir la sensibilité'
  ],
  elimination: [
    'Prendre les agents de détoxification à distance des autres suppléments (2-3 heures)',
    'Assurer une hydratation adéquate pour soutenir l\'élimination rénale',
    'Considérer des cycles d\'utilisation avec des périodes de repos',
    'Commencer par de faibles doses et augmenter progressivement pour minimiser les réactions',
    'Soutenir les différentes phases de détoxification de façon équilibrée',
    'Inclure des fibres et probiotiques pour faciliter l\'élimination intestinale'
  ],
  signaling: [
    'Coordonner les modulateurs des voies de signalisation complémentaires',
    'Combiner les activateurs de récepteurs avec les soutiens des messagers secondaires',
    'Synchroniser avec les moments de sensibilité physiologique accrue',
    'Éviter la suractivation prolongée des voies de signalisation',
    'Alterner les périodes d\'activation et de désensibilisation',
    'Combiner les modulateurs à action rapide et soutenue pour une couverture optimale'
  ],
  structural: [
    'Fournir tous les précurseurs structurels nécessaires simultanément',
    'Inclure les cofacteurs enzymatiques requis pour la biosynthèse structurelle',
    'Assurer un apport protéique adéquat en parallèle',
    'Prendre à des moments de récupération et régénération tissulaire',
    'Maintenir des apports réguliers et constants pour le soutien structurel',
    'Combiner avec des nutriments qui optimisent la circulation et l\'oxygénation tissulaire'
  ],
  energetic: [
    'Prendre les supports énergétiques avant les périodes d\'activité ou d\'effort',
    'Combiner les supports de différentes voies énergétiques (glycolyse, cycle de Krebs)',
    'Équilibrer les nutriments qui soutiennent la production et l\'utilisation d\'ATP',
    'Associer les supports mitochondriaux avec les antioxydants spécifiques',
    'Synchroniser avec l\'activité physique pour maximiser l\'effet',
    'Adapter les ratios en fonction du type d\'énergie requis (endurance vs puissance)'
  ],
  temporal: [
    'Répartir les prises selon un schéma temporel optimisé pour chaque effet',
    'Coordonner la séquence des suppléments pour des effets en cascade',
    'Synchroniser avec les rythmes circadiens des systèmes physiologiques ciblés',
    'Alterner les activateurs aigus et les soutiens à long terme',
    'Utiliser des formulations à libération contrôlée pour les effets chronoprogrammés',
    'Adapter le timing en fonction des habitudes de sommeil et d\'activité'
  ],
  adaptive: [
    'Introduire progressivement pour permettre l\'adaptation physiologique',
    'Varier l\'intensité des stimuli adaptogènes pour éviter l\'habituation',
    'Combiner différentes classes d\'adaptogènes pour une couverture complète',
    'Incorporer des périodes de repos dans les cycles d\'utilisation',
    'Synchroniser avec les périodes de récupération et de stress',
    'Augmenter graduellement la complexité du protocole adaptatif'
  ]
};

// Biomarqueurs cibles par catégorie de synergie
export const TARGET_BIOMARKERS: Record<SynergyCategory, string[]> = {
  absorption: [
    'Niveaux sériques des nutriments', 
    'Saturation des transporteurs', 
    'Indicateurs de perméabilité intestinale',
    'Marqueurs d\'inflammation intestinale'
  ],
  metabolism: [
    'Activité enzymatique', 
    'Ratio des métabolites', 
    'Profil des acides organiques urinaires',
    'Métabolomique ciblée'
  ],
  function: [
    'Marqueurs fonctionnels spécifiques aux organes', 
    'Indices homéostatiques', 
    'Profils hormonaux',
    'Biomarqueurs de signalisation cellulaire'
  ],
  protection: [
    'Marqueurs de stress oxydatif', 
    'Capacité antioxydante totale', 
    '8-OHdG et autres marqueurs de dommage à l\'ADN',
    'Niveau des enzymes antioxydantes endogènes'
  ],
  elimination: [
    'Profil des toxines', 
    'Capacité de détoxification hépatique', 
    'Marqueurs de stress toxique',
    'Clairance métabolique'
  ],
  signaling: [
    'Concentration des seconds messagers', 
    'Activité des protéines kinases', 
    'Statut de phosphorylation des cibles',
    'Expression des facteurs de transcription'
  ],
  structural: [
    'Biomarqueurs de renouvellement du collagène', 
    'Paramètres de la matrice extracellulaire', 
    'Intégrité membranaire',
    'Marqueurs de structure tissulaire'
  ],
  energetic: [
    'ATP/ADP ratio', 
    'Lactate/pyruvate ratio', 
    'Fonction mitochondriale',
    'Marqueurs métaboliques énergétiques'
  ],
  temporal: [
    'Rythmes circadiens des biomarqueurs', 
    'Profils temporels d\'activité/concentration', 
    'Variabilité des réponses physiologiques',
    'Timing des pics d\'efficacité'
  ],
  adaptive: [
    'Marqueurs de résilience', 
    'Adaptation au stress', 
    'Indices de plasticité neuronale et métabolique',
    'Profil des facteurs de transcription adaptogènes'
  ]
};