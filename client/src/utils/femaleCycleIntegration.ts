/**
 * Module pour l'intégration des données du cycle menstruel
 * dans le système de quiz et de recommandations
 */

import { FemaleSpecificData, UserProfile } from '@/utils/types';
import { calculateCycleAdjustedDosage, determineFemaleLifeCyclePhase } from '@/data/femaleSpecificRules';

/**
 * Calcule la phase approximative du cycle menstruel en fonction de la date
 * des dernières règles et de la durée typique du cycle
 * @param lastPeriodDate Date des dernières règles (format YYYY-MM-DD)
 * @param cycleLength Durée typique du cycle en jours (par défaut 28)
 * @returns La phase du cycle ou undefined si indéterminable
 */
export function calculateCyclePhase(
  lastPeriodDate: string, 
  cycleLength: number = 28
): FemaleSpecificData['cyclePhase'] | undefined {
  if (!lastPeriodDate) return undefined;
  
  // Conversion de la date des dernières règles en objet Date
  const lastPeriod = new Date(lastPeriodDate);
  const today = new Date();
  
  // Calcul du nombre de jours écoulés depuis les dernières règles
  const timeDiff = today.getTime() - lastPeriod.getTime();
  const daysSinceLastPeriod = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  // Si la date est dans le futur ou trop ancienne, retourner undefined
  if (daysSinceLastPeriod < 0 || daysSinceLastPeriod > 120) {
    return undefined;
  }
  
  // Calcul de la position dans le cycle (jours depuis le début du cycle actuel)
  const cycleDayPosition = daysSinceLastPeriod % cycleLength;
  
  // Détermination de la phase du cycle
  if (cycleDayPosition < 5) {
    return 'menstrual';  // Phase menstruelle (règles): jours 1-5
  } else if (cycleDayPosition < 14) {
    return 'follicular'; // Phase folliculaire: jours 6-14
  } else if (cycleDayPosition < 17) {
    return 'ovulation';  // Ovulation: jours 14-16
  } else {
    return 'luteal';     // Phase lutéale: jours 17-28
  }
}

/**
 * Génère des questions dynamiques spécifiques au cycle menstruel
 * en fonction des informations déjà collectées
 * @param femaleSpecificData Données spécifiques déjà collectées sur la femme
 * @returns Questions dynamiques à poser
 */
export function generateFemaleCycleQuestions(femaleSpecificData?: Partial<FemaleSpecificData>) {
  const questions = [];
  
  // Si aucune donnée n'est encore disponible, poser la question de base
  if (!femaleSpecificData || Object.keys(femaleSpecificData).length === 0) {
    questions.push({
      id: 'lastPeriodDate',
      question: 'Quand était le premier jour de vos dernières règles?',
      type: 'date',
      description: 'Cette information nous aide à adapter les recommandations à votre cycle hormonal',
      predictivePower: 0.8
    });
    
    questions.push({
      id: 'cycleLength',
      question: 'Quelle est la durée habituelle de votre cycle menstruel?',
      type: 'select',
      options: [
        { value: 21, label: 'Court (21-24 jours)' },
        { value: 28, label: 'Moyen (25-30 jours)' },
        { value: 35, label: 'Long (31-35 jours)' },
        { value: 40, label: 'Très variable' }
      ],
      description: 'Le cycle se compte du premier jour des règles jusqu\'au premier jour des règles suivantes',
      predictivePower: 0.6
    });
  } 
  // Si la date des dernières règles est connue mais pas les symptômes, poser des questions sur les symptômes
  else if (femaleSpecificData.lastPeriodDate && !femaleSpecificData.commonSymptoms) {
    questions.push({
      id: 'hormonal_status',
      question: 'Comment décririez-vous vos cycles menstruels?',
      type: 'select',
      options: [
        { value: 'regular', label: 'Réguliers (prévisibles)' },
        { value: 'irregular', label: 'Irréguliers (imprévisibles)' },
        { value: 'hormonal_therapy', label: 'Je prends un traitement hormonal' },
        { value: 'perimenopause', label: 'En périménopause (cycles changeants)' },
        { value: 'postmenopause', label: 'Plus de cycles (ménopause)' }
      ],
      predictivePower: 0.7
    });
    
    // Phase fertile uniquement
    if (femaleSpecificData.cyclePhase && 
        ['follicular', 'ovulation', 'luteal', 'menstrual'].includes(femaleSpecificData.cyclePhase)) {
      questions.push({
        id: 'hormonal_birth_control',
        question: 'Utilisez-vous une contraception hormonale?',
        type: 'boolean',
        description: 'Pilule, patch, anneau vaginal, DIU hormonal, etc.',
        predictivePower: 0.7
      });
      
      questions.push({
        id: 'pms_severity',
        question: 'Quelle est l\'intensité de vos symptômes prémenstruels?',
        type: 'slider',
        min: 0,
        max: 10,
        defaultValue: 3,
        description: 'Symptômes comme l\'irritabilité, les seins douloureux, les ballonnements, etc.',
        predictivePower: 0.8
      });
    }
  }
  
  return questions;
}

/**
 * Enrichit le profil utilisateur avec des données spécifiques au cycle féminin
 * en calculant les valeurs manquantes si possible
 * @param userProfile Profil utilisateur à enrichir
 * @returns Profil utilisateur enrichi
 */
export function enrichFemaleUserData(userProfile: UserProfile): UserProfile {
  // Ne traiter que les profils féminins
  if (!userProfile.gender || userProfile.gender.toLowerCase() !== 'femme') {
    return userProfile;
  }
  
  // Initialiser les données féminines si elles n'existent pas
  if (!userProfile.femaleSpecificData) {
    userProfile.femaleSpecificData = {};
  }
  
  // Si l'âge est disponible mais pas la phase du cycle
  if (userProfile.age && !userProfile.femaleSpecificData.cyclePhase) {
    // Déterminer la phase de vie reproductive
    const lifePhase = determineFemaleLifeCyclePhase(userProfile.age);
    
    // Si en période fertile mais sans données de cycle, définir une phase par défaut
    if (lifePhase === 'fertile_age') {
      // Pas d'action spécifique, nous ne pouvons pas déduire la phase du cycle sans données
    } 
    // Si en périménopause ou post-ménopause, définir la phase correspondante
    else if (lifePhase === 'perimenopause') {
      userProfile.femaleSpecificData.cyclePhase = 'perimenopause';
    }
    else if (lifePhase === 'postmenopause') {
      userProfile.femaleSpecificData.cyclePhase = 'postmenopause';
    }
  }
  
  // Si la date des dernières règles est disponible et que nous sommes en âge fertile
  if (userProfile.femaleSpecificData.lastPeriodDate) {
    // Calculer la phase du cycle si elle n'est pas déjà définie
    if (!userProfile.femaleSpecificData.cyclePhase) {
      userProfile.femaleSpecificData.cyclePhase = calculateCyclePhase(
        userProfile.femaleSpecificData.lastPeriodDate,
        userProfile.femaleSpecificData.cycleLength
      );
    }
  }
  
  return userProfile;
}

/**
 * Priorise certains symptômes en fonction du cycle menstruel
 * @param symptoms Liste des symptômes actuels et leurs sévérités
 * @param femaleSpecificData Données spécifiques aux femmes
 * @returns Liste des symptômes avec priorités ajustées
 */
export function adjustSymptomPrioritiesByCycle(
  symptoms: Record<string, number>,
  femaleSpecificData?: FemaleSpecificData
): Record<string, number> {
  // Si aucune donnée féminine spécifique n'est disponible, retourner les symptômes inchangés
  if (!femaleSpecificData || !femaleSpecificData.cyclePhase) {
    return { ...symptoms };
  }
  
  const adjustedSymptoms = { ...symptoms };
  
  // Ajustements en fonction de la phase du cycle
  switch (femaleSpecificData.cyclePhase) {
    case 'menstrual':
      // Phase menstruelle: augmenter la priorité des douleurs et de la fatigue
      if (adjustedSymptoms['fatigue']) adjustedSymptoms['fatigue'] = Math.min(10, adjustedSymptoms['fatigue'] + 1);
      if (adjustedSymptoms['cramps'] || adjustedSymptoms['pain']) {
        if (adjustedSymptoms['cramps']) adjustedSymptoms['cramps'] = Math.min(10, adjustedSymptoms['cramps'] + 2);
        if (adjustedSymptoms['pain']) adjustedSymptoms['pain'] = Math.min(10, adjustedSymptoms['pain'] + 1);
      }
      if (adjustedSymptoms['headache']) adjustedSymptoms['headache'] = Math.min(10, adjustedSymptoms['headache'] + 1);
      break;
      
    case 'follicular':
      // Phase folliculaire: généralement moins de symptômes, mais possible anxiété
      if (adjustedSymptoms['anxiety']) adjustedSymptoms['anxiety'] = Math.min(10, adjustedSymptoms['anxiety'] + 0.5);
      break;
      
    case 'ovulation':
      // Phase d'ovulation: possible sensation de ballonnement ou douleur
      if (adjustedSymptoms['bloating']) adjustedSymptoms['bloating'] = Math.min(10, adjustedSymptoms['bloating'] + 1);
      break;
      
    case 'luteal':
      // Phase lutéale (prémenstruelle): augmenter plusieurs symptômes typiques du SPM
      if (adjustedSymptoms['mood_swings']) adjustedSymptoms['mood_swings'] = Math.min(10, adjustedSymptoms['mood_swings'] + 1.5);
      if (adjustedSymptoms['irritability']) adjustedSymptoms['irritability'] = Math.min(10, adjustedSymptoms['irritability'] + 1.5);
      if (adjustedSymptoms['bloating']) adjustedSymptoms['bloating'] = Math.min(10, adjustedSymptoms['bloating'] + 1);
      if (adjustedSymptoms['breast_tenderness']) adjustedSymptoms['breast_tenderness'] = Math.min(10, adjustedSymptoms['breast_tenderness'] + 2);
      if (adjustedSymptoms['fatigue']) adjustedSymptoms['fatigue'] = Math.min(10, adjustedSymptoms['fatigue'] + 0.5);
      if (adjustedSymptoms['food_cravings']) adjustedSymptoms['food_cravings'] = Math.min(10, adjustedSymptoms['food_cravings'] + 1);
      break;
      
    case 'perimenopause':
      // Périménopause: symptômes hormonaux fluctuants
      if (adjustedSymptoms['hot_flashes']) adjustedSymptoms['hot_flashes'] = Math.min(10, adjustedSymptoms['hot_flashes'] + 1);
      if (adjustedSymptoms['mood_swings']) adjustedSymptoms['mood_swings'] = Math.min(10, adjustedSymptoms['mood_swings'] + 1);
      if (adjustedSymptoms['sleep_issues']) adjustedSymptoms['sleep_issues'] = Math.min(10, adjustedSymptoms['sleep_issues'] + 1);
      if (adjustedSymptoms['energy_fluctuations']) adjustedSymptoms['energy_fluctuations'] = Math.min(10, adjustedSymptoms['energy_fluctuations'] + 1);
      break;
      
    case 'postmenopause':
      // Post-ménopause: symptômes liés au vieillissement et à la carence oestrogénique
      if (adjustedSymptoms['joint_pain']) adjustedSymptoms['joint_pain'] = Math.min(10, adjustedSymptoms['joint_pain'] + 0.5);
      if (adjustedSymptoms['hot_flashes']) adjustedSymptoms['hot_flashes'] = Math.min(10, adjustedSymptoms['hot_flashes'] + 0.5);
      if (adjustedSymptoms['sleep_issues']) adjustedSymptoms['sleep_issues'] = Math.min(10, adjustedSymptoms['sleep_issues'] + 0.5);
      if (adjustedSymptoms['vaginal_dryness']) adjustedSymptoms['vaginal_dryness'] = Math.min(10, adjustedSymptoms['vaginal_dryness'] + 1);
      break;
  }
  
  return adjustedSymptoms;
}