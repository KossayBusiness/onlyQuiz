/**
 * Module temporaire pour la génération de recommandations
 * Ce fichier sert de stub pour le système de recommandation
 */

import type { UserProfile } from "../shared/schema";

// Structure simplifiée pour les recommandations
export interface RecommendationResult {
  primaryRecommendations: any[];
  secondaryRecommendations: any[];
  symptomAnalysis: Record<string, any>;
  goalAnalysis: Record<string, any>;
  lifestyleRecommendations: Record<string, string[]>;
  dietaryRecommendations: Record<string, string[]>;
}

/**
 * Génère des recommandations personnalisées basées sur le profil utilisateur
 * Version simplifiée (stub) pour la démonstration
 */
export function generatePersonalizedRecommendations(userProfile: UserProfile): RecommendationResult {
  // Simulation de traitement des symptômes et objectifs
  const processedSymptoms = Object.entries(userProfile.symptoms || {}).map(([symptom, severity]) => ({
    symptomId: symptom,
    name: symptom,
    severity: severity as number,
    priority: (severity as number) * 1.2,
  }));
  
  const processedGoals = Object.entries(userProfile.goals || {}).map(([goal, importance]) => ({
    goalId: goal,
    name: goal,
    importance: importance as number,
    priority: (importance as number) * 1.5,
  }));
  
  // Recommandations simulées
  return {
    primaryRecommendations: [
      {
        id: "magnesium",
        name: "Magnésium Bisglycinate",
        description: "Forme hautement biodisponible du magnésium, essentiel pour plus de 300 réactions enzymatiques",
        matchScore: 92,
        confidenceLevel: 89,
        personalizedReason: "Le magnésium aide à réduire la fatigue et combat le stress chronique",
        targetSymptoms: ["Fatigue", "Stress"],
        targetGoals: ["Améliorer l'énergie", "Réduire l'anxiété"],
        scientificEvidence: {
          level: 85,
          summary: "Niveau d'évidence scientifique élevé (85%)"
        },
        cautions: ["Peut causer des selles molles à haute dose"],
        dosageRecommendation: "300-400mg par jour en 2 prises",
        category: "primary"
      },
      {
        id: "vitaminD",
        name: "Vitamine D3 + K2",
        description: "Combinaison synergique pour l'absorption du calcium et la santé immunitaire",
        matchScore: 88,
        confidenceLevel: 87,
        personalizedReason: "La vitamine D3 renforce l'immunité et améliore la fatigue chronique",
        targetSymptoms: ["Fatigue", "Immunité faible"],
        targetGoals: ["Renforcer l'immunité"],
        scientificEvidence: {
          level: 90,
          summary: "Niveau d'évidence scientifique très élevé (90%)"
        },
        cautions: ["Ne pas dépasser la dose recommandée"],
        dosageRecommendation: "2000 UI de D3 + 100 mcg de K2 quotidiennement",
        category: "primary"
      }
    ],
    secondaryRecommendations: [
      {
        id: "omega3",
        name: "Oméga-3 EPA/DHA",
        description: "Acides gras essentiels pour la santé cognitive et cardiovasculaire",
        matchScore: 75,
        confidenceLevel: 82,
        personalizedReason: "Les oméga-3 réduisent l'inflammation et améliorent la concentration",
        targetSymptoms: ["Inflammation", "Problèmes de concentration"],
        targetGoals: ["Améliorer la clarté mentale"],
        scientificEvidence: {
          level: 88,
          summary: "Niveau d'évidence scientifique élevé (88%)"
        },
        cautions: ["Consulter un médecin si vous prenez des anticoagulants"],
        dosageRecommendation: "1000-2000mg par jour avec un repas",
        category: "secondary"
      }
    ],
    symptomAnalysis: Object.fromEntries(
      processedSymptoms.map(s => [s.symptomId, {
        severity: s.severity,
        priority: s.priority,
        relatedSymptoms: [],
        potentialCauses: []
      }])
    ),
    goalAnalysis: Object.fromEntries(
      processedGoals.map(g => [g.goalId, {
        importance: g.importance,
        priority: g.priority,
        timeFrame: "2-3 mois",
        recommendedApproach: "Approche progressive"
      }])
    ),
    lifestyleRecommendations: {
      "Fatigue": [
        "Pratiquer une activité physique modérée régulière (30 minutes, 3-4 fois par semaine)",
        "Établir un horaire de sommeil régulier",
        "Intégrer de courtes pauses actives durant la journée"
      ],
      "Stress": [
        "Pratiquer des exercices de respiration profonde (5 minutes, 3 fois par jour)",
        "Intégrer une pratique quotidienne de méditation ou de pleine conscience",
        "Consacrer du temps à des activités qui procurent du plaisir"
      ]
    },
    dietaryRecommendations: {
      "Fatigue": [
        "Privilégier les aliments riches en fer (légumes verts, légumineuses, viande rouge maigre)",
        "Consommer des glucides complexes pour une énergie soutenue (avoine, quinoa, patate douce)",
        "Intégrer des protéines à chaque repas pour stabiliser l'énergie"
      ],
      "Stress": [
        "Augmenter la consommation d'aliments riches en magnésium (légumes verts, noix, graines)",
        "Privilégier les aliments riches en oméga-3 (poissons gras, graines de lin, noix)",
        "Réduire la consommation de sucres raffinés et de caféine"
      ]
    }
  };
}

/**
 * Génère un profil neuropsychologique simulé pour la démonstration
 */
export function generateNeuroProfile(quizResponse: any, userBehavior: any): UserProfile {
  // Les données brutes du quiz, simplifiées pour la démonstration
  const age = quizResponse.age || 35;
  const gender = quizResponse.gender || "female";
  const symptoms = quizResponse.symptoms || {
    "Fatigue": 7,
    "Stress": 8,
    "Problèmes de sommeil": 6
  };
  const goals = quizResponse.goals || {
    "Améliorer l'énergie": 9,
    "Réduire l'anxiété": 8,
    "Améliorer la qualité du sommeil": 7
  };
  
  // Profil utilisateur simulé
  return {
    age,
    gender,
    symptoms,
    goals,
    existingConditions: quizResponse.existingConditions || [],
    medications: quizResponse.medications || [],
    allergies: quizResponse.allergies || [],
    lifestyleFactors: quizResponse.lifestyleFactors || [],
    preferences: {
      supplementTypes: quizResponse.supplementTypes || [],
      naturalOnly: quizResponse.naturalOnly || true,
      budgetConstraint: quizResponse.budgetConstraint || "medium",
      tastePreferences: quizResponse.tastePreferences || []
    }
  };
}