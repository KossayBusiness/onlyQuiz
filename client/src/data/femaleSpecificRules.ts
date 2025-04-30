/**
 * Règles prédictives spécifiques aux femmes
 * Ces règles sont utilisées pour personnaliser les recommandations et prédictions
 * en fonction des besoins physiologiques spécifiques des femmes
 */

import { FemaleSpecificData } from '@/utils/types';

// Règles prédictives spécifiques aux femmes
export const femaleSpecificRules = [
  {
    // Règle pour les problèmes de cycle menstruel liés à la carence en fer
    id: 'female_iron_deficiency',
    ifPattern: {
      symptoms: ['fatigue', 'weakness'],
      gender: 'femme',
      femaleCycle: {
        ageRange: [18, 50]
      }
    },
    thenPredict: {
      likelyAdditionalSymptoms: ['dizziness', 'pale_skin', 'heavy_periods'],
      recommendedSupplements: ['iron', 'vitamin_c', 'vitamin_b12'],
      confidenceScore: 0.85,
      scientificRationale: "Les femmes en âge de procréer ont un risque accru de carence en fer en raison des pertes menstruelles, ce qui peut entraîner fatigue et faiblesse."
    }
  },
  {
    // Règle pour les symptômes prémenstruels
    id: 'female_pms_symptoms',
    ifPattern: {
      symptoms: ['mood_swings', 'irritability'],
      gender: 'femme',
      femaleCycle: {
        ageRange: [14, 50]
      }
    },
    thenPredict: {
      likelyAdditionalSymptoms: ['bloating', 'breast_tenderness', 'headaches', 'food_cravings'],
      recommendedSupplements: ['magnesium', 'vitamin_b6', 'calcium', 'omega_3'],
      confidenceScore: 0.78,
      scientificRationale: "Les fluctuations hormonales durant la phase lutéale du cycle menstruel peuvent provoquer un syndrome prémenstruel avec ces symptômes caractéristiques."
    }
  },
  {
    // Règle pour les symptômes de ménopause
    id: 'female_menopause_symptoms',
    ifPattern: {
      symptoms: ['hot_flashes', 'sleep_issues'],
      gender: 'femme',
      femaleCycle: {
        ageRange: [45, 60],
        cyclePhase: 'perimenopause'
      }
    },
    thenPredict: {
      likelyAdditionalSymptoms: ['mood_changes', 'weight_gain', 'night_sweats', 'vaginal_dryness'],
      recommendedSupplements: ['black_cohosh', 'vitamin_e', 'vitamin_d', 'calcium'],
      confidenceScore: 0.82,
      scientificRationale: "La diminution des œstrogènes pendant la ménopause entraîne souvent ces symptômes caractéristiques qui peuvent être atténués par certains suppléments."
    }
  },
  {
    // Règle pour l'ostéoporose post-ménopausique
    id: 'female_bone_health',
    ifPattern: {
      symptoms: ['joint_pain', 'backache'],
      gender: 'femme',
      femaleCycle: {
        ageRange: [50, 90],
        cyclePhase: 'postmenopause'
      }
    },
    thenPredict: {
      likelyAdditionalSymptoms: ['height_loss', 'stooped_posture', 'bone_fractures'],
      recommendedSupplements: ['calcium', 'vitamin_d3', 'vitamin_k2', 'magnesium'],
      confidenceScore: 0.79,
      scientificRationale: "La baisse des œstrogènes après la ménopause accélère la perte de densité osseuse, augmentant le risque d'ostéoporose et justifiant une supplémentation ciblée."
    }
  },
  {
    // Règle pour la santé thyroïdienne des femmes
    id: 'female_thyroid_health',
    ifPattern: {
      symptoms: ['fatigue', 'weight_changes', 'cold_sensitivity'],
      gender: 'femme'
    },
    thenPredict: {
      likelyAdditionalSymptoms: ['dry_skin', 'hair_loss', 'irregular_periods', 'depression'],
      recommendedSupplements: ['selenium', 'iodine', 'zinc', 'vitamin_d'],
      confidenceScore: 0.76,
      scientificRationale: "Les femmes sont plus susceptibles de développer des problèmes thyroïdiens, notamment l'hypothyroïdie, avec un impact potentiel sur le cycle menstruel."
    }
  },
  {
    // Règle pour l'anémie ferriprive liée aux règles abondantes
    id: 'female_heavy_menstruation',
    ifPattern: {
      symptoms: ['heavy_periods', 'fatigue'],
      gender: 'femme',
      femaleCycle: {
        ageRange: [14, 50],
        cyclePhase: 'menstrual'
      }
    },
    thenPredict: {
      likelyAdditionalSymptoms: ['shortness_of_breath', 'pale_skin', 'weakness'],
      recommendedSupplements: ['iron_bisglycinate', 'folate', 'vitamin_c', 'vitamin_b12'],
      confidenceScore: 0.85,
      scientificRationale: "Les menstruations abondantes sont une cause fréquente d'anémie ferriprive chez les femmes, nécessitant une supplémentation en fer et cofacteurs."
    }
  },
  {
    // Règle pour les problèmes de fertilité
    id: 'female_fertility_issues',
    ifPattern: {
      symptoms: ['irregular_periods', 'difficulty_conceiving'],
      gender: 'femme',
      femaleCycle: {
        ageRange: [18, 45],
        hormonalStatus: 'irregular'
      }
    },
    thenPredict: {
      likelyAdditionalSymptoms: ['hormonal_imbalance', 'pcos_symptoms', 'weight_changes'],
      recommendedSupplements: ['myo_inositol', 'folate', 'coq10', 'vitamin_d', 'omega_3'],
      confidenceScore: 0.77,
      scientificRationale: "Certains micronutriments jouent un rôle essentiel dans la régulation hormonale féminine et la santé reproductive, notamment en cas d'irrégularités menstruelles."
    }
  }
];

// Interactions spécifiques aux femmes avec des suppléments
export const femaleSpecificSupplementInteractions = {
  // Interactions avec les contraceptifs hormonaux
  hormonal_birth_control: {
    iron: { effect: "neutral", notes: "Aucune interaction significative" },
    calcium: { effect: "neutral", notes: "Aucune interaction significative" },
    vitamin_c: { effect: "beneficial", notes: "Peut compenser la diminution de vitamine C causée par certains contraceptifs" },
    vitamin_b6: { effect: "beneficial", notes: "Peut aider à réduire les effets secondaires des contraceptifs" },
    vitamin_b12: { effect: "beneficial", notes: "Peut compenser les carences potentielles liées aux contraceptifs" },
    magnesium: { effect: "beneficial", notes: "Peut aider à réduire les crampes et la rétention d'eau" },
    zinc: { effect: "beneficial", notes: "Peut compenser la diminution de zinc causée par certains contraceptifs" },
    st_johns_wort: { effect: "negative", notes: "ATTENTION: Peut réduire l'efficacité des contraceptifs hormonaux" }
  },
  
  // Interactions pendant la grossesse
  pregnancy: {
    folate: { effect: "essential", notes: "Cruciale pour prévenir les anomalies du tube neural" },
    iron: { effect: "important", notes: "Essentiel pour prévenir l'anémie de grossesse" },
    vitamin_d: { effect: "important", notes: "Important pour la santé osseuse de la mère et du bébé" },
    calcium: { effect: "important", notes: "Crucial pour le développement osseux du fœtus" },
    dha: { effect: "beneficial", notes: "Important pour le développement cérébral du fœtus" },
    vitamin_a: { effect: "caution", notes: "ATTENTION: Limiter à 750mcg/jour, risque de malformations fœtales à doses élevées" }
  },
  
  // Interactions pendant la ménopause
  menopause: {
    black_cohosh: { effect: "beneficial", notes: "Peut réduire les bouffées de chaleur, à éviter en cas d'antécédents de cancer du sein" },
    red_clover: { effect: "moderate", notes: "Effet modéré sur les symptômes vasomoteurs" },
    soy_isoflavones: { effect: "moderate", notes: "Effet modéré sur les symptômes vasomoteurs, à utiliser avec prudence en cas d'antécédents de cancer hormono-dépendant" },
    evening_primrose_oil: { effect: "limited", notes: "Preuves limitées pour les bouffées de chaleur" },
    vitamin_e: { effect: "mild", notes: "Effet léger sur les bouffées de chaleur" }
  }
};

// Recommandations spécifiques selon la phase de vie
export const femaleLifeCycleSpecificRecommendations = {
  fertile_age: {
    iron: { importance: "high", dosage: "18mg/jour", notes: "Particulièrement important pendant les menstruations" },
    folate: { importance: "high", dosage: "400-800mcg/jour", notes: "Crucial si grossesse potentielle" },
    calcium: { importance: "medium", dosage: "1000mg/jour", notes: "Important pour la santé osseuse à long terme" },
    vitamin_d: { importance: "medium", dosage: "600-2000 UI/jour", notes: "Associer avec le calcium" },
    magnesium: { importance: "medium", dosage: "310-360mg/jour", notes: "Peut réduire les symptômes prémenstruels" },
    omega_3: { importance: "medium", dosage: "1000-2000mg/jour", notes: "Bénéfique pour réduire l'inflammation liée aux menstruations" }
  },
  
  perimenopause: {
    magnesium: { importance: "high", dosage: "320-360mg/jour", notes: "Peut aider à réguler l'humeur et le sommeil" },
    vitamin_d: { importance: "high", dosage: "1000-2000 UI/jour", notes: "Important pour maintenir la densité osseuse" },
    calcium: { importance: "high", dosage: "1000-1200mg/jour", notes: "Essentiel pour prévenir la perte osseuse" },
    vitamin_b6: { importance: "medium", dosage: "50-100mg/jour", notes: "Peut aider à équilibrer les hormones" },
    black_cohosh: { importance: "optional", dosage: "20-80mg/jour", notes: "Pour les symptômes vasomoteurs" },
    evening_primrose: { importance: "optional", dosage: "1000-3000mg/jour", notes: "Peut aider avec certains symptômes" }
  },
  
  postmenopause: {
    calcium: { importance: "high", dosage: "1200mg/jour", notes: "Critique pour la santé osseuse" },
    vitamin_d3: { importance: "high", dosage: "1000-2000 UI/jour", notes: "Essentiel avec le calcium" },
    vitamin_k2: { importance: "medium", dosage: "90-120mcg/jour", notes: "Aide à diriger le calcium vers les os" },
    magnesium: { importance: "medium", dosage: "320-360mg/jour", notes: "Cofacteur pour la santé osseuse" },
    omega_3: { importance: "medium", dosage: "1000-2000mg/jour", notes: "Bénéfique pour la santé cardiovasculaire" },
    vitamin_b12: { importance: "medium", dosage: "400-1000mcg/jour", notes: "Absorption diminuée avec l'âge" }
  }
};

/**
 * Détermine la phase de vie reproductive d'une femme en fonction de son âge
 * Cette fonction est utilisée pour personnaliser les recommandations
 * @param age Âge de la femme
 * @returns Phase du cycle de vie reproductive
 */
export function determineFemaleLifeCyclePhase(age: number): 'fertile_age' | 'perimenopause' | 'postmenopause' {
  if (age < 45) {
    return 'fertile_age';
  } else if (age >= 45 && age <= 55) {
    return 'perimenopause';
  } else {
    return 'postmenopause';
  }
}

/**
 * Calcule les ajustements de dosage recommandés en fonction du cycle menstruel
 * @param supplement Identifiant du supplément
 * @param cyclePhase Phase actuelle du cycle
 * @param standardDosage Dosage standard du supplément
 * @returns Dosage ajusté et notes explicatives
 */
export function calculateCycleAdjustedDosage(
  supplement: string, 
  cyclePhase: FemaleSpecificData['cyclePhase'],
  standardDosage: string
): { adjustedDosage: string, notes: string } {
  // Valeurs par défaut
  let adjustedDosage = standardDosage;
  let notes = "";
  
  // Si pas d'information sur la phase du cycle ou pas de cycle (ménopause)
  if (!cyclePhase || ['perimenopause', 'postmenopause'].includes(cyclePhase)) {
    return { adjustedDosage, notes };
  }
  
  // Ajustements spécifiques selon la phase du cycle et le supplément
  switch (cyclePhase) {
    case 'follicular':
      // Phase folliculaire (début du cycle jusqu'à l'ovulation)
      if (['iron', 'vitamin_c'].includes(supplement)) {
        // Dosage standard pendant cette phase
        notes = "Dosage standard recommandé pendant la phase folliculaire.";
      } else if (['magnesium', 'vitamin_b6', 'calcium'].includes(supplement)) {
        // Ces suppléments peuvent être légèrement réduits pendant cette phase
        const match = standardDosage.match(/(\d+)(\s*-\s*\d+)?(\s*\w+)/);
        if (match) {
          const minDose = parseInt(match[1]);
          const unit = match[3];
          const optimizedDose = Math.floor(minDose * 0.9);
          adjustedDosage = `${optimizedDose}${unit}`;
          notes = "Dosage légèrement réduit, optimal pour la phase folliculaire du cycle.";
        }
      }
      break;
      
    case 'ovulation':
      // Phase d'ovulation (milieu du cycle)
      if (['zinc', 'selenium'].includes(supplement)) {
        // Ces minéraux sont particulièrement bénéfiques autour de l'ovulation
        const match = standardDosage.match(/(\d+)(\s*-\s*\d+)?(\s*\w+)/);
        if (match) {
          const minDose = parseInt(match[1]);
          const maxDose = match[2] ? parseInt(match[2].replace(/\s*-\s*/, '')) : minDose;
          const unit = match[3];
          const optimizedDose = Math.ceil(maxDose * 1.05);
          adjustedDosage = `${optimizedDose}${unit}`;
          notes = "Légère augmentation recommandée autour de l'ovulation pour optimiser la fertilité.";
        }
      }
      break;
      
    case 'luteal':
      // Phase lutéale (après ovulation jusqu'aux menstruations)
      if (['magnesium', 'vitamin_b6', 'calcium', 'vitamin_d'].includes(supplement)) {
        // Ces suppléments sont particulièrement bénéfiques en phase lutéale pour les symptômes prémenstruels
        const match = standardDosage.match(/(\d+)(\s*-\s*\d+)?(\s*\w+)/);
        if (match) {
          const maxDose = match[2] ? parseInt(match[2].replace(/\s*-\s*/, '')) : parseInt(match[1]);
          const unit = match[3];
          const optimizedDose = Math.ceil(maxDose * 1.1);
          adjustedDosage = `${optimizedDose}${unit}`;
          notes = "Dosage augmenté, particulièrement bénéfique pendant la phase lutéale pour réduire les symptômes prémenstruels.";
        }
      }
      break;
      
    case 'menstrual':
      // Phase menstruelle
      if (['iron', 'vitamin_c', 'vitamin_b12'].includes(supplement)) {
        // Augmentation du fer et cofacteurs pendant les menstruations pour compenser les pertes
        const match = standardDosage.match(/(\d+)(\s*-\s*\d+)?(\s*\w+)/);
        if (match) {
          const maxDose = match[2] ? parseInt(match[2].replace(/\s*-\s*/, '')) : parseInt(match[1]);
          const unit = match[3];
          const optimizedDose = Math.ceil(maxDose * 1.15);
          adjustedDosage = `${optimizedDose}${unit}`;
          notes = "Dosage augmenté recommandé pendant les menstruations pour compenser les pertes.";
        }
      }
      break;
  }
  
  return { adjustedDosage, notes };
}