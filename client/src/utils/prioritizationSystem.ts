import { UserProfile } from './types';

export const SYMPTOM_RELATIONSHIPS: Record<string, string[]> = {
  'stress': ['anxiety', 'insomnia', 'fatigue', 'irritability', 'headache'],
  'anxiety': ['stress', 'insomnia', 'palpitations', 'digestive_issues'],
  'insomnia': ['stress', 'anxiety', 'fatigue', 'headache'],
  'fatigue': ['stress', 'insomnia', 'depression', 'brain_fog'],
  'digestive_issues': ['anxiety', 'stress', 'bloating', 'stomach_pain'],
  'headache': ['stress', 'insomnia', 'dehydration', 'muscle_tension'],
  'muscle_tension': ['stress', 'anxiety', 'pain', 'headache'],
  'joint_pain': ['inflammation', 'stiffness', 'muscle_tension'],
  'brain_fog': ['fatigue', 'poor_concentration', 'memory_issues'],
  'poor_concentration': ['fatigue', 'brain_fog', 'stress'],
  'mood_swings': ['stress', 'anxiety', 'hormonal_imbalance'],
  'low_immunity': ['frequent_illness', 'fatigue', 'stress'],
  'skin_issues': ['inflammation', 'hormonal_imbalance', 'digestive_issues'],
};

export const SYMPTOM_CAUSES: Record<string, string[]> = {
  'stress': ['work_pressure', 'personal_problems', 'financial_concerns', 'magnesium_deficiency'],
  'anxiety': ['work_pressure', 'personal_problems', 'neurotransmitter_imbalance', 'caffeine'],
  'insomnia': ['stress', 'anxiety', 'poor_sleep_hygiene', 'circadian_rhythm_disruption', 'magnesium_deficiency'],
  'fatigue': ['poor_sleep', 'stress', 'vitamin_deficiencies', 'dehydration', 'anemia'],
  'digestive_issues': ['poor_diet', 'stress', 'food_intolerances', 'dysbiosis', 'low_enzymes'],
  'headache': ['stress', 'dehydration', 'eye_strain', 'hormonal_changes', 'magnesium_deficiency'],
  'muscle_tension': ['stress', 'poor_posture', 'overexertion', 'magnesium_deficiency'],
  'joint_pain': ['inflammation', 'overexertion', 'aging', 'autoimmune_conditions'],
  'brain_fog': ['poor_sleep', 'stress', 'poor_diet', 'hormonal_changes', 'inflammation'],
  'poor_concentration': ['stress', 'fatigue', 'nutrient_deficiencies', 'multitasking'],
  'mood_swings': ['hormonal_changes', 'stress', 'blood_sugar_fluctuations', 'sleep_disturbances'],
  'low_immunity': ['stress', 'poor_diet', 'vitamin_d_deficiency', 'lack_of_sleep'],
  'skin_issues': ['hormonal_imbalance', 'poor_diet', 'dehydration', 'stress', 'gut_issues'],
};

const GOAL_PRIORITY_WEIGHTS: Record<string, number> = {
  'stress_management': 90,
  'sleep_improvement': 85,
  'energy_enhancement': 80,
  'immune_boost': 75,
  'cognitive_function': 70,
  'mood_stabilization': 65,
  'digestive_health': 60,
  'hormonal_balance': 60,
  'joint_support': 55,
  'inflammation_reduction': 50,
  'cardiovascular_health': 50,
  'weight_management': 45,
  'detoxification': 40,
  'skin_health': 35,
  'hair_health': 30,
  'fitness_support': 30,
};

const GOAL_TIMEFRAMES: Record<string, string> = {
  'stress_management': '2-4 semaines',
  'sleep_improvement': '1-3 semaines',
  'energy_enhancement': '2-4 semaines',
  'immune_boost': '4-6 semaines',
  'cognitive_function': '4-8 semaines',
  'mood_stabilization': '3-6 semaines',
  'digestive_health': '2-6 semaines',
  'hormonal_balance': '8-12 semaines',
  'joint_support': '4-12 semaines',
  'inflammation_reduction': '3-6 semaines',
  'cardiovascular_health': '8-12 semaines',
  'weight_management': '6-12 semaines',
  'detoxification': '2-4 semaines',
  'skin_health': '6-12 semaines',
  'hair_health': '8-16 semaines',
  'fitness_support': '3-8 semaines',
};

const GOAL_APPROACHES: Record<string, string> = {
  'stress_management': 'Combinaison de suppléments adaptogènes, pratiques de pleine conscience et optimisation du sommeil',
  'sleep_improvement': 'Régulation du rythme circadien, suppléments ciblés et rituels de relaxation avant le coucher',
  'energy_enhancement': 'Soutien mitochondrial, optimisation des nutriments énergétiques et gestion du stress',
  'immune_boost': 'Renforcement de la flore intestinale, vitamines/minéraux essentiels et gestion du stress',
  'cognitive_function': 'Neuroprotection, soutien circulatoire cérébral et nutriments spécifiques au cerveau',
  'mood_stabilization': 'Équilibre des neurotransmetteurs, soutien adrénal et pratiques de bien-être mental',
  'digestive_health': 'Probiotiques, enzymes digestives et plantes apaisantes pour l\'intestin',
  'hormonal_balance': 'Adaptogènes ciblés, nutriments de soutien et gestion du stress',
  'joint_support': 'Anti-inflammatoires naturels, nutriments structurels et exercices adaptés',
  'inflammation_reduction': 'Alimentation anti-inflammatoire et suppléments ciblés',
  'cardiovascular_health': 'Soutien circulatoire, antioxydants et gestion du stress',
  'weight_management': 'Régulation métabolique, équilibre hormonal et soutien digestif',
  'detoxification': 'Soutien hépatique, hydratation optimale et alimentation purifiante',
  'skin_health': 'Nutrition cutanée, antioxydants et équilibre hormonal',
  'hair_health': 'Minéraux essentiels, acides aminés et contrôle du stress',
  'fitness_support': 'Récupération musculaire, énergie et performance',
};

export function analyzeTreatmentPriorities(userProfile: UserProfile) {
  // Analyse des symptômes
  const symptomAnalysis: Record<string, {
    severity: number;
    priority: number;
    relatedSymptoms: string[];
    potentialCauses: string[];
  }> = {};

  // Pour chaque symptôme avec une intensité > 0
  Object.entries(userProfile.symptoms).forEach(([symptomId, severity]) => {
    if (severity > 0) {
      // Facteurs pouvant augmenter la priorité
      let priorityModifier = 0;

      // 1. Vérifier si ce symptôme est lié à d'autres symptômes présents
      const relatedSymptoms = SYMPTOM_RELATIONSHIPS[symptomId] || [];
      const relatedPresent = relatedSymptoms.filter(s => 
        userProfile.symptoms[s] && userProfile.symptoms[s] > 3
      );
      
      // Plus il y a de symptômes liés présents, plus la priorité augmente
      priorityModifier += relatedPresent.length * 5;

      // 2. Prioriser les symptômes de stress et sommeil qui affectent beaucoup d'autres aspects
      if (['stress', 'anxiety', 'insomnia', 'fatigue'].includes(symptomId)) {
        priorityModifier += 10;
      }

      // 3. Prioriser les symptômes sévères (intensité élevée)
      if (severity >= 7) {
        priorityModifier += 15;
      } else if (severity >= 4) {
        priorityModifier += 5;
      }
      
      // 4. Facteurs démographiques - Prioriser certains symptômes selon l'âge
      if (userProfile.age) {
        // Pour les personnes plus âgées, prioriser davantage les problèmes articulaires et cognitifs
        if (userProfile.age >= 55) {
          if (['joint_pain', 'arthritis', 'stiffness'].includes(symptomId)) {
            priorityModifier += 10;
          }
          
          if (['brain_fog', 'memory_issues', 'cognitive_decline'].includes(symptomId)) {
            priorityModifier += 8;
          }
        }
        
        // Pour les jeunes adultes, prioriser les problèmes de stress et d'énergie
        if (userProfile.age >= 18 && userProfile.age <= 35) {
          if (['stress', 'anxiety', 'fatigue', 'burnout'].includes(symptomId)) {
            priorityModifier += 7;
          }
        }
        
        // Pour les personnes d'âge moyen, équilibrer les priorités
        if (userProfile.age > 35 && userProfile.age < 55) {
          if (['hormonal_imbalance', 'energy_fluctuations', 'metabolic_issues'].includes(symptomId)) {
            priorityModifier += 6;
          }
        }
      }
      
      // 5. Facteurs de genre - Prioriser certains symptômes selon le genre
      if (userProfile.gender) {
        if (userProfile.gender.toLowerCase() === 'female') {
          if (['hormonal_imbalance', 'pms', 'menopause_symptoms'].includes(symptomId)) {
            priorityModifier += 12;
          }
        }
        
        if (userProfile.gender.toLowerCase() === 'male') {
          if (['prostate_issues', 'testosterone_decline', 'male_pattern_fatigue'].includes(symptomId)) {
            priorityModifier += 10;
          }
        }
      }

      // 6. Calculer la priorité finale (base 50 + modificateurs)
      const priority = Math.min(100, Math.max(0, 50 + priorityModifier));

      // Causes potentielles
      const potentialCauses = SYMPTOM_CAUSES[symptomId] || [];

      symptomAnalysis[symptomId] = {
        severity,
        priority,
        relatedSymptoms: relatedPresent,
        potentialCauses,
      };
    }
  });

  // Analyse des objectifs
  const goalAnalysis: Record<string, {
    importance: number;
    priority: number;
    timeFrame: string;
    recommendedApproach: string;
  }> = {};

  // Pour chaque objectif avec une importance > 0
  Object.entries(userProfile.goals).forEach(([goalId, importance]) => {
    if (importance > 0) {
      // La priorité est basée sur l'importance indiquée par l'utilisateur
      // et un poids prédéfini pour chaque type d'objectif
      const basePriority = GOAL_PRIORITY_WEIGHTS[goalId] || 50;
      
      // Facteurs d'ajustement de la priorité
      let priorityModifier = 0;
      
      // 1. Ajuster en fonction de l'importance attribuée par l'utilisateur
      if (importance >= 8) {
        priorityModifier += 20; // Objectif très important
      } else if (importance >= 5) {
        priorityModifier += 10; // Objectif moyennement important
      }
      
      // 2. Lier aux symptômes - si des symptômes liés sont sévères, augmenter la priorité
      if (goalId === 'stress_management' && symptomAnalysis['stress']?.severity >= 6) {
        priorityModifier += 15;
      }
      if (goalId === 'sleep_improvement' && symptomAnalysis['insomnia']?.severity >= 6) {
        priorityModifier += 15;
      }
      if (goalId === 'energy_enhancement' && symptomAnalysis['fatigue']?.severity >= 6) {
        priorityModifier += 15;
      }
      
      // Priorité finale, limitée entre 0 et 100
      const priority = Math.min(100, Math.max(0, (basePriority * 0.7) + (importance * 3) + priorityModifier));
      
      goalAnalysis[goalId] = {
        importance,
        priority,
        timeFrame: GOAL_TIMEFRAMES[goalId] || '4-8 semaines',
        recommendedApproach: GOAL_APPROACHES[goalId] || 'Approche personnalisée basée sur votre profil'
      };
    }
  });

  return {
    symptomAnalysis,
    goalAnalysis
  };
}

// Fonction pour générer des recommandations de mode de vie
export function generateLifestyleRecommendations(userProfile: UserProfile, priorityAnalysis: any): string[] {
  const recommendations: string[] = [];
  
  // Recommandations basées sur les symptômes prioritaires
  const highPrioritySymptoms = Object.entries(priorityAnalysis.symptomAnalysis)
    .filter(([_, data]: [string, any]) => data.priority >= 70)
    .map(([symptomId]: [string, any]) => symptomId);

  if (highPrioritySymptoms.includes('stress') || highPrioritySymptoms.includes('anxiety')) {
    recommendations.push("Pratique régulière de techniques de respiration profonde et de méditation pleine conscience pendant 10-15 minutes par jour pour réduire les niveaux de cortisol et améliorer la résilience au stress.");
  }
  
  if (highPrioritySymptoms.includes('insomnia') || highPrioritySymptoms.includes('sleep_issues')) {
    recommendations.push("Optimisation du rythme circadien : s'exposer à la lumière naturelle le matin et limiter l'exposition à la lumière bleue 2 heures avant le coucher. Établir une routine de sommeil constante, même les week-ends.");
  }
  
  if (highPrioritySymptoms.includes('fatigue')) {
    recommendations.push("Intégrer des micro-pauses énergisantes de 5 minutes toutes les 90 minutes de travail ou d'activité soutenue. Structurer la journée selon votre chronotype naturel pour maximiser les périodes d'énergie optimale.");
  }

  // Recommandations basées sur les données démographiques et le mode de vie
  if (userProfile.activityLevel === 'sedentary' || userProfile.activityLevel === 'light') {
    recommendations.push("Exercice régulier modéré : intégrer 30 minutes d'activité physique modérée 4-5 fois par semaine, en privilégiant une combinaison de cardio, de renforcement musculaire et d'exercices de flexibilité.");
  }
  
  if (userProfile.sleepQuality === 'poor' || userProfile.stressLevel === 'high') {
    recommendations.push("Rituel de détente en soirée : créer une routine relaxante 30-60 minutes avant le coucher, incluant des activités calmes comme la lecture, un bain chaud, ou des étirements doux, en évitant les écrans.");
  }

  // Limiter à 5 recommandations maximum
  return recommendations.slice(0, 5);
}

// Fonction pour générer des recommandations alimentaires
export function generateDietaryRecommendations(userProfile: UserProfile, priorityAnalysis: any): string[] {
  const recommendations: string[] = [];
  
  // Recommandations basées sur le régime alimentaire actuel
  if (userProfile.dietaryPatterns?.includes('processed')) {
    recommendations.push("Alimentation anti-inflammatoire : privilégier les aliments entiers non transformés, les fruits et légumes colorés, les graisses saines (avocat, huile d'olive, noix) et réduire progressivement les aliments ultra-transformés et les sucres raffinés.");
  }
  
  if (userProfile.dietaryPatterns?.includes('irregular_meals')) {
    recommendations.push("Régularité des repas : établir un rythme alimentaire régulier avec 3 repas équilibrés et 1-2 collations nutritives par jour pour stabiliser la glycémie et soutenir le métabolisme.");
  }

  // Recommandations basées sur les symptômes prioritaires
  const highPrioritySymptoms = Object.entries(priorityAnalysis.symptomAnalysis)
    .filter(([_, data]: [string, any]) => data.priority >= 60)
    .map(([symptomId]: [string, any]) => symptomId);

  if (highPrioritySymptoms.includes('stress') || highPrioritySymptoms.includes('anxiety')) {
    recommendations.push("Sources naturelles de magnésium : incorporer davantage d'aliments riches en magnésium comme les graines de citrouille, les épinards, les amandes et les avocats pour soutenir votre système nerveux et réduire l'anxiété.");
  }
  
  if (highPrioritySymptoms.includes('digestive_issues')) {
    recommendations.push("Alimentation pro-digestive : intégrer des aliments fermentés (yaourt, kéfir, choucroute) pour enrichir le microbiome, des fibres prébiotiques (légumes, fruits, légumineuses) et bien mâcher les aliments pour faciliter la digestion.");
  }
  
  if (highPrioritySymptoms.includes('inflammation') || highPrioritySymptoms.includes('joint_pain')) {
    recommendations.push("Intégrer des épices anti-inflammatoires quotidiennement : curcuma (avec du poivre noir pour l'absorption), gingembre, cannelle. Augmenter la consommation d'acides gras oméga-3 (poissons gras, graines de lin, chia) et réduire les oméga-6 (huiles végétales raffinées).");
  }
  
  // Recommandation générale d'hydratation
  recommendations.push("Hydratation optimale : boire au moins 2 litres d'eau par jour, en commençant par un grand verre d'eau au réveil. Réduire la consommation de boissons contenant de la caféine, particulièrement l'après-midi, et limiter l'alcool qui perturbe le sommeil et la digestion.");

  // Limiter à 5 recommandations maximum
  return recommendations.slice(0, 5);
}

// Fonction pour générer des recommandations de suivi
export function generateFollowUpRecommendations(userProfile: UserProfile, primaryRecommendations: any[]): string[] {
  const recommendations: string[] = [];
  
  // Recommandation de réévaluation générale adaptée à l'âge
  if (userProfile.age && userProfile.age >= 65) {
    recommendations.push("Réévaluer vos symptômes après 2-3 semaines de supplémentation pour ajuster les dosages si nécessaire. À votre âge, il est préférable de surveiller plus fréquemment les effets des suppléments.");
  } else {
    recommendations.push("Réévaluer vos symptômes après 4 semaines de supplémentation pour ajuster les dosages si nécessaire.");
  }
  
  // Recommandations basées sur les conditions existantes
  if (userProfile.existingConditions && userProfile.existingConditions.length > 0) {
    recommendations.push("Consultez votre professionnel de santé pour un suivi de vos conditions existantes et pour discuter de l'intégration des suppléments recommandés à votre traitement actuel.");
  }
  
  // Recommandations spécifiques liées aux médicaments
  if (userProfile.medications && userProfile.medications.length > 0) {
    const medicationTypes = categorizeMedications(userProfile.medications);
    
    if (medicationTypes.includes('anticoagulant')) {
      recommendations.push("Étant donné votre traitement anticoagulant, consultez votre médecin avant de prendre des suppléments à base de ginkgo, ginseng, curcuma ou oméga-3 à haute dose qui peuvent affecter la coagulation sanguine.");
    }
    
    if (medicationTypes.includes('antidepresseur')) {
      recommendations.push("En raison de votre traitement antidépresseur, évitez le millepertuis et consultez votre médecin avant de prendre des suppléments agissant sur les neurotransmetteurs (comme le 5-HTP, le SAMe ou certains adaptogènes).");
    }
    
    if (medicationTypes.includes('thyroide')) {
      recommendations.push("Prenez vos suppléments au moins 2 heures avant ou après votre médication thyroïdienne pour éviter les interférences avec l'absorption.");
    }
    
    if (medicationTypes.includes('corticosteroide')) {
      recommendations.push("Si vous prenez des corticostéroïdes, privilégiez des suppléments soutenant la santé osseuse (vitamine D, calcium, vitamine K2) et surveillez votre glycémie lors de la prise de suppléments stimulant l'immunité.");
    }
    
    if (medicationTypes.includes('antihypertenseur')) {
      recommendations.push("En raison de votre traitement antihypertenseur, surveillez votre tension artérielle si vous prenez de la réglisse, du ginseng, ou des suppléments contenant de la caféine qui pourraient interférer avec votre médication.");
    }
  }
  
  // Recommandations de tests en fonction des symptômes et de l'âge
  const significantSymptoms = Object.entries(userProfile.symptoms)
    .filter(([_, severity]) => severity >= 7)
    .map(([symptomId]) => symptomId);
  
  if (significantSymptoms.includes('fatigue') || significantSymptoms.includes('low_immunity')) {
    if (userProfile.age && userProfile.age >= 50) {
      recommendations.push("À votre âge, envisagez un bilan sanguin complet incluant des marqueurs inflammatoires, fonction thyroïdienne, niveaux de fer, vitamine D, B12 et folates pour identifier d'éventuelles carences et optimiser votre supplémentation.");
    } else {
      recommendations.push("Envisager un bilan sanguin pour évaluer vos niveaux de fer, vitamine D, B12 et marqueurs inflammatoires pour identifier d'éventuelles carences sous-jacentes.");
    }
  }
  
  if (significantSymptoms.includes('digestive_issues')) {
    recommendations.push("Tenir un journal alimentaire pendant 2 semaines pour identifier les aliments déclencheurs potentiels et observer comment les suppléments affectent vos symptômes digestifs.");
  }
  
  if (significantSymptoms.includes('insomnia') || significantSymptoms.includes('sleep_issues')) {
    recommendations.push("Tenir un journal de sommeil pendant 2 semaines pour établir une base de référence et suivre les améliorations apportées par les changements de mode de vie et la supplémentation.");
  }
  
  // Recommandation pour les suppléments principaux, adaptée à l'âge et aux médicaments
  if (primaryRecommendations.length > 0) {
    if ((userProfile.age && userProfile.age >= 65) || (userProfile.medications && userProfile.medications.length > 0)) {
      recommendations.push(`Commencer par le supplément prioritaire (${primaryRecommendations[0].name}) à demi-dose pendant 3-5 jours avant d'augmenter progressivement et d'ajouter d'autres suppléments. Cette approche prudente est recommandée compte tenu de votre profil.`);
    } else {
      recommendations.push(`Commencer par le supplément prioritaire (${primaryRecommendations[0].name}) pendant 1 semaine avant d'ajouter les autres, pour mieux observer les effets individuels et tolérance.`);
    }
  }

  // Limiter à 5 recommandations maximum
  return recommendations.slice(0, 5);
}

// Fonction utilitaire pour catégoriser les médicaments
function categorizeMedications(medications: string[]): string[] {
  const categories: string[] = [];
  
  // Analyse simplifiée des médicaments pour identifier les catégories principales
  // Cette fonction pourrait être beaucoup plus sophistiquée avec une base de données complète
  medications.forEach(med => {
    const medLower = med.toLowerCase();
    
    // Anticoagulants
    if (medLower.includes('coumadin') || medLower.includes('warfarin') || 
        medLower.includes('eliquis') || medLower.includes('xarelto') || 
        medLower.includes('heparin') || medLower.includes('aspirine') ||
        medLower.includes('antiagrégant')) {
      categories.push('anticoagulant');
    }
    
    // Antidépresseurs
    if (medLower.includes('ssri') || medLower.includes('prozac') || 
        medLower.includes('lexapro') || medLower.includes('zoloft') || 
        medLower.includes('citalopram') || medLower.includes('antidépresseur') ||
        medLower.includes('sertraline') || medLower.includes('fluoxetine')) {
      categories.push('antidepresseur');
    }
    
    // Médicaments pour la thyroïde
    if (medLower.includes('levothyroxine') || medLower.includes('synthroid') || 
        medLower.includes('thyroïde') || medLower.includes('euthyrox')) {
      categories.push('thyroide');
    }
    
    // Corticostéroïdes
    if (medLower.includes('prednisone') || medLower.includes('cortisone') || 
        medLower.includes('dexamethasone') || medLower.includes('corticoïde') ||
        medLower.includes('corticostéroïde')) {
      categories.push('corticosteroide');
    }
    
    // Antihypertenseurs
    if (medLower.includes('bêtabloquant') || medLower.includes('ace inhibitor') || 
        medLower.includes('inhibiteur') || medLower.includes('diurétique') ||
        medLower.includes('sartan') || medLower.includes('tension') ||
        medLower.includes('hypertension')) {
      categories.push('antihypertenseur');
    }
  });
  
  // Éliminer les doublons
  return Array.from(new Set(categories));
}

// Fonction pour générer une raison personnalisée pour la recommandation
export function generatePersonalizedReason(
  supplement: any,
  targetSymptoms: string[],
  targetGoals: string[],
  userProfile: UserProfile
): string {
  let reason = "";
  
  // Si nous avons des symptômes ciblés, commencer par les mentionner
  if (targetSymptoms.length > 0) {
    const symptomNames = targetSymptoms.map(id => {
      const symptomMapping: Record<string, string> = {
        'stress': 'stress',
        'anxiety': 'anxiété',
        'insomnia': 'insomnie',
        'fatigue': 'fatigue',
        'digestive_issues': 'problèmes digestifs',
        'headache': 'maux de tête',
        'muscle_tension': 'tensions musculaires',
        'joint_pain': 'douleurs articulaires'
      };
      return symptomMapping[id] || id;
    });
    
    if (symptomNames.length === 1) {
      reason += `Le ${supplement.name} est particulièrement efficace pour votre niveau de ${symptomNames[0]}. `;
    } else if (symptomNames.length === 2) {
      reason += `Le ${supplement.name} cible simultanément vos symptômes de ${symptomNames[0]} et ${symptomNames[1]}. `;
    } else {
      const lastSymptom = symptomNames.pop();
      reason += `Le ${supplement.name} est recommandé pour traiter vos symptômes de ${symptomNames.join(', ')} et ${lastSymptom}. `;
    }
  }
  
  // Ajouter des objectifs si présents
  if (targetGoals.length > 0) {
    const goalNames = targetGoals.map(id => {
      const goalMapping: Record<string, string> = {
        'stress_management': 'gestion du stress',
        'sleep_improvement': 'amélioration du sommeil',
        'energy_enhancement': 'augmentation de l\'énergie',
        'immune_boost': 'renforcement immunitaire',
        'cognitive_function': 'fonction cognitive'
      };
      return goalMapping[id] || id;
    });
    
    if (goalNames.length === 1) {
      reason += `Soutient votre objectif d'${goalNames[0]}. `;
    } else if (goalNames.length === 2) {
      reason += `Contribue à vos objectifs d'${goalNames[0]} et d'${goalNames[1]}. `;
    } else {
      const lastGoal = goalNames.pop();
      reason += `Aide à atteindre vos objectifs d'${goalNames.join(', ')} et d'${lastGoal}. `;
    }
  }
  
  // Ajouter un mécanisme d'action adapté au profil
  const biochemicalSummary = (supplement.biochemicalMechanism || "").split(".")[0] + ".";
  reason += biochemicalSummary + " ";
  
  // Mentionner l'efficacité scientifique
  const evidenceLevelMap: Record<string, string> = {
    'strong': 'preuves scientifiques solides',
    'moderate': 'preuves scientifiques modérées',
    'preliminary': 'preuves scientifiques préliminaires mais prometteuses'
  };
  
  const evidenceLevel = evidenceLevelMap[supplement.scientificEvidence.overallEvidenceLevel] || 'preuves scientifiques';
  reason += `Cette recommandation est basée sur des ${evidenceLevel} et un profil de sécurité adapté à votre situation.`;
  
  return reason;
}
