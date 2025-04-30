/**
 * Catalogue enrichi des compléments alimentaires naturels
 * Base de données détaillée pour le système de recommandation personnalisée
 */

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
  },

  "ashwagandha-extract": {
    id: "ashwagandha-extract",
    name: "Extrait d'Ashwagandha",
    scientificName: "Withania somnifera",
    category: SupplementCategory.HERB,
    type: SupplementType.CAPSULE,
    
    shortDescription: "Adaptogène puissant qui aide l'organisme à s'adapter au stress, améliore la résistance mentale et physique, et favorise l'équilibre hormonal.",
    fullDescription: "L'ashwagandha est une plante adaptogène utilisée depuis des millénaires dans la médecine ayurvédique. Elle est particulièrement reconnue pour sa capacité à aider l'organisme à s'adapter au stress physique et mental. L'ashwagandha contient des composés bioactifs appelés withanolides qui sont responsables de ses nombreux effets thérapeutiques. Cette plante soutient l'équilibre du système nerveux, aide à réguler les hormones du stress comme le cortisol, et favorise un sentiment général de bien-être et de calme. Elle est également connue pour ses propriétés immunomodulatrices et anti-inflammatoires.",
    biochemicalMechanism: "L'ashwagandha agit principalement en modulant l'axe hypothalamo-hypophyso-surrénalien (HPA), responsable de la réponse au stress. Les withanolides, principaux composés actifs, réduisent les niveaux de cortisol en régulant la production d'hormones de stress. L'ashwagandha influence également les récepteurs GABA dans le cerveau, produisant un effet calmant similaire à certains anxiolytiques, mais sans effets secondaires sédatifs. Elle augmente aussi les niveaux de DHEA, un précurseur hormonal qui diminue avec l'âge et le stress chronique.",
    
    benefits: [
      {
        description: "Réduction du stress et de l'anxiété",
        efficacyPercentage: 88,
        timeFrame: "4-8 semaines",
        evidenceLevel: EvidenceLevel.STRONG
      },
      {
        description: "Amélioration de la qualité du sommeil",
        efficacyPercentage: 75,
        timeFrame: "2-6 semaines",
        evidenceLevel: EvidenceLevel.MODERATE
      },
      {
        description: "Augmentation de l'énergie et réduction de la fatigue",
        efficacyPercentage: 82,
        timeFrame: "4-12 semaines",
        evidenceLevel: EvidenceLevel.MODERATE
      },
      {
        description: "Soutien de la fonction cognitive et de la concentration",
        efficacyPercentage: 70,
        timeFrame: "8-12 semaines",
        evidenceLevel: EvidenceLevel.PRELIMINARY
      },
      {
        description: "Équilibre hormonal et soutien de la fertilité",
        efficacyPercentage: 65,
        timeFrame: "8-16 semaines",
        evidenceLevel: EvidenceLevel.PRELIMINARY
      }
    ],
    
    primaryBenefits: [
      "Réduit significativement les niveaux de cortisol et la perception du stress (jusqu'à 30% en 60 jours)",
      "Améliore la résistance au stress physique et mental en régulant l'axe HPA",
      "Favorise un sommeil réparateur et réduit le temps d'endormissement"
    ],
    
    secondaryBenefits: [
      "Soutient la fonction thyroïdienne et l'équilibre hormonal",
      "Améliore les performances cognitives et la concentration",
      "Renforce le système immunitaire",
      "Possède des propriétés anti-inflammatoires",
      "Peut aider à stabiliser la glycémie"
    ],
    
    timeToEffect: {
      initial: "1-2 semaines pour les premiers effets sur le stress",
      optimal: "6-8 semaines pour les effets complets sur le système hormonal et nerveux",
      duratio
(Content truncated due to size limit. Use line ranges to read in chunks)