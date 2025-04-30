import { Symptom, Goal } from "@/utils/types";

// Liste des symptômes pour le questionnaire
export const symptoms: Symptom[] = [
  {
    id: "stress",
    name: "stress",
    label: "Stress"
  },
  {
    id: "anxiety",
    name: "anxiety",
    label: "Anxiété"
  },
  {
    id: "insomnia",
    name: "insomnia",
    label: "Problèmes de sommeil"
  },
  {
    id: "fatigue",
    name: "fatigue",
    label: "Fatigue"
  },
  {
    id: "digestive_issues",
    name: "digestive_issues",
    label: "Troubles digestifs"
  },
  {
    id: "headache",
    name: "headache",
    label: "Maux de tête"
  },
  {
    id: "muscle_tension",
    name: "muscle_tension",
    label: "Tensions musculaires"
  },
  {
    id: "joint_pain",
    name: "joint_pain",
    label: "Douleurs articulaires"
  },
  {
    id: "brain_fog",
    name: "brain_fog",
    label: "Brouillard mental"
  },
  {
    id: "mood_swings",
    name: "mood_swings",
    label: "Sautes d'humeur"
  }
];

// Liste des objectifs pour le questionnaire
export const goals: Goal[] = [
  {
    id: "stress_management",
    name: "stress_management",
    label: "Gestion du stress"
  },
  {
    id: "sleep_improvement",
    name: "sleep_improvement",
    label: "Améliorer mon sommeil"
  },
  {
    id: "energy_enhancement",
    name: "energy_enhancement",
    label: "Plus d'énergie"
  },
  {
    id: "immune_boost",
    name: "immune_boost",
    label: "Renforcer mon immunité"
  },
  {
    id: "cognitive_function",
    name: "cognitive_function",
    label: "Améliorer ma concentration"
  },
  {
    id: "mood_stabilization",
    name: "mood_stabilization",
    label: "Stabiliser mon humeur"
  },
  {
    id: "digestive_health",
    name: "digestive_health",
    label: "Améliorer ma digestion"
  },
  {
    id: "hormonal_balance",
    name: "hormonal_balance",
    label: "Équilibrer mes hormones"
  }
];

// Liste des conditions médicales existantes
export const existingConditions = [
  { id: "hypertension", label: "Hypertension" },
  { id: "diabetes", label: "Diabète" },
  { id: "thyroid_disorder", label: "Troubles thyroïdiens" },
  { id: "heart_disease", label: "Maladie cardiaque" },
  { id: "depression", label: "Dépression/Anxiété" },
  { id: "autoimmune", label: "Maladie auto-immune" },
  { id: "digestive_disorder", label: "Trouble digestif" },
  { id: "sleep_disorder", label: "Trouble du sommeil" },
  { id: "arthritis", label: "Arthrite" },
  { id: "chronic_pain", label: "Douleur chronique" },
  { id: "migraines", label: "Migraines" }
];

// Options pour le niveau d'activité physique
export const activityLevels = [
  { value: "sedentary", label: "Sédentaire" },
  { value: "light", label: "Légèrement actif (1-2 jours/semaine)" },
  { value: "moderate", label: "Modérément actif (3-4 jours/semaine)" },
  { value: "very_active", label: "Très actif (5+ jours/semaine)" },
  { value: "athlete", label: "Athlète professionnel" }
];

// Options pour le régime alimentaire
export const dietTypes = [
  { value: "omnivore", label: "Omnivore" },
  { value: "vegetarian", label: "Végétarien" },
  { value: "vegan", label: "Végétalien/Vegan" },
  { value: "pescatarian", label: "Pescétarien" },
  { value: "keto", label: "Cétogène" },
  { value: "paleo", label: "Paléo" },
  { value: "mediterranean", label: "Méditerranéen" }
];

// Options pour les habitudes alimentaires
export const dietaryPatterns = [
  { id: "processed", label: "Consommation régulière d'aliments transformés" },
  { id: "low_variety", label: "Peu de variété dans mon alimentation" },
  { id: "irregular_meals", label: "Repas irréguliers ou sautés" },
  { id: "high_sugar", label: "Consommation élevée de sucre" },
  { id: "high_fat", label: "Consommation élevée de graisses" },
  { id: "low_fiber", label: "Faible consommation de fibres" },
  { id: "high_salt", label: "Consommation élevée de sel" }
];
