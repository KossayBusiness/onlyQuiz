import { SupplementInfo, SupplementCategory, SupplementType, EvidenceLevel, SafetyRating, 
  ContraindicationSeverity, InteractionType, InteractionSeverity, Gender, StudyType } from '@/utils/types';

/**
 * Catalogue complet des compléments alimentaires avec données scientifiques détaillées
 */
export const SUPPLEMENT_CATALOG: Record<string, SupplementInfo> = {
  "magnesium-glycinate": {
    id: "magnesium-glycinate",
    name: "Magnésium Glycinate",
    scientificName: "Bis-glycinate de magnésium",
    category: SupplementCategory.MINERAL,
    type: SupplementType.CAPSULE,
    
    shortDescription: "Forme hautement biodisponible de magnésium liée à l'acide aminé glycine, particulièrement efficace pour le stress et la relaxation musculaire.",
    fullDescription: "Le magnésium glycinate est une forme chélatée de magnésium liée à l'acide aminé glycine, ce qui améliore son absorption et réduit les effets secondaires digestifs souvent associés à d'autres formes de magnésium. Ce minéral essentiel est impliqué dans plus de 300 réactions enzymatiques dans le corps, notamment la production d'énergie, la synthèse des protéines, la fonction musculaire et nerveuse, et la régulation de la glycémie.",
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
  },

  "ashwagandha-extract": {
    id: "ashwagandha-extract",
    name: "Extrait d'Ashwagandha",
    scientificName: "Withania somnifera",
    category: SupplementCategory.HERB,
    type: SupplementType.CAPSULE,
    
    shortDescription: "Plante adaptogène ayurvédique qui aide à réduire le stress, favorise l'équilibre hormonal et soutient le système immunitaire.",
    fullDescription: "L'Ashwagandha est une plante adaptogène utilisée depuis des millénaires dans la médecine traditionnelle ayurvédique. Ses principes actifs, principalement des withanolides, aident l'organisme à s'adapter au stress physique et mental. Cette plante possède de nombreuses propriétés bénéfiques : elle réduit le cortisol (hormone du stress), améliore les fonctions cognitives, régule les hormones thyroïdiennes, renforce l'immunité et possède des effets anti-inflammatoires et antioxydants.",
    biochemicalMechanism: "L'ashwagandha agit principalement en régulant l'axe hypothalamo-hypophyso-surrénalien (HHS), modulant ainsi la réponse au stress. Les withanolides présents dans la plante agissent comme précurseurs hormonaux et influencent la production de cortisol. L'ashwagandha module également les neurotransmetteurs GABA et sérotonine, favorisant la relaxation mentale. Par ailleurs, ses propriétés antioxydantes neutralisent les radicaux libres et protègent contre le stress oxydatif cellulaire.",
    
    benefits: [
      {
        description: "Réduction du stress et de l'anxiété",
        efficacyPercentage: 80,
        timeFrame: "4-6 semaines",
        evidenceLevel: EvidenceLevel.STRONG
      },
      {
        description: "Amélioration de l'endurance et récupération physique",
        efficacyPercentage: 75,
        timeFrame: "6-8 semaines",
        evidenceLevel: EvidenceLevel.MODERATE
      },
      {
        description: "Soutien de la fonction thyroïdienne",
        efficacyPercentage: 65,
        timeFrame: "8-12 semaines",
        evidenceLevel: EvidenceLevel.PRELIMINARY
      },
      {
        description: "Amélioration de la qualité du sommeil",
        efficacyPercentage: 72,
        timeFrame: "2-4 semaines",
        evidenceLevel: EvidenceLevel.MODERATE
      },
      {
        description: "Renforcement du système immunitaire",
        efficacyPercentage: 68,
        timeFrame: "4-8 semaines",
        evidenceLevel: EvidenceLevel.PRELIMINARY
      }
    ],
    
    primaryBenefits: [
      "Réduit les niveaux de cortisol, l'hormone du stress, et améliore la résilience face aux facteurs stressants",
      "Soutient l'équilibre hormonal, particulièrement bénéfique pour la thyroïde",
      "Améliore la qualité du sommeil et contribue à réduire l'insomnie liée au stress"
    ],
    
    secondaryBenefits: [
      "Augmente l'endurance physique et accélère la récupération après l'effort",
      "Renforce le système immunitaire et améliore la résistance aux infections",
      "Possède des propriétés anti-inflammatoires et antioxydantes",
      "Peut contribuer à améliorer la concentration et la mémoire"
    ],
    
    timeToEffect: {
      initial: "1-2 semaines pour les premiers effets sur le stress",
      optimal: "4-6 semaines pour les effets complets sur le stress et l'anxiété",
      duration: "Les effets se maintiennent avec une utilisation continue, diminution progressive sur 1-3 semaines après l'arrêt"
    },
    
    efficacyRatings: {
      "stress": {
        percentage: 80,
        timeFrame: "4-6 semaines",
        confidenceLevel: 90,
        notes: "Particulièrement efficace pour le stress chronique et la réduction du cortisol",
        conditionalFactors: [
          {
            factor: "Niveau de stress initial",
            impact: "Efficacité plus marquée chez les personnes très stressées"
          }
        ]
      },
      "anxiety": {
        percentage: 75,
        timeFrame: "4-8 semaines",
        confidenceLevel: 85,
        notes: "Effets anxiolytiques significatifs, sans la somnolence causée par les médicaments",
        conditionalFactors: [
          {
            factor: "Type d'anxiété",
            impact: "Plus efficace pour l'anxiété généralisée que pour les troubles paniques aigus"
          }
        ]
      },
      "fatigue": {
        percentage: 70,
        timeFrame: "3-6 semaines",
        confidenceLevel: 80,
        notes: "Améliore les niveaux d'énergie en réduisant le stress chronique et en soutenant la fonction surrénalienne",
        conditionalFactors: []
      }
    },
    
    standardDosage: {
      amount: "300-500 mg d'extrait standardisé (contenant 5% de withanolides) par jour",
      frequency: "1-2 fois par jour",
      timing: "De préférence avec les repas pour minimiser les troubles digestifs. Pour améliorer le sommeil, privilégier une prise le soir.",
      notes: "Toujours vérifier le pourcentage de withanolides dans l'extrait, qui détermine la puissance du produit."
    },
    
    specificDosages: {
      "athletes": {
        amount: "500-600 mg par jour",
        notes: "Dose plus élevée pour soutenir la récupération et les performances"
      },
      "elderly": {
        amount: "300-400 mg par jour",
        notes: "Commencer avec une dose plus faible et augmenter progressivement"
      },
      "stress_related_insomnia": {
        amount: "600 mg par jour",
        notes: "Prise unique 1-2 heures avant le coucher"
      }
    },
    
    naturalSources: [
      {
        name: "Racine d'Ashwagandha brute",
        concentration: "Variable",
        notes: "Utilisée traditionnellement en décoction ou en poudre"
      },
      {
        name: "Lait à l'Ashwagandha (Moon Milk)",
        concentration: "2-3g de poudre par tasse",
        notes: "Boisson traditionnelle ayurvédique pour le sommeil"
      }
    ],
    
    safetyProfile: {
      generalSafety: SafetyRating.GENERALLY_SAFE,
      pregnancySafety: SafetyRating.UNSAFE,
      childrenSafety: SafetyRating.CAUTION,
      elderSafety: SafetyRating.GENERALLY_SAFE
    },
    
    contraindications: [
      {
        condition: "Grossesse et allaitement",
        severity: ContraindicationSeverity.ABSOLUTE,
        description: "L'ashwagandha peut avoir des effets abortifs et n'a pas été suffisamment étudiée chez les femmes allaitantes."
      },
      {
        condition: "Maladies auto-immunes",
        severity: ContraindicationSeverity.RELATIVE,
        description: "En raison de ses effets immunostimulants, pourrait théoriquement aggraver certaines conditions auto-immunes."
      },
      {
        condition: "Hyperthyroïdie",
        severity: ContraindicationSeverity.RELATIVE,
        description: "Peut stimuler la fonction thyroïdienne et potentiellement aggraver l'hyperthyroïdie."
      }
    ],
    
    interactions: [
      {
        interactionType: InteractionType.DRUG,
        substance: "Sédatifs",
        effect: "Potentialisation des effets sédatifs",
        severity: InteractionSeverity.MODERATE,
        recommendation: "Éviter l'utilisation concomitante ou consulter un professionnel de santé"
      },
      {
        interactionType: InteractionType.DRUG,
        substance: "Médicaments thyroïdiens",
        effect: "Peut modifier les niveaux d'hormones thyroïdiennes",
        severity: InteractionSeverity.MODERATE,
        recommendation: "Surveillance médicale et ajustement de dosage potentiellement nécessaires"
      },
      {
        interactionType: InteractionType.DRUG,
        substance: "Immunosuppresseurs",
        effect: "Peut réduire l'efficacité des médicaments immunosuppresseurs",
        severity: InteractionSeverity.MODERATE,
        recommendation: "Éviter l'utilisation concomitante ou consulter un professionnel de santé"
      }
    ],
    
    targetDemographics: {
      ageRange: [18, 80],
      gender: Gender.ALL,
      conditions: ["stress", "anxiety", "fatigue", "insomnia", "thyroid_disorders"],
      lifestyleFactors: ["high_stress_occupation", "athletic_activity", "burnout_risk"]
    },
    
    scientificEvidence: {
      overallEvidenceLevel: EvidenceLevel.MODERATE,
      keyStudies: [
        {
          authors: "Chandrasekhar K, Kapoor J, Anishetty S",
          title: "A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults",
          journal: "Indian Journal of Psychological Medicine",
          year: 2012,
          studyType: StudyType.RCT,
          sampleSize: 64,
          findings: "Réduction significative des scores de stress et des niveaux de cortisol sérique chez les sujets prenant de l'ashwagandha par rapport au placebo",
          relevance: "Démontre l'efficacité contre le stress chronique"
        },
        {
          authors: "Langade D, Kanchi S, Salve J, et al.",
          title: "Efficacy and Safety of Ashwagandha (Withania somnifera) Root Extract in Insomnia and Anxiety: A Double-blind, Randomized, Placebo-controlled Study",
          journal: "Cureus",
          year: 2019,
          doi: "10.7759/cureus.5797",
          studyType: StudyType.RCT,
          sampleSize: 60,
          findings: "Amélioration significative de la qualité du sommeil et réduction de l'anxiété chez les participants prenant de l'ashwagandha",
          relevance: "Soutient l'utilisation pour les troubles du sommeil liés au stress"
        },
        {
          authors: "Choudhary D, Bhattacharyya S, Joshi K",
          title: "Body Weight Management in Adults Under Chronic Stress Through Treatment With Ashwagandha Root Extract: A Double-Blind, Randomized, Placebo-Controlled Trial",
          journal: "Journal of Evidence-Based Complementary & Alternative Medicine",
          year: 2017,
          studyType: StudyType.RCT,
          sampleSize: 52,
          findings: "Réduction significative du stress perçu, amélioration des habitudes alimentaires et réduction du poids corporel",
          relevance: "Démontre des avantages potentiels pour la gestion du poids lié au stress"
        }
      ]
    },
    
    additionalInfo: {
      commonNames: ["Ginseng indien", "Cerise d'hiver", "Withania"],
      history: "Utilisée depuis plus de 3000 ans dans la médecine ayurvédique en Inde, où elle est considérée comme un 'rasayana' (rajeunissant) majeur. Son nom sanscrit 'Ashwagandha' signifie 'odeur de cheval', faisant référence à l'odeur de ses racines et à sa capacité légendaire à conférer la vitalité d'un cheval.",
      sustainabilitySourcing: "Principalement cultivée en Inde, cette plante est relativement durable car elle nécessite peu d'eau et peut pousser dans des sols semi-arides.",
      certifications: ["Bio", "Sans OGM", "Végétalien"]
    },
    
    targetSymptoms: [
      "stress",
      "anxiety",
      "fatigue",
      "insomnia",
      "low_immunity",
      "cognitive_decline",
      "hormonal_imbalance",
      "low_libido",
      "muscle_weakness",
      "inflammation"
    ],
    
    targetGoals: [
      "stress_management",
      "sleep_improvement",
      "energy_enhancement",
      "immune_boost",
      "cognitive_function",
      "hormonal_balance",
      "physical_performance",
      "vitality"
    ],
    
    systemMetadata: {
      lastUpdated: "2025-02-20",
      popularity: 88,
      controversyLevel: 15,
      tags: ["adaptogen", "stress", "immunity", "sleep", "thyroid", "ayurvedic"]
    }
  }
};
