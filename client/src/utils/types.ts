/**
 * Définitions des types partagés pour le système de recommandation
 * et les composants d'interface utilisateur
 */

// Enums pour les sévérités et types d'interactions
export enum ContraindicationSeverity {
  ABSOLUTE = "absolute",
  RELATIVE = "relative",
  MINOR = "minor"
}

export enum InteractionSeverity {
  HIGH = "high",
  MODERATE = "moderate",
  LOW = "low"
}

export enum InteractionType {
  POTENTIATE = "potentiate",
  INHIBIT = "inhibit",
  SYNERGISTIC = "synergistic",
  ANTAGONISTIC = "antagonistic"
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}

export enum EvidenceLevel {
  STRONG = "strong",
  MODERATE = "moderate",
  PRELIMINARY = "preliminary",
  THEORETICAL = "theoretical",
  CONFLICTING = "conflicting",
  INSUFFICIENT = "insufficient"
}

export enum SafetyRating {
  VERY_SAFE = "very_safe",
  GENERALLY_SAFE = "generally_safe",
  CAUTION = "caution",
  UNSAFE = "unsafe"
}

export enum SupplementCategory {
  VITAMIN = "vitamin",
  MINERAL = "mineral",
  HERB = "herb",
  AMINO_ACID = "amino_acid",
  PROBIOTIC = "probiotic",
  FATTY_ACID = "fatty_acid",
  ENZYME = "enzyme",
  PROTEIN = "protein",
  PHYTONUTRIENT = "phytonutrient",
  ADAPTOGEN = "adaptogen",
  OTHER = "other"
}

export enum SupplementType {
  CAPSULE = "capsule",
  TABLET = "tablet",
  LIQUID = "liquid",
  POWDER = "powder",
  SOFTGEL = "softgel",
  GUMMY = "gummy",
  TEA = "tea",
  TINCTURE = "tincture",
  OIL = "oil",
  SPRAY = "spray"
}

export enum StudyType {
  RCT = "randomized_controlled_trial",
  META_ANALYSIS = "meta_analysis",
  COHORT = "cohort_study",
  CASE_CONTROL = "case_control_study",
  IN_VITRO = "in_vitro_study",
  ANIMAL = "animal_study",
  OBSERVATIONAL = "observational_study"
}

// Type pour les réponses au quiz
export interface QuizResponse {
  symptoms: string[];
  objectives: string[];
  dietType: string;
  activityLevel: string;
  sleepQuality: string;
  stressLevel: string;
  age?: number;
  gender?: string;
  healthConditions?: string[];
  allergies?: string[];
  medications?: string[];
  [key: string]: any;
}

// Interface pour les données spécifiques aux femmes
export interface FemaleSpecificData {
  cyclePhase?: 'follicular' | 'ovulation' | 'luteal' | 'menstrual' | 'perimenopause' | 'postmenopause';
  cycleLength?: number;
  periodLength?: number;
  lastPeriodDate?: string;
  pregnancyStatus?: 'not_pregnant' | 'pregnant' | 'breastfeeding';
  hormonalBirthControl?: boolean;
  hormonalStatus?: 'regular' | 'irregular' | 'hormonal_therapy';
  commonSymptoms?: {
    pms?: number;
    cramps?: number;
    bloating?: number;
    moodSwings?: number;
    energyFluctuations?: number;
  };
}

// Type pour le profil utilisateur
export interface UserProfile {
  symptoms: string[];
  objectives: string[];
  dietType: string;
  activityLevel: string;
  sleepQuality: string;
  stressLevel: string;
  age?: number;
  gender?: string;
  healthConditions?: string[];
  allergies?: string[];
  medications?: string[];
  neurocognitiveProfile?: {
    attentionScore: number;
    stressLevel: number;
    cognitiveStrength: string;
    learningStyle: string;
  };
  metabolicProfile?: {
    type: string;
    inflammatoryStatus: string;
    gutHealth: string;
    circadianHealth: string;
  };
  femaleSpecificData?: FemaleSpecificData;
  [key: string]: any;
}

// Type pour les priorités des symptômes
export interface SymptomPriority {
  symptom: string;
  priority: number;
  relationToOtherSymptoms?: string[];
  potentialCauses?: string[];
  description?: string;
}

// Type pour les informations sur un supplément
export interface SupplementInfo {
  id: string;
  name: string;
  description: string;
  categories: string[];
  primaryBenefits: string[];
  secondaryBenefits: string[];
  targetSymptoms: string[];
  targetGoals: string[];
  contraindications: {
    condition: string;
    description: string;
    severity: string;
  }[];
  sideEffects: string[];
  typicalDosage: string;
  activeCompounds: string[];
  mechanismOfAction: string;
  
  // Information sur l'absorption
  absorption: {
    bioavailability: number;
    fatSoluble: boolean;
    optimalTiming: string;
  };
  
  // Interactions avec d'autres suppléments ou médicaments
  interactions: {
    enhancedBy: string[];
    inhibitedBy: string[];
    cautions: string[];
    forEach?: (callback: (interaction: any) => void) => void;
    some?: (predicate: (interaction: any) => boolean) => boolean;
  };
  
  // Preuves scientifiques
  scientificEvidence: {
    level: string;
    overallEvidenceLevel: string;
    summary: string;
    references?: string[];
  };
  
  // Dosage standard et spécifique
  standardDosage: {
    amount: string;
    timing: string;
    notes?: string;
  };
  
  specificDosages: {
    women?: {
      amount: string;
      notes?: string;
    };
    men?: {
      amount: string;
      notes?: string;
    };
    elderly?: {
      amount: string;
      notes?: string;
    };
    athletes?: {
      amount: string;
      notes?: string;
    };
  };
  
  // Bénéfices et efficacité
  benefits: {
    description: string;
    efficacyPercentage: number;
    timeFrame: string;
  }[];
  
  // Efficacité spécifique pour chaque symptôme
  efficacyRatings: Record<string, {
    percentage: number;
    timeFrame: string;
    confidenceLevel?: string;
  }>;
  
  // Information sur les alternatives naturelles 
  naturalSources: {
    name: string;
    concentration: string;
    notes?: string;
  }[];
  
  // Information démographique ciblée
  targetDemographics: {
    gender: string;
    ageRange: [number, number];
    conditions: string[];
    lifestyleFactors: string[];
  };
  
  // Information supplémentaire
  additionalInfo: {
    commonNames: string[];
    botanicalFamily?: string;
    countryOfOrigin?: string[];
    sustainablySourced?: boolean;
    allergenInfo?: string[];
  };
  
  // Scores
  naturalnessScore: number;
  sustainabilityScore: number;
  costEffectivenessRatio: number;
}

// Type pour une recommandation de supplément
export interface SupplementRecommendation {
  supplementId: string;
  id?: string; // Pour la compatibilité avec l'existant
  name: string;
  description?: string;
  matchScore: number;
  priorityScore?: number;
  personalizedReason: string;
  targetSymptoms: string[];
  targetGoals: string[];
  confidenceLevel?: number;
  efficacyPercentage?: number;
  timeFrame?: string;
  dosage?: string;
  timing?: string;
  dosageRecommendation?: string;
  effectivenessTiming?: string;
  cautions?: string[];
  safetyNotes?: string[];
  interactionWarnings?: string[];
  actionMechanism?: string;
  naturalAlternatives?: string[];
  demographicFactors?: {
    ageAdjusted: boolean;
    genderAdjusted: boolean;
    medicationAdjusted: boolean;
  };
  scientificEvidence?: {
    level: number;
    summary: string;
  };
}

// Type pour le résultat des recommandations
export interface RecommendationResult {
  userProfile: UserProfile;
  primaryRecommendations: SupplementRecommendation[];
  secondaryRecommendations: SupplementRecommendation[];
  symptomAnalysis: Record<string, any>;
  goalAnalysis: Record<string, any>;
  lifestyleRecommendations: Record<string, string[]>;
  dietaryRecommendations: Record<string, string[]>;
  followUpRecommendations: Record<string, string[]>;
  nutritionRecommendations?: Record<string, string[]>;
  profileAnalysis?: {
    symptomPriorities: Array<{symptom: string, priority: number, description: string}>;
    biomarkers: Array<{name: string, status: string, impact: number}>;
    contextualFactors: Array<{factor: string, impact: string}>;
  };
}