/**
 * Cette liste définit les symptômes qui ne nécessitent pas de questions
 * de suivi détaillées, permettant d'accélérer et de simplifier le quiz
 * pour une meilleure expérience utilisateur, notamment sur mobile.
 */

// Symptômes simples qui ne nécessitent pas de questions supplémentaires
export const SKIPPABLE_SYMPTOMS: string[] = [
  'headache',
  'headaches',
  'brittle-hair-nails',
  'cold',
  'cold-sensitivity',
  'cravings',
  'food-cravings',
  'mood-swings',
  'inflammation',
  'joint-pain'
];

// Symptômes qui nécessitent toujours des questions supplémentaires
export const CRITICAL_SYMPTOMS: string[] = [
  'fatigue',
  'low-energy',
  'sleep',
  'stress',
  'anxiety',
  'digestion',
  'digestive-problems',
  'concentration',
  'lack-of-concentration'
];

/**
 * Vérifie si un symptôme spécifique peut être sauté
 * @param symptomId L'identifiant du symptôme
 * @returns true si le symptôme ne nécessite pas de questions détaillées
 */
export function isSkippableSymptom(symptomId: string): boolean {
  return SKIPPABLE_SYMPTOMS.includes(symptomId);
}

/**
 * Détermine si l'étape "Details des symptômes" peut être complètement sautée
 * @param selectedSymptoms Liste des symptômes sélectionnés par l'utilisateur
 * @returns true si tous les symptômes sélectionnés peuvent être sautés
 */
export function canSkipSymptomDetailsStep(selectedSymptoms: string[]): boolean {
  // S'il n'y a pas de symptômes sélectionnés, on peut sauter l'étape
  if (selectedSymptoms.length === 0) return true;
  
  // Si au moins un symptôme critique est sélectionné, on ne peut pas sauter l'étape
  return !selectedSymptoms.some(symptom => CRITICAL_SYMPTOMS.includes(symptom));
}

/**
 * Détermine si des questions avancées sont nécessaires en fonction des symptômes et objectifs
 * @param selectedSymptoms Liste des symptômes sélectionnés
 * @param selectedObjectives Liste des objectifs sélectionnés
 * @returns true si des questions avancées sont nécessaires
 */
export function needsAdvancedQuestions(
  selectedSymptoms: string[],
  selectedObjectives: string[]
): boolean {
  // Combinaisons qui nécessitent des questions avancées
  const criticalCombinations = [
    // Si l'utilisateur a des problèmes de sommeil ET de stress
    selectedSymptoms.includes('sleep') && selectedSymptoms.includes('stress'),
    
    // Si l'utilisateur a des problèmes digestifs ET des problèmes d'énergie
    selectedSymptoms.includes('digestion') && 
    (selectedSymptoms.includes('fatigue') || selectedSymptoms.includes('low-energy')),
    
    // Si l'utilisateur a des problèmes cognitifs ET veut améliorer sa concentration
    selectedSymptoms.includes('concentration') && 
    (selectedObjectives.includes('Mental clarity') || selectedObjectives.includes('Improve concentration')),
    
    // Si l'utilisateur a plus de 3 symptômes différents
    selectedSymptoms.length > 3,
    
    // Si l'utilisateur a des symptômes spécifiques qui nécessitent toujours
    // une investigation approfondie
    selectedSymptoms.includes('anxiety')
  ];
  
  // Si au moins une condition critique est présente, des questions avancées sont nécessaires
  return criticalCombinations.some(condition => condition === true);
}