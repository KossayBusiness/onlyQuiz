/**
 * Système de recommandation avancé pour les compléments alimentaires naturels
 * Implémente une logique sophistiquée pour générer des recommandations personnalisées
 */

import { UserProfile, SupplementInfo, RecommendationResult, SupplementRecommendation } from './types';

// Importer les systèmes de priorité et les mappages
import { SYMPTOM_PRIORITY_WEIGHTS, GOAL_PRIORITY_WEIGHTS, analyzeSymptomRelationships, analyzeTreatmentPriorities } from './prioritizationSystem';

// Catalogue de compléments (version simplifiée pour démonstration)
const SUPPLEMENT_CATALOG: Record<string, SupplementInfo> = {
  'magnesium_glycinate': {
    id: 'magnesium_glycinate',
    name: 'Magnésium Glycinate',
    description: 'Forme hautement biodisponible et douce pour le système digestif',
    primaryBenefits: ['réduction du stress', 'amélioration du sommeil', 'relaxation musculaire'],
    secondaryBenefits: ['soutien métabolique', 'fonction cognitive', 'santé cardiaque'],
    targetSymptoms: ['stress', 'insomnie', 'fatigue', 'crampes musculaires', 'anxiété'],
    targetGoals: ['amélioration du sommeil', 'gestion du stress', 'santé nerveuse'],
    scientificEvidence: 0.85,
    mechanisms: ['Cofacteur pour plus de 300 réactions enzymatiques', 'Régulation des neurotransmetteurs inhibiteurs'],
    forms: ['capsules', 'poudre'],
    recommendedDosage: '300-400mg par jour, de préférence le soir',
    bioavailability: 0.8,
    interactions: ['Peut réduire l\'absorption de certains médicaments'],
    purity: 0.95,
    naturalSource: true,
    certifications: ['GMP', 'Sans OGM'],
    effectTimeline: 'Effets sur le stress et le sommeil généralement perceptibles en 1-2 semaines'
  },
  'omega3': {
    id: 'omega3',
    name: 'Oméga-3 EPA/DHA',
    description: 'Acides gras essentiels hautement purifiés',
    primaryBenefits: ['réduction de l\'inflammation', 'santé cardiovasculaire', 'fonction cognitive'],
    secondaryBenefits: ['santé articulaire', 'équilibre émotionnel', 'santé de la peau'],
    targetSymptoms: ['inflammation', 'douleurs articulaires', 'troubles cognitifs', 'peau sèche'],
    targetGoals: ['santé cardiovasculaire', 'fonction cognitive', 'longévité', 'anti-inflammation'],
    scientificEvidence: 0.9,
    mechanisms: ['Modulation des voies inflammatoires', 'Amélioration de la fluidité membranaire'],
    forms: ['capsules', 'liquide'],
    recommendedDosage: '1000-2000mg d\'EPA+DHA combinés par jour',
    bioavailability: 0.7,
    interactions: ['Peut augmenter le risque de saignement avec anticoagulants'],
    purity: 0.98,
    naturalSource: true,
    certifications: ['IFOS', 'Sans métaux lourds'],
    effectTimeline: 'Effets anti-inflammatoires observables après 2-3 mois d\'utilisation régulière'
  },
  'vitaminD3': {
    id: 'vitaminD3',
    name: 'Vitamine D3',
    description: 'Forme hautement active de la vitamine D',
    primaryBenefits: ['soutien immunitaire', 'santé osseuse', 'équilibre hormonal'],
    secondaryBenefits: ['humeur équilibrée', 'santé cardiovasculaire', 'fonction musculaire'],
    targetSymptoms: ['fatigue', 'faiblesse immunitaire', 'humeur basse', 'douleurs osseuses'],
    targetGoals: ['renforcement immunitaire', 'santé osseuse', 'équilibre hormonal'],
    scientificEvidence: 0.9,
    mechanisms: ['Régulation de l\'expression génique', 'Amélioration de l\'absorption du calcium'],
    forms: ['capsules', 'gouttes'],
    recommendedDosage: '1000-5000UI par jour selon les besoins',
    bioavailability: 0.85,
    interactions: ['Précaution en cas d\'hypercalcémie ou de problèmes rénaux'],
    purity: 0.96,
    naturalSource: true,
    certifications: ['GMP', 'Sans OGM'],
    effectTimeline: 'Normalisation des niveaux sanguins en 1-2 mois, effets cliniques en 3-6 mois'
  }
};

/**
 * Génère des recommandations personnalisées de compléments alimentaires
 * @param userProfile Profil complet de l'utilisateur
 * @returns Résultat détaillé avec recommandations personnalisées
 */
export function generatePersonalizedRecommendations(userProfile: UserProfile): RecommendationResult {
  // Analyser les priorités de traitement
  const priorityAnalysis = {
    symptomPriorities: userProfile.symptoms || {},
    goalPriorities: userProfile.goals || {},
    lifestyleFactors: ['moderate_stress', 'inadequate_sleep'],
    treatmentApproach: 'Holistique avec focus sur les symptômes prioritaires'
  };
  
  // Calculer le score de correspondance pour chaque complément
  const supplementMatches: Record<string, any> = {};
  
  Object.values(SUPPLEMENT_CATALOG).forEach(supplement => {
    const scoreData = calculateSupplementMatchScore(supplement, userProfile, priorityAnalysis);
    supplementMatches[supplement.id] = scoreData;
  });
  
  // Trier les compléments par score de correspondance
  const rankedSupplements = Object.entries(supplementMatches)
    .sort((a, b) => b[1].overallScore - a[1].overallScore)
    .map(([supplementId, scoreData]) => createRecommendation(supplementId, scoreData, userProfile));
  
  // Séparer les recommandations primaires et secondaires
  const primaryRecommendations = rankedSupplements.slice(0, 3);
  const secondaryRecommendations = rankedSupplements.slice(3, 6);
  
  // Générer des recommandations complémentaires
  const lifestyleRecommendations = [
    "Pratiquez 30 minutes d'activité physique 5 fois par semaine",
    "Intégrez des techniques de réduction du stress comme la méditation",
    "Établissez une routine de sommeil régulière"
  ];
  
  const dietaryRecommendations = [
    "Augmentez votre consommation d'aliments riches en magnésium (légumes verts à feuilles, noix)",
    "Consommez des poissons gras riches en oméga-3 deux fois par semaine",
    "Limitez la consommation d'aliments transformés et riches en sucres ajoutés"
  ];
  
  const followUpRecommendations = [
    "Réévaluez vos symptômes après 4-8 semaines d'utilisation des compléments recommandés",
    "Consultez un professionnel de santé pour un bilan sanguin complet",
    "Envisagez une consultation avec un nutritionniste pour une alimentation personnalisée"
  ];
  
  // Assembler le résultat final
  return {
    primaryRecommendations,
    secondaryRecommendations,
    symptomAnalysis: Object.values(priorityAnalysis.symptomPriorities).map(s => ({
      name: s,
      priority: 0.8,
      relatedSupplements: [primaryRecommendations[0].id]
    })),
    goalAnalysis: Object.values(priorityAnalysis.goalPriorities).map(g => ({
      name: g,
      priority: 0.8,
      relatedSupplements: [primaryRecommendations[0].id]
    })),
    lifestyleRecommendations,
    dietaryRecommendations,
    followUpRecommendations,
    generationDate: new Date().toISOString()
  };
}

/**
 * Calcule le score de correspondance entre un complément et le profil utilisateur
 */
function calculateSupplementMatchScore(
  supplement: SupplementInfo,
  userProfile: UserProfile,
  priorityAnalysis: any
): any {
  // Score d'efficacité pour les symptômes
  let symptomScore = 0;
  let targetSymptoms: string[] = [];
  let symptomCount = 0;
  
  Object.entries(userProfile.symptoms || {}).forEach(([symptom, severity]) => {
    if (supplement.targetSymptoms.includes(symptom)) {
      symptomScore += (severity / 10) * 0.8;
      targetSymptoms.push(symptom);
      symptomCount++;
    }
  });
  
  // Normaliser le score des symptômes
  const normalizedSymptomScore = symptomCount > 0 ? symptomScore / symptomCount : 0;
  
  // Score d'efficacité pour les objectifs
  let goalScore = 0;
  let targetGoals: string[] = [];
  let goalCount = 0;
  
  Object.entries(userProfile.goals || {}).forEach(([goal, importance]) => {
    if (supplement.targetGoals.includes(goal)) {
      goalScore += (importance / 10) * 0.8;
      targetGoals.push(goal);
      goalCount++;
    }
  });
  
  // Normaliser le score des objectifs
  const normalizedGoalScore = goalCount > 0 ? goalScore / goalCount : 0;
  
  // Calculer le score global
  // Pondération: 60% symptômes, 30% objectifs, 10% preuves scientifiques
  const overallScore = (normalizedSymptomScore * 0.6) + 
                      (normalizedGoalScore * 0.3) + 
                      (supplement.scientificEvidence * 0.1);
  
  // Créer un objet avec les données de score et d'analyse
  return {
    overallScore,
    symptomScore: normalizedSymptomScore,
    goalScore: normalizedGoalScore,
    targetSymptoms,
    targetGoals,
    evidenceScore: supplement.scientificEvidence,
    effectivenessScore: overallScore * 100 // Score d'efficacité en pourcentage
  };
}

/**
 * Crée une recommandation détaillée pour un complément
 */
function createRecommendation(
  supplementId: string,
  scoreData: any,
  userProfile: UserProfile
): SupplementRecommendation {
  const supplement = SUPPLEMENT_CATALOG[supplementId];
  
  // Générer une explication personnalisée
  const personalizedReason = generatePersonalizedReason(
    supplement, 
    scoreData.targetSymptoms, 
    scoreData.targetGoals,
    userProfile
  );
  
  // Générer un schéma posologique
  const dosageSchedule = generateDosageSchedule(supplement, userProfile);
  
  // Calculer le délai d'efficacité attendu
  const effectivenessTiming = estimateEffectivenessTiming(supplement, scoreData.targetSymptoms);
  
  // Créer la recommandation
  return {
    id: supplement.id,
    name: supplement.name,
    description: supplement.description,
    matchScore: Math.round(scoreData.overallScore * 100),
    personalizedReason,
    dosageRecommendation: dosageSchedule,
    targetSymptoms: scoreData.targetSymptoms,
    targetGoals: scoreData.targetGoals,
    scientificEvidence: {
      level: supplement.scientificEvidence * 100,
      summary: `Niveau d\'évidence scientifique: ${Math.round(supplement.scientificEvidence * 100)}%`
    },
    cautions: supplement.interactions,
    form: supplement.forms[0],
    effectivenessTiming,
    compatibleSupplements: findCompatibleSupplements(supplement, userProfile),
    simplifiedMechanism: getSimplifiedMechanism(supplement)
  };
}

/**
 * Génère une explication personnalisée pour la recommandation d'un complément
 */
function generatePersonalizedReason(
  supplement: SupplementInfo,
  targetSymptoms: string[],
  targetGoals: string[],
  userProfile: UserProfile
): string {
  // Construire une explication basée sur les symptômes ciblés
  let symptomPart = '';
  if (targetSymptoms.length > 0) {
    symptomPart = `Le ${supplement.name} est recommandé pour aider à soulager vos symptômes de ${targetSymptoms.join(', ')}. `;
  }
  
  // Ajouter une explication basée sur les objectifs
  let goalPart = '';
  if (targetGoals.length > 0) {
    goalPart = `Il soutient également vos objectifs de ${targetGoals.join(', ')}. `;
  }
  
  // Ajouter une explication sur le mécanisme d'action
  const mechanismPart = `${supplement.name} agit principalement en ${getSimplifiedMechanism(supplement)}. `;
  
  // Combiner les explications
  return symptomPart + goalPart + mechanismPart;
}

/**
 * Simplifie le mécanisme d'action d'un complément pour une explication accessible
 */
function getSimplifiedMechanism(supplement: SupplementInfo): string {
  if (supplement.id === 'magnesium_glycinate') {
    return "soutenant le système nerveux et en favorisant la relaxation musculaire";
  } else if (supplement.id === 'omega3') {
    return "réduisant l\'inflammation et en améliorant la communication cellulaire";
  } else if (supplement.id === 'vitaminD3') {
    return "renforçant le système immunitaire et en soutenant la santé osseuse";
  }
  
  // Cas par défaut
  return "soutenant les fonctions biologiques essentielles";
}

// Fonctions supplémentaires pour la génération de recommandations détaillées
function generateDosageSchedule(supplement: SupplementInfo, userProfile: UserProfile): string {
  // Version simplifiée pour la démonstration
  return supplement.recommendedDosage;
}

function estimateEffectivenessTiming(supplement: SupplementInfo, targetSymptoms: string[]): string {
  // Version simplifiée pour la démonstration
  return supplement.effectTimeline;
}

function findCompatibleSupplements(supplement: SupplementInfo, userProfile: UserProfile): string[] {
  // Version simplifiée pour la démonstration
  if (supplement.id === 'magnesium_glycinate') {
    return ['vitaminD3'];
  } else if (supplement.id === 'omega3') {
    return ['vitaminD3', 'magnesium_glycinate'];
  } else {
    return ['omega3', 'magnesium_glycinate'];
  }
}