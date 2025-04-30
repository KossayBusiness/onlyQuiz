/**
 * Système de recommandation pour les suppléments alimentaires naturels
 */
import { QuizResponse, RecommendationResult, SupplementRecommendation } from "@/utils/types";

// Mappage entre les clés du quiz et les symptômes/objectifs du catalogue
const SYMPTOM_MAPPING: Record<string, string> = {
  fatigue: "Fatigue",
  "low-energy": "Fatigue",
  stress: "Stress",
  anxiety: "Stress",
  sleep: "Trouble du sommeil",
  digestion: "Problèmes digestifs",
  "digestive-problems": "Problèmes digestifs",
  bloating: "Problèmes digestifs",
  concentration: "Problèmes cognitifs",
  "lack-of-concentration": "Problèmes cognitifs",
  focus: "Problèmes cognitifs",
  immunity: "Immunité faible",
  "poor-immunity": "Immunité faible",
  skin: "Problèmes de peau",
  "skin-problems": "Problèmes de peau",
  joints: "Douleurs articulaires",
  "joint-pain": "Douleurs articulaires",
  mood: "Humeur basse",
  "mood-swings": "Humeur instable",
  headache: "Maux de tête",
  headaches: "Maux de tête",
  cold: "Sensibilité au froid",
  "cold-sensitivity": "Sensibilité au froid",
  "brittle-hair-nails": "Fragilité cheveux/ongles",
  cravings: "Envies alimentaires",
  "food-cravings": "Envies alimentaires",
  inflammation: "Inflammation"
};

// Mappage entre les clés du quiz et les objectifs du catalogue
const GOAL_MAPPING: Record<string, string> = {
  energy: "Plus d'énergie",
  "More energy": "Plus d'énergie",
  "Reduce stress": "Réduire le stress",
  "Mental clarity": "Santé cognitive",
  "Improve concentration": "Santé cognitive",
  "Balance weight": "Équilibre hormonal",
  performance: "Performance physique",
  "Athletic performance": "Performance physique",
  sleep: "Améliorer le sommeil",
  "Better sleep": "Améliorer le sommeil",
  immunity: "Soutien immunitaire",
  "Strengthen immunity": "Soutien immunitaire",
  detox: "Détoxification",
  "Support digestion": "Santé digestive",
  digestion: "Santé digestive",
  "Improve skin": "Santé de la peau",
  skin: "Santé de la peau",
  longevity: "Vieillissement sain",
  "Healthy aging": "Vieillissement sain",
  calm: "Réduire l'anxiété"
};

// Base de données simulée des suppléments
const SUPPLEMENTS = [
  {
    id: "magnesium",
    name: "Magnésium Bisglycinate",
    description: "Forme hautement biodisponible du magnésium, essentiel pour plus de 300 réactions biochimiques.",
    targetSymptoms: ["Fatigue", "Stress", "Trouble du sommeil", "Crampes musculaires", "Problèmes digestifs"],
    targetGoals: ["Améliorer le sommeil", "Réduire le stress", "Plus d'énergie", "Soutien musculaire", "Santé digestive"],
    scientificEvidence: { level: 8, summary: "Nombreuses études cliniques sur les bénéfices du magnésium." }
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha KSM-66",
    description: "Adaptogène ayurvedique puissant qui aide à équilibrer le système hormonal et nerveux.",
    targetSymptoms: ["Stress", "Anxiété", "Fatigue", "Inflammation", "Problèmes cognitifs"],
    targetGoals: ["Réduire le stress", "Équilibre hormonal", "Plus d'énergie", "Soutien immunitaire", "Santé cognitive"],
    scientificEvidence: { level: 7, summary: "Études cliniques montrant ses effets adaptogènes et anti-stress." }
  },
  {
    id: "vitaminD",
    name: "Vitamine D3+K2",
    description: "Synergie de vitamines liposolubles pour la santé osseuse, immunitaire et cardiovasculaire.",
    targetSymptoms: ["Fatigue", "Humeur basse", "Faiblesse osseuse", "Immunité faible"],
    targetGoals: ["Renforcer les os", "Soutien immunitaire", "Santé cardiovasculaire", "Équilibre hormonal"],
    scientificEvidence: { level: 9, summary: "Nombreuses études sur les multiples fonctions biologiques." }
  },
  {
    id: "omega3",
    name: "Oméga-3 EPA/DHA",
    description: "Acides gras essentiels extraits d'algues, importants pour le cerveau et le système cardiovasculaire.",
    targetSymptoms: ["Inflammation", "Problèmes cognitifs", "Peau sèche", "Douleurs articulaires"],
    targetGoals: ["Santé cognitive", "Santé cardiovasculaire", "Anti-inflammation", "Beauté de la peau"],
    scientificEvidence: { level: 9, summary: "Vaste littérature scientifique sur les bénéfices des oméga-3." }
  },
  {
    id: "probiotics",
    name: "Probiotiques Multi-souches",
    description: "Mélange de bactéries bénéfiques pour la santé digestive et immunitaire.",
    targetSymptoms: ["Problèmes digestifs", "Ballonnements", "Immunité faible", "Fatigue", "Humeur basse"],
    targetGoals: ["Santé digestive", "Soutien immunitaire", "Santé de la peau", "Détoxification", "Santé cognitive"],
    scientificEvidence: { level: 7, summary: "Recherches croissantes sur l'impact du microbiome sur la santé générale, dont l'axe intestin-cerveau." }
  },
  {
    id: "zinc",
    name: "Zinc Bisglycinate",
    description: "Oligo-élément essentiel pour l'immunité, la peau et la santé hormonale.",
    targetSymptoms: ["Immunité faible", "Problèmes de peau", "Perte de goût", "Fatigue"],
    targetGoals: ["Soutien immunitaire", "Santé de la peau", "Équilibre hormonal", "Détoxification"],
    scientificEvidence: { level: 8, summary: "Minéral bien étudié pour ses multiples fonctions cellulaires." }
  },
  {
    id: "rhodiola",
    name: "Rhodiola Rosea",
    description: "Adaptogène qui améliore la résistance au stress et combat la fatigue physique et mentale.",
    targetSymptoms: ["Fatigue", "Stress", "Épuisement", "Dépression légère"],
    targetGoals: ["Plus d'énergie", "Santé cognitive", "Réduire le stress", "Performance physique"],
    scientificEvidence: { level: 6, summary: "Études montrant ses effets sur la fatigue et les performances." }
  },
  {
    id: "curcumin",
    name: "Curcumine Optimisée",
    description: "Puissant anti-inflammatoire naturel avec biodisponibilité améliorée par la pipérine.",
    targetSymptoms: ["Inflammation", "Douleurs articulaires", "Problèmes digestifs", "Fatigue"],
    targetGoals: ["Anti-inflammation", "Santé cognitive", "Détoxification", "Soutien immunitaire"],
    scientificEvidence: { level: 8, summary: "Nombreuses études sur ses propriétés anti-inflammatoires." }
  },
  {
    id: "bcomplex",
    name: "Complexe Vitamine B",
    description: "Vitamines B sous formes actives et biodisponibles pour le métabolisme énergétique.",
    targetSymptoms: ["Fatigue", "Stress", "Problèmes cognitifs", "Humeur instable"],
    targetGoals: ["Plus d'énergie", "Santé cognitive", "Réduire le stress", "Santé cardiovasculaire"],
    scientificEvidence: { level: 7, summary: "Rôle essentiel des vitamines B bien documenté." }
  },
  {
    id: "lion_mane",
    name: "Crinière de Lion",
    description: "Champignon médicinal reconnu pour ses effets neuroprotecteurs et cognitivis.",
    targetSymptoms: ["Problèmes cognitifs", "Fatigue mentale", "Anxiété", "Inflammation"],
    targetGoals: ["Santé cognitive", "Concentration", "Santé nerveuse", "Anti-inflammation", "Plus d'énergie"],
    scientificEvidence: { level: 5, summary: "Études croissantes sur ses propriétés neuroprotectrices et cognitives." }
  },
  {
    id: "ginger_extract",
    name: "Extrait de Gingembre",
    description: "Anti-inflammatoire naturel puissant qui soutient la digestion et réduit les nausées.",
    targetSymptoms: ["Problèmes digestifs", "Ballonnements", "Nausées", "Inflammation", "Douleurs articulaires"],
    targetGoals: ["Santé digestive", "Anti-inflammation", "Confort digestif", "Détoxification"],
    scientificEvidence: { level: 6, summary: "Nombreuses études sur ses effets anti-inflammatoires et digestifs." }
  }
];

// Liste de bénéfices généraux pour les recommandations nutritionnelles
const NUTRITION_RECOMMENDATIONS = {
  "Aliments anti-inflammatoires": [
    "Baies (myrtilles, framboises, canneberges)",
    "Poissons gras riches en oméga-3 (saumon, sardines)",
    "Noix et graines",
    "Légumes à feuilles vertes",
    "Curcuma et gingembre",
    "Huile d'olive extra vierge"
  ],
  "Aliments riches en antioxydants": [
    "Fruits colorés (baies, grenades)",
    "Légumes à pigments foncés (betterave, patate douce)",
    "Chocolat noir (>70% cacao)",
    "Thé vert",
    "Herbes et épices (origan, clou de girofle)",
    "Ail et oignons"
  ],
  "Aliments à limiter": [
    "Aliments ultra-transformés",
    "Sucres raffinés",
    "Céréales raffinées",
    "Huiles végétales raffinées",
    "Excès de caféine",
    "Alcool"
  ]
};

// Liste de bénéfices généraux pour les recommandations de mode de vie
const LIFESTYLE_RECOMMENDATIONS = {
  "Gestion du stress": [
    "Méditation quotidienne (5-20 min/jour)",
    "Respiration profonde (technique 4-7-8)",
    "Activités en pleine nature",
    "Journaling des gratitudes",
    "Bains de forêt hebdomadaires",
    "Limiter l'exposition aux écrans"
  ],
  "Optimisation du sommeil": [
    "Horaires de coucher et lever réguliers",
    "Exposition à la lumière naturelle le matin",
    "Chambre fraîche, sombre et calme",
    "Éviter les écrans 1h avant le coucher",
    "Routine relaxante avant le sommeil",
    "Éviter caféine après midi et alcool le soir"
  ],
  "Activité physique": [
    "Mouvement quotidien (10,000 pas/jour)",
    "Exercices de force 2-3x/semaine",
    "Étirements ou yoga pour la flexibilité",
    "Activités cardiovasculaires modérées",
    "Mouvements de mobilité articulaire",
    "Récupération active entre séances intensives"
  ]
};

/**
 * Génère des recommandations personnalisées basées sur les réponses au quiz
 * @param quizData Données du quiz de l'utilisateur
 * @returns Recommandations personnalisées
 */
export function generateRecommendations(quizData: QuizResponse): RecommendationResult {
  // Convertir les symptômes et objectifs du quiz pour la correspondance avec le catalogue
  const mappedSymptoms = quizData.symptoms.map(symptom => SYMPTOM_MAPPING[symptom]).filter(Boolean);
  const mappedGoals = quizData.objectives.map(goal => GOAL_MAPPING[goal]).filter(Boolean);
  
  console.log("Symptômes mappés pour le score:", mappedSymptoms);
  console.log("Objectifs mappés pour le score:", mappedGoals);
  
  // Identifier les meilleurs suppléments en fonction des symptômes et objectifs
  const supplementScores = SUPPLEMENTS.map(supplement => {
    // Calculer un score basé sur la correspondance avec les symptômes mappés
    const symptomMatch = mappedSymptoms.filter(symptom => 
      supplement.targetSymptoms.includes(symptom)
    ).length / Math.max(1, mappedSymptoms.length);
    
    // Calculer un score basé sur la correspondance avec les objectifs mappés
    const goalMatch = mappedGoals.filter(goal => 
      supplement.targetGoals.includes(goal)
    ).length / Math.max(1, mappedGoals.length);
    
    // Score combiné (symptômes + objectifs)
    // Nous donnons une priorité légère aux symptômes (60/40)
    const matchScore = (symptomMatch * 0.6) + (goalMatch * 0.4);
    
    // Facteurs contextuels (peuvent être développés davantage)
    let contextFactor = 1.0;
    
    // Exemple: ajuster pour le stress et le sommeil
    if ((quizData.stressLevel === 'high' || quizData.sleepQuality === 'poor') && 
        (supplement.id === 'magnesium' || supplement.id === 'ashwagandha')) {
      contextFactor = 1.2;
    }
    
    // Exemple: ajuster pour le régime alimentaire
    if (quizData.dietType === 'vegan' && supplement.id === 'vitaminD') {
      contextFactor = 1.3;
    }
    
    // Score final
    const finalScore = matchScore * contextFactor * (supplement.scientificEvidence.level / 10);
    
    return { 
      supplement, 
      score: finalScore
    };
  });
  
  // Trier les suppléments par score
  const sortedSupplements = supplementScores
    .sort((a, b) => b.score - a.score);
  
  // Déterminer combien de recommandations principales inclure en fonction du nombre de symptômes et d'objectifs
  const symptomCount = quizData.symptoms.length;
  const objectiveCount = quizData.objectives.length;
  const totalCount = symptomCount + objectiveCount;
  
  // Adapter le nombre de recommandations principales en fonction de la complexité du profil
  let primaryCount = 3; // Par défaut
  if (totalCount >= 6) {
    primaryCount = 5; // Plus de recommandations pour les profils complexes
  } else if (totalCount <= 2) {
    primaryCount = 2; // Moins de recommandations pour les profils simples
  }
  
  console.log(`Génération de ${primaryCount} recommandations principales pour ${symptomCount} symptômes et ${objectiveCount} objectifs`);
  
  // Sélectionner les meilleurs suppléments comme recommandations primaires
  const primaryRecommendations = sortedSupplements
    .slice(0, primaryCount)
    .map(item => createRecommendation(item.supplement, item.score, quizData));
  
  // Sélectionner les suivants comme recommandations secondaires (2 recommandations)
  // Ces recommandations seront basées davantage sur les objectifs secondaires
  const secondaryRecommendations = sortedSupplements
    .slice(primaryCount, primaryCount + 2)
    .map(item => {
      // Ajuster le score pour ces recommandations pour mettre l'accent sur les objectifs secondaires
      const recommendation = createRecommendation(item.supplement, item.score, quizData);
      recommendation.personalizedReason += "Cette recommandation complémentaire cible principalement des objectifs à plus long terme ou secondaires. ";
      return recommendation;
    });
  
  // Créer une analyse avancée du profil avec priorisation scientifique
  // Déterminer la priorité de chaque symptôme en fonction de son impact et de sa relation avec d'autres symptômes
  const symptomPriorities = quizData.symptoms.map((symptomId, index) => {
    // Mappings de symptômes pour l'affichage
    const symptomLabel = SYMPTOM_MAPPING[symptomId] || symptomId;
    
    // Calcul de priorité basé sur plusieurs facteurs
    let basePriority = 10 - index; // Base de priorité par ordre de sélection
    
    // Facteurs additionnels de priorisation
    const severityFactor = quizData.specificQuestions?.find(q => 
      q.id === `${symptomId}-severity` || q.id.includes(symptomId))?.answer === 'high' ? 2 : 0;
    
    // Facteur de durée (si disponible)
    const durationFactor = quizData.specificQuestions?.find(q => 
      q.id === `${symptomId}-duration` || q.id.includes('duration'))?.answer === 'long' ? 1.5 : 0;
    
    // Facteur d'impact sur la qualité de vie (si disponible)
    const impactFactor = quizData.specificQuestions?.find(q => 
      q.id === `${symptomId}-impact` || q.id.includes('impact'))?.answer === 'significant' ? 1.5 : 0;
    
    // Facteur lié au style de vie
    const lifestyleFactor = (quizData.stressLevel === 'high' && 
      (symptomId === 'stress' || symptomId === 'anxiety' || symptomId === 'sleep')) ? 1 : 0;
    
    // Symptômes prioritaires selon la littérature scientifique
    const scientificPriorityFactor = 
      ['fatigue', 'stress', 'digestion', 'sleep', 'concentration'].includes(symptomId) ? 1 : 0;
    
    // Calculer la priorité totale
    const totalPriority = basePriority + severityFactor + durationFactor + 
                          impactFactor + lifestyleFactor + scientificPriorityFactor;
    
    // Normaliser la priorité sur une échelle de 1 à 10
    const normalizedPriority = Math.min(10, Math.max(1, totalPriority));
    
    // Déterminer le niveau de priorité pour la description
    let priorityLevel = 'moyenne';
    if (normalizedPriority >= 8) priorityLevel = 'très élevée';
    else if (normalizedPriority >= 6) priorityLevel = 'élevée';
    else if (normalizedPriority <= 3) priorityLevel = 'mineure';
    
    return {
      symptom: symptomLabel,
      originalSymptomId: symptomId,
      priority: normalizedPriority,
      priorityLevel,
      description: `${symptomLabel} a été identifié comme une priorité ${priorityLevel} dans votre profil de santé.`
    };
  }).sort((a, b) => b.priority - a.priority); // Trier par priorité décroissante
  
  // Priorisation des objectifs de santé
  const objectivePriorities = quizData.objectives.map((objectiveId, index) => {
    // Mappings pour l'affichage
    const objectiveLabel = GOAL_MAPPING[objectiveId] || objectiveId;
    
    // Calcul de priorité basé sur plusieurs facteurs
    let basePriority = 10 - index; // Priorité de base par ordre de sélection
    
    // Facteurs additionnels de priorisation
    const urgencyFactor = quizData.specificQuestions?.find(q => 
      q.id === `${objectiveId}-urgency` || q.id.includes('urgency'))?.answer === 'high' ? 2 : 0;
    
    // Priorité liée aux symptômes (si l'objectif est fortement lié à un symptôme prioritaire)
    let symptomRelatedFactor = 0;
    if (objectiveId === 'energy' && quizData.symptoms.includes('fatigue')) symptomRelatedFactor += 2;
    if (objectiveId === 'reduce_stress' && quizData.symptoms.includes('stress')) symptomRelatedFactor += 2;
    if (objectiveId === 'improve_sleep' && quizData.symptoms.includes('sleep')) symptomRelatedFactor += 2;
    if (objectiveId === 'Support digestion' && quizData.symptoms.includes('digestion')) symptomRelatedFactor += 2;
    if (objectiveId === 'concentration' && quizData.symptoms.includes('brain-fog')) symptomRelatedFactor += 2;
    
    // Facteur lié au style de vie
    const lifestyleFactor = (quizData.activityLevel === 'low' && objectiveId === 'energy') ? 1 : 0;
    
    // Objectifs prioritaires selon la littérature scientifique
    const scientificPriorityFactor = 
      ['energy', 'reduce_stress', 'improve_sleep', 'Support digestion', 'immunity'].includes(objectiveId) ? 1 : 0;
    
    // Calculer la priorité totale
    const totalPriority = basePriority + urgencyFactor + symptomRelatedFactor + lifestyleFactor + scientificPriorityFactor;
    
    // Normaliser la priorité sur une échelle de 1 à 10
    const normalizedPriority = Math.min(10, Math.max(1, totalPriority));
    
    // Déterminer le niveau de priorité pour la description
    let priorityLevel = 'moyenne';
    if (normalizedPriority >= 8) priorityLevel = 'très élevée';
    else if (normalizedPriority >= 6) priorityLevel = 'élevée';
    else if (normalizedPriority <= 3) priorityLevel = 'à long terme';
    
    // Estimation du temps pour atteindre l'objectif
    let timeEstimate = "2-3 mois";
    if (normalizedPriority >= 8) timeEstimate = "2-6 semaines";
    else if (normalizedPriority <= 3) timeEstimate = "3-6 mois";
    
    return {
      objective: objectiveLabel,
      originalObjectiveId: objectiveId,
      priority: normalizedPriority,
      priorityLevel,
      timeEstimate,
      description: `${objectiveLabel} a été identifié comme un objectif de priorité ${priorityLevel}, avec des résultats attendus dans ${timeEstimate}.`
    };
  }).sort((a, b) => b.priority - a.priority); // Trier par priorité décroissante
  
  // Biomarqueurs simulés (en production, seraient basés sur des algorithmes plus sophistiqués)
  const biomarkers = [
    { name: "Niveau de cortisol", status: quizData.stressLevel === 'high' ? "Élevé" : "Normal", impact: quizData.stressLevel === 'high' ? 8 : 4 },
    { name: "Inflammation systémique", status: "Modérée", impact: 6 },
    { name: "Fonction mitochondriale", status: quizData.activityLevel === 'low' ? "Réduite" : "Normale", impact: quizData.activityLevel === 'low' ? 7 : 3 },
    { name: "Balance microbiote", status: "Sous-optimale", impact: 5 }
  ];
  
  // Facteurs contextuels
  const contextualFactors = [
    { factor: "Qualité du sommeil", impact: quizData.sleepQuality === 'poor' ? "Impact majeur" : "Impact modéré" },
    { factor: "Niveau de stress", impact: quizData.stressLevel === 'high' ? "Impact majeur" : "Impact modéré" },
    { factor: "Niveau d'activité", impact: quizData.activityLevel === 'low' ? "Impact significatif" : "Impact minimal" }
  ];
  
  return {
    primaryRecommendations,
    secondaryRecommendations,
    nutritionRecommendations: NUTRITION_RECOMMENDATIONS,
    lifestyleRecommendations: LIFESTYLE_RECOMMENDATIONS,
    profileAnalysis: {
      symptomPriorities,
      objectivePriorities,
      biomarkers,
      contextualFactors
    }
  };
}

/**
 * Crée une recommandation détaillée pour un supplément
 */
function createRecommendation(
  supplement: typeof SUPPLEMENTS[0], 
  score: number,
  quizData: QuizResponse
): SupplementRecommendation {
  // Convertir les symptômes du quiz vers le format du catalogue
  const mappedSymptoms = quizData.symptoms.map(symptom => SYMPTOM_MAPPING[symptom]).filter(Boolean);
  console.log('Symptômes du quiz (original):', quizData.symptoms);
  console.log('Symptômes du quiz (mappés):', mappedSymptoms);
  console.log('Symptômes ciblés par le supplément:', supplement.targetSymptoms);
  
  // Identifier les symptômes ciblés qui correspondent aux symptômes mappés de l'utilisateur
  const targetSymptoms = supplement.targetSymptoms.filter(symptom => 
    mappedSymptoms.includes(symptom)
  );
  console.log('Symptômes correspondants:', targetSymptoms);
  
  // Convertir les objectifs du quiz vers le format du catalogue
  const mappedGoals = quizData.objectives.map(goal => GOAL_MAPPING[goal]).filter(Boolean);
  console.log('Objectifs du quiz (original):', quizData.objectives);
  console.log('Objectifs du quiz (mappés):', mappedGoals);
  console.log('Objectifs ciblés par le supplément:', supplement.targetGoals);
  
  // Identifier les objectifs ciblés qui correspondent aux objectifs mappés de l'utilisateur
  const targetGoals = supplement.targetGoals.filter(goal => 
    mappedGoals.includes(goal)
  );
  console.log('Objectifs correspondants:', targetGoals);
  
  // Générer une raison personnalisée
  let personalizedReason = `Le ${supplement.name} est particulièrement recommandé pour vous car `;
  
  if (targetSymptoms.length > 0) {
    personalizedReason += `il cible directement ${targetSymptoms.length > 1 ? 'les symptômes suivants' : 'le symptôme suivant'} : ${targetSymptoms.join(', ')}. `;
  }
  
  if (targetGoals.length > 0) {
    personalizedReason += `Il soutient également ${targetGoals.length > 1 ? 'vos objectifs' : 'votre objectif'} de ${targetGoals.join(', ')}. `;
  }
  
  // Ajouter des détails spécifiques basés sur le profil
  if (quizData.stressLevel === 'high' && supplement.targetSymptoms.includes('Stress')) {
    personalizedReason += "Compte tenu de votre niveau de stress élevé, ce supplément pourrait particulièrement vous aider à retrouver l'équilibre. ";
  }
  
  if (quizData.sleepQuality === 'poor' && supplement.targetSymptoms.includes('Trouble du sommeil')) {
    personalizedReason += "Vu vos difficultés de sommeil, ce supplément pourrait contribuer à améliorer votre repos nocturne. ";
  }
  
  // Recommandation de dosage
  let dosageRecommendation;
  switch (supplement.id) {
    case 'magnesium':
      dosageRecommendation = "300-400mg par jour, de préférence le soir";
      break;
    case 'ashwagandha':
      dosageRecommendation = "600mg par jour, répartis en 2 prises";
      break;
    case 'vitaminD':
      dosageRecommendation = "2000-4000 UI par jour avec un repas contenant des graisses";
      break;
    case 'omega3':
      dosageRecommendation = "1-2g par jour avec un repas";
      break;
    default:
      dosageRecommendation = "Suivre les instructions du fabricant";
  }
  
  // Timing d'efficacité
  let effectivenessTiming;
  switch (supplement.id) {
    case 'magnesium':
      effectivenessTiming = "Effets sur le sommeil en 1-2 semaines, effets complets en 1-2 mois";
      break;
    case 'ashwagandha':
      effectivenessTiming = "Effets adaptogènes progressifs sur 2-8 semaines d'utilisation régulière";
      break;
    case 'vitaminD':
      effectivenessTiming = "Optimisation des niveaux sanguins en 2-3 mois d'utilisation";
      break;
    default:
      effectivenessTiming = "Effets initiaux en 2-4 semaines, effets complets en 2-3 mois";
  }
  
  return {
    id: supplement.id,
    name: supplement.name,
    description: supplement.description,
    matchScore: Math.min(0.95, Math.max(0.6, score)),
    personalizedReason,
    targetSymptoms,
    targetGoals,
    confidenceLevel: supplement.scientificEvidence.level / 10,
    dosageRecommendation,
    effectivenessTiming,
    actionMechanism: getActionMechanism(supplement.id),
    scientificEvidence: {
      level: supplement.scientificEvidence.level,
      summary: supplement.scientificEvidence.summary
    }
  };
}

/**
 * Génère une description du mécanisme d'action
 */
function getActionMechanism(supplementId: string): string {
  const mechanisms: Record<string, string> = {
    magnesium: "Cofacteur pour plus de 300 enzymes, impliqué dans la relaxation neuromusculaire, la production d'énergie cellulaire et la régulation du système nerveux.",
    
    ashwagandha: "Régule l'axe hypothalamo-hypophyso-surrénalien (HHS), module les niveaux de cortisol, et possède des propriétés antioxydantes et anti-inflammatoires.",
    
    vitaminD: "Agit comme une hormone qui régule l'expression génique dans de nombreux tissus, affectant l'immunité, le métabolisme osseux et la fonction neuromusculaire.",
    
    omega3: "Incorporés dans les membranes cellulaires, les oméga-3 modulent l'inflammation via les eicosanoïdes et résolvines, influençant la signalisation cellulaire.",
    
    probiotics: "Modulent le microbiome intestinal, renforcent la barrière intestinale, interagissent avec le système immunitaire et produisent des métabolites bioactifs.",
    
    zinc: "Cofacteur pour plus de 300 enzymes, essentiel pour la synthèse de l'ADN, la fonction immunitaire, la division cellulaire et le métabolisme hormonal.",
    
    rhodiola: "Adaptogène qui normalise les systèmes de réponse au stress, module les neurotransmetteurs et protège contre le stress oxydatif cellulaire.",
    
    curcumin: "Inhibe les voies inflammatoires NF-kB et COX-2, neutralise les radicaux libres et module l'expression de gènes liés à l'inflammation chronique.",
    
    bcomplex: "Coenzymes essentielles dans le métabolisme énergétique, la synthèse des neurotransmetteurs, la méthylation et la production des globules rouges.",
    
    lion_mane: "Stimule la production du facteur neurotrophique dérivé du cerveau (BDNF) et du facteur de croissance nerveuse (NGF), soutenant la neuroplasticité."
  };
  
  return mechanisms[supplementId] || "Mécanisme d'action complexe ciblant plusieurs voies biologiques complémentaires.";
}