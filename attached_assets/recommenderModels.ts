import { QuizResponse, Recommendation, LearningData } from './types';

/**
 * Simple modèle basé sur des règles
 * C'est le point de départ le plus simple pour un système de recommandation
 */
export function ruleBasedModel(quizData: QuizResponse): { recommendationIds: string[], confidences: number[] } {
  const { age, gender, dietaryPreferences, healthConcerns, goals } = quizData;

  // Tableau de scores pour chaque produit
  const productScores: Record<string, number> = {};

  // Exemple de règles simples
  if (healthConcerns?.includes('stress')) {
    productScores['stress-relief-complex'] = (productScores['stress-relief-complex'] || 0) + 0.8;
    productScores['magnesium-complex'] = (productScores['magnesium-complex'] || 0) + 0.6;
    productScores['vitamin-b-complex'] = (productScores['vitamin-b-complex'] || 0) + 0.5;
  }

  if (healthConcerns?.includes('fatigue')) {
    productScores['iron-complex'] = (productScores['iron-complex'] || 0) + 0.7;
    productScores['vitamin-b-complex'] = (productScores['vitamin-b-complex'] || 0) + 0.7;
    productScores['coq10-supplement'] = (productScores['coq10-supplement'] || 0) + 0.6;
  }

  if (healthConcerns?.includes('sleep')) {
    productScores['melatonin-supplement'] = (productScores['melatonin-supplement'] || 0) + 0.9;
    productScores['magnesium-complex'] = (productScores['magnesium-complex'] || 0) + 0.5;
    productScores['herbal-sleep-formula'] = (productScores['herbal-sleep-formula'] || 0) + 0.8;
  }

  if (goals?.includes('weight-loss')) {
    productScores['metabolism-support'] = (productScores['metabolism-support'] || 0) + 0.7;
    productScores['fiber-supplement'] = (productScores['fiber-supplement'] || 0) + 0.6;
  }

  if (goals?.includes('focus')) {
    productScores['omega-3-complex'] = (productScores['omega-3-complex'] || 0) + 0.7;
    productScores['nootropic-complex'] = (productScores['nootropic-complex'] || 0) + 0.8;
  }

  // Adjustments based on diet
  if (dietaryPreferences?.includes('vegetarian')) {
    // Réduire le score des produits non-végétariens
    productScores['omega-3-fish-oil'] = (productScores['omega-3-fish-oil'] || 0) - 1.0;
    // Augmenter le score des alternatives végétariennes
    productScores['omega-3-algae'] = (productScores['omega-3-algae'] || 0) + 0.8;
  }

  // Transformation en tableaux triés
  const sortedProducts = Object.entries(productScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0);

  const recommendationIds = sortedProducts.map(([id, _]) => id);
  const confidences = sortedProducts.map(([_, score]) => Math.min(score, 1.0));

  return { recommendationIds, confidences };
}

/**
 * Modèle collaboratif simple
 * Se base sur les comportements similaires d'autres utilisateurs
 */
export function collaborativeFilteringModel(
  quizData: QuizResponse, 
  learningDatabase: LearningData[]
): { recommendationIds: string[], confidences: number[] } {
  // Si nous n'avons pas assez de données, retour au modèle basé sur des règles
  if (learningDatabase.length < 10) {
    return ruleBasedModel(quizData);
  }

  // Trouver des profils similaires
  const similarProfiles = findSimilarProfiles(quizData, learningDatabase);

  // Si aucun profil similaire, retour au modèle basé sur des règles
  if (similarProfiles.length === 0) {
    return ruleBasedModel(quizData);
  }

  // Collecter les recommandations qui ont bien fonctionné pour des profils similaires
  const recommendationScores: Record<string, { score: number, count: number }> = {};

  similarProfiles.forEach(profile => {
    const { recommendationId, userFeedback, similarity } = profile;

    // Ignorer les feedbacks négatifs
    if (!userFeedback.helpful) return;

    // Pondérer par la similarité et l'intention d'achat
    const weightedScore = similarity * (userFeedback.purchaseIntent / 10);

    if (!recommendationScores[recommendationId]) {
      recommendationScores[recommendationId] = { score: 0, count: 0 };
    }

    recommendationScores[recommendationId].score += weightedScore;
    recommendationScores[recommendationId].count += 1;
  });

  // Calculer les scores moyens
  const avgScores = Object.entries(recommendationScores).map(([id, data]) => {
    return {
      id,
      avgScore: data.count > 0 ? data.score / data.count : 0
    };
  });

  // Trier par score
  avgScores.sort((a, b) => b.avgScore - a.avgScore);

  const recommendationIds = avgScores.map(item => item.id);
  const confidences = avgScores.map(item => Math.min(item.avgScore, 1.0));

  return { recommendationIds, confidences };
}

/**
 * Fonction utilitaire pour trouver des profils similaires
 */
function findSimilarProfiles(
  quizData: QuizResponse,
  learningDatabase: LearningData[]
): Array<{ recommendationId: string, userFeedback: any, similarity: number }> {
  return learningDatabase.map(entry => {
    const similarity = calculateProfileSimilarity(quizData, entry.quizData);

    return {
      recommendationId: entry.recommendationId,
      userFeedback: entry.userFeedback,
      similarity
    };
  })
  // Filtrer uniquement les profils suffisamment similaires
  .filter(profile => profile.similarity > 0.5)
  // Trier par similarité décroissante
  .sort((a, b) => b.similarity - a.similarity);
}

/**
 * Fonction utilitaire pour calculer la similarité entre deux profils
 */
function calculateProfileSimilarity(profile1: QuizResponse, profile2: QuizResponse): number {
  let score = 0;
  let factors = 0;

  // Comparaison des préoccupations de santé
  const healthConcerns1 = profile1.healthConcerns || [];
  const healthConcerns2 = profile2.healthConcerns || [];

  if (healthConcerns1.length > 0 && healthConcerns2.length > 0) {
    const commonConcerns = healthConcerns1.filter(item => 
      healthConcerns2.includes(item)
    ).length;

    const unionLength = new Set([...healthConcerns1, ...healthConcerns2]).size;
    score += unionLength > 0 ? commonConcerns / unionLength : 0;
    factors += 1;
  }

  // Comparaison des objectifs
  const goals1 = profile1.goals || [];
  const goals2 = profile2.goals || [];

  if (goals1.length > 0 && goals2.length > 0) {
    const commonGoals = goals1.filter(item => 
      goals2.includes(item)
    ).length;

    const unionLength = new Set([...goals1, ...goals2]).size;
    score += unionLength > 0 ? commonGoals / unionLength : 0;
    factors += 1;
  }

  // Comparaison des préférences alimentaires
  const diet1 = profile1.dietaryPreferences || [];
  const diet2 = profile2.dietaryPreferences || [];

  if (diet1.length > 0 && diet2.length > 0) {
    const commonDiet = diet1.filter(item => 
      diet2.includes(item)
    ).length;

    const unionLength = new Set([...diet1, ...diet2]).size;
    score += unionLength > 0 ? commonDiet / unionLength : 0;
    factors += 1;
  }

  // Similarité d'âge (utilisation d'une fonction gaussienne)
  if (profile1.age && profile2.age) {
    const ageDiff = Math.abs(profile1.age - profile2.age);
    // Plus la différence est petite, plus le score est élevé
    // Une différence de 10 ans donne un score de 0.5
    score += Math.exp(-Math.pow(ageDiff / 10, 2));
    factors += 1;
  }

  // Même genre
  if (profile1.gender && profile2.gender && profile1.gender === profile2.gender) {
    score += 1;
    factors += 1;
  }

  // Calcul du score final
  return factors > 0 ? score / factors : 0;
}

/**
 * Fonction hybride qui combine plusieurs modèles
 */
export function hybridRecommenderModel(
  quizData: QuizResponse,
  learningDatabase: LearningData[]
): { recommendationIds: string[], confidences: number[] } {
  // Obtenir les recommandations du modèle basé sur des règles
  const ruleBasedResults = ruleBasedModel(quizData);

  // Si nous avons suffisamment de données, obtenir également les recommandations du modèle collaboratif
  if (learningDatabase.length >= 10) {
    const collaborativeResults = collaborativeFilteringModel(quizData, learningDatabase);

    // Fusionner les résultats avec une pondération
    // Au début, on fait plus confiance au modèle basé sur des règles
    // À mesure que la base d'apprentissage grandit, on fait plus confiance au modèle collaboratif
    const weight = Math.min(0.8, 0.3 + (learningDatabase.length / 100) * 0.5);

    // Créer un set de toutes les recommandations uniques
    const allRecommendationIds = [
      ...new Set([...ruleBasedResults.recommendationIds, ...collaborativeResults.recommendationIds])
    ];

    // Calculer les scores combinés
    const combinedScores = allRecommendationIds.map(id => {
      const ruleBasedIndex = ruleBasedResults.recommendationIds.indexOf(id);
      const collaborativeIndex = collaborativeResults.recommendationIds.indexOf(id);

      const ruleBasedScore = ruleBasedIndex >= 0 ? ruleBasedResults.confidences[ruleBasedIndex] : 0;
      const collaborativeScore = collaborativeIndex >= 0 ? collaborativeResults.confidences[collaborativeIndex] : 0;

      // Score pondéré
      const combinedScore = (ruleBasedScore * (1 - weight)) + (collaborativeScore * weight);

      return { id, score: combinedScore };
    });

    // Trier et retourner les résultats
    combinedScores.sort((a, b) => b.score - a.score);

    return {
      recommendationIds: combinedScores.map(item => item.id),
      confidences: combinedScores.map(item => item.score)
    };
  }

  // Si pas assez de données, utiliser uniquement le modèle basé sur des règles
  return ruleBasedResults;
}
/**
 * Modèles d'IA pour les recommandations personnalisées
 */

// Types de base pour les modèles
export interface ModelInput {
  [key: string]: any;
}

export interface ModelOutput {
  recommendations: any[];
  explanation: string;
  confidence: number;
}

export interface RecommenderModel {
  name: string;
  description: string;
  version: string;
  predict: (input: ModelInput) => ModelOutput;
  train?: (data: any[]) => boolean;
  evaluate?: (testData: any[]) => {accuracy: number, metrics: any};
}

// Modèle basique basé sur des règles
export const ruleBasedModel: RecommenderModel = {
  name: "Modèle basé sur des règles",
  description: "Applique des règles prédéfinies pour générer des recommandations",
  version: "1.0.0",

  predict: (input: ModelInput): ModelOutput => {
    const { symptoms = [], dietaryRestrictions = {}, healthGoals = [] } = input;

    // Règles simplifiées pour démo
    const recommendations = [];
    let explanation = "";

    // Exemple de règles
    if (symptoms.includes('stress')) {
      recommendations.push({
        id: 'ashwagandha',
        name: 'Ashwagandha BIO',
        priority: 'haute'
      });
    }

    if (symptoms.includes('sleep')) {
      if (dietaryRestrictions.vegan) {
        recommendations.push({
          id: 'valerian_vegan',
          name: 'Valériane BIO (formule végane)',
          priority: 'haute'
        });
      } else {
        recommendations.push({
          id: 'magnesium_complex',
          name: 'Complexe Magnésium-B6',
          priority: 'haute'
        });
      }
    }

    if (symptoms.includes('focus')) {
      if (dietaryRestrictions.vegan) {
        recommendations.push({
          id: 'omega3_algae',
          name: 'Oméga-3 DHA Algues',
          priority: 'moyenne'
        });
      } else {
        recommendations.push({
          id: 'omega3_fish',
          name: 'Oméga-3 EPA/DHA Premium',
          priority: 'moyenne'
        });
      }
    }

    // Génération d'explication basique
    if (recommendations.length > 0) {
      explanation = `Basé sur vos symptômes (${symptoms.join(", ")}), nous recommandons ${recommendations.length} compléments nutritionnels adaptés à vos besoins.`;
    } else {
      explanation = "Aucune recommandation spécifique n'a pu être générée à partir des informations fournies.";
    }

    return {
      recommendations,
      explanation,
      confidence: 0.7 // Confiance fixe
    };
  }
};

// Modèle hybride (règles + poids ajustables)
export const hybridModel: RecommenderModel = {
  name: "Modèle hybride",
  description: "Combine règles expertes et apprentissage par renforcement",
  version: "1.1.0",

  // État interne du modèle
  _weights: {
    stress: 0.8,
    sleep: 0.75,
    energy: 0.7,
    focus: 0.65,
    digestion: 0.6
  },

  predict: (input: ModelInput): ModelOutput => {
    const { symptoms = [], dietaryRestrictions = {}, healthGoals = [], userProfile = {} } = input;

    // Calcul de scores pour les recommandations possibles
    const supplementScores: {[key: string]: number} = {};

    // Appliquer les poids pour chaque symptôme
    symptoms.forEach(symptom => {
      const weight = (this as any)._weights[symptom] || 0.5;

      // Associer des suppléments à chaque symptôme
      switch(symptom) {
        case 'stress':
          supplementScores['ashwagandha'] = (supplementScores['ashwagandha'] || 0) + weight;
          supplementScores['magnesium'] = (supplementScores['magnesium'] || 0) + weight * 0.9;
          supplementScores['rhodiola'] = (supplementScores['rhodiola'] || 0) + weight * 0.8;
          break;

        case 'sleep':
          supplementScores['magnesium'] = (supplementScores['magnesium'] || 0) + weight;
          supplementScores['valerian'] = (supplementScores['valerian'] || 0) + weight * 0.9;
          supplementScores['melatonin'] = (supplementScores['melatonin'] || 0) + weight * 0.8;
          break;

        case 'focus':
          supplementScores['omega3'] = (supplementScores['omega3'] || 0) + weight;
          supplementScores['bacopa'] = (supplementScores['bacopa'] || 0) + weight * 0.9;
          supplementScores['ginkgo'] = (supplementScores['ginkgo'] || 0) + weight * 0.8;
          break;

        case 'energy':
          supplementScores['vitamin_b_complex'] = (supplementScores['vitamin_b_complex'] || 0) + weight;
          supplementScores['iron'] = (supplementScores['iron'] || 0) + weight * 0.9;
          supplementScores['coq10'] = (supplementScores['coq10'] || 0) + weight * 0.8;
          break;

        case 'digestion':
          supplementScores['probiotics'] = (supplementScores['probiotics'] || 0) + weight;
          supplementScores['digestive_enzymes'] = (supplementScores['digestive_enzymes'] || 0) + weight * 0.9;
          supplementScores['fiber_complex'] = (supplementScores['fiber_complex'] || 0) + weight * 0.8;
          break;
      }
    });

    // Adapter aux restrictions alimentaires
    if (dietaryRestrictions.vegan) {
      delete supplementScores['omega3']; // Supprimer formule non-végane
      supplementScores['omega3_vegan'] = Math.max(...Object.values(supplementScores)) * 0.9; // Alternative végane
    }

    // Convertir les scores en recommandations triées
    const recommendations = Object.entries(supplementScores)
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Top 3 recommandations
      .map(item => {
        // Conversion des IDs en noms lisibles
        const nameMap: {[key: string]: string} = {
          'ashwagandha': 'Ashwagandha BIO',
          'magnesium': 'Bisglycinate de Magnésium',
          'rhodiola': 'Rhodiola Rosea',
          'valerian': 'Valériane BIO',
          'melatonin': 'Mélatonine Naturelle',
          'omega3': 'Oméga-3 EPA/DHA Premium',
          'omega3_vegan': 'Oméga-3 DHA Algues',
          'bacopa': 'Bacopa Monnieri',
          'ginkgo': 'Ginkgo Biloba',
          'vitamin_b_complex': 'Complexe Vitamines B',
          'iron': 'Fer Bisglycinate',
          'coq10': 'CoQ10 Ubiquinol',
          'probiotics': 'Complexe Probiotique Digestif',
          'digestive_enzymes': 'Enzymes Digestives',
          'fiber_complex': 'Complexe de Fibres Solubles'
        };

        // Calcul de la priorité basée sur le score
        let priority = 'basse';
        if (item.score > 0.7) priority = 'haute';
        else if (item.score > 0.5) priority = 'moyenne';

        return {
          id: item.id,
          name: nameMap[item.id] || item.id,
          score: item.score.toFixed(2),
          priority
        
(Content truncated due to size limit. Use line ranges to read in chunks)