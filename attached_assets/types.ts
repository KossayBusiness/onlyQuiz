/**
 * Types et interfaces pour le système de recommandation de compléments alimentaires
 */

export enum SupplementCategory {
  VITAMIN = "vitamin",
  MINERAL = "mineral",
  HERB = "herb",
  AMINO_ACID = "amino_acid",
  FATTY_ACID = "fatty_acid",
  PROBIOTIC = "probiotic",
  ENZYME = "enzyme",
  MUSHROOM = "mushroom",
  ANTIOXIDANT = "antioxidant",
  PROTEIN = "protein",
  FIBER = "fiber",
  OTHER = "other"
}

export enum SupplementType {
  CAPSULE = "capsule",
  TABLET = "tablet",
  POWDER = "powder",
  LIQUID = "liquid",
  SOFTGEL = "softgel",
  GUMMY = "gummy",
  SPRAY = "spray",
  OIL = "oil",
  TEA = "tea",
  TINCTURE = "tincture"
}

export enum EvidenceLevel {
  STRONG = "strong",
  MODERATE = "moderate",
  PRELIMINARY = "preliminary",
  THEORETICAL = "theoretical",
  ANECDOTAL = "anecdotal",
  INSUFFICIENT = "insufficient",
  MIXED = "mixed"
}

export enum SafetyRating {
  VERY_SAFE = "very_safe",
  GENERALLY_SAFE = "generally_safe",
  CAUTION = "caution",
  UNSAFE = "unsafe",
  UNKNOWN = "unknown"
}

export enum ContraindicationSeverity {
  ABSOLUTE = "absolute",
  RELATIVE = "relative",
  PRECAUTION = "precaution"
}

export enum InteractionType {
  DRUG = "drug",
  SUPPLEMENT = "supplement",
  FOOD = "food",
  CONDITION = "condition"
}

export enum InteractionSeverity {
  SEVERE = "severe",
  MODERATE = "moderate",
  MILD = "mild"
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  ALL = "all"
}

export enum StudyType {
  RCT = "randomized_controlled_trial",
  META_ANALYSIS = "meta_analysis",
  SYSTEMATIC_REVIEW = "systematic_review",
  COHORT = "cohort_study",
  CASE_CONTROL = "case_control",
  OBSERVATIONAL = "observational",
  IN_VITRO = "in_vitro",
  ANIMAL = "animal_study",
  CASE_REPORT = "case_report"
}

export interface Benefit {
  description: string;
  efficacyPercentage: number;
  timeFrame: string;
  evidenceLevel: EvidenceLevel;
}

export interface EfficacyRating {
  percentage: number;
  timeFrame: string;
  confidenceLevel: number;
  notes: string;
  conditionalFactors: {
    factor: string;
    impact: string;
  }[];
}

export interface NaturalSource {
  name: string;
  concentration: string;
  notes: string;
}

export interface Contraindication {
  condition: string;
  severity: ContraindicationSeverity;
  description: string;
}

export interface Interaction {
  interactionType: InteractionType;
  substance: string;
  effect: string;
  severity: InteractionSeverity;
  recommendation: string;
}

export interface Study {
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  studyType: StudyType;
  sampleSize?: number;
  findings: string;
  relevance: string;
}

export interface SupplementInfo {
  id: string;
  name: string;
  scientificName: string;
  category: SupplementCategory;
  type: SupplementType;
  
  shortDescription: string;
  fullDescription: string;
  biochemicalMechanism: string;
  
  benefits: Benefit[];
  primaryBenefits: string[];
  secondaryBenefits: string[];
  
  timeToEffect: {
    initial: string;
    optimal: string;
    duration: string;
  };
  
  efficacyRatings: Record<string, EfficacyRating>;
  
  standardDosage: {
    amount: string;
    frequency: string;
    timing: string;
    notes: string;
  };
  
  specificDosages: Record<string, {
    amount: string;
    notes: string;
  }>;
  
  naturalSources: NaturalSource[];
  
  safetyProfile: {
    generalSafety: SafetyRating;
    pregnancySafety: SafetyRating;
    childrenSafety: SafetyRating;
    elderSafety: SafetyRating;
  };
  
  contraindications: Contraindication[];
  interactions: Interaction[];
  
  targetDemographics: {
    ageRange: [number, number];
    gender: Gender;
    conditions: string[];
    lifestyleFactors: string[];
  };
  
  scientificEvidence: {
    overallEvidenceLevel: EvidenceLevel;
    keyStudies: Study[];
  };
  
  additionalInfo: {
    commonNames: string[];
    history: string;
    sustainabilitySourcing: string;
    certifications: string[];
  };
  
  targetSymptoms: string[];
  targetGoals: string[];
  
  systemMetadata: {
    lastUpdated: string;
    popularity: number;
    controversyLevel: number;
    tags: string[];
  };
}

export interface UserProfile {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  dietType: string;
  sleepQuality: string;
  stressLevel: string;
  existingConditions: string[];
  medications: string[];
  supplements: string[];
  allergies: string[];
  symptoms: Record<string, number>;
  goals: Record<string, number>;
  lifestyleFactors: string[];
  preferences: {
    supplementTypes: string[];
    naturalOnly: boolean;
    budgetConstraint: string;
    tastePreferences: string[];
  };
}

export interface SymptomInfo {
  id: string;
  name: string;
  description: string;
  priorityWeight: number;
  relatedSymptoms: string[];
  potentialCauses: string[];
  recommendedTests: string[];
  targetSupplements: string[];
  lifestyleRecommendations: string[];
}

export interface GoalInfo {
  id: string;
  name: string;
  description: string;
  priorityWeight: number;
  timeFrame: string;
  measurableOutcomes: string[];
  targetSupplements: string[];
  lifestyleRecommendations: string[];
  dietaryRecommendations: string[];
}

export interface SupplementRecommendation {
  supplementId: string;
  name: string;
  priorityScore: number;
  matchScore: number;
  efficacyPercentage: number;
  timeFrame: string;
  dosage: string;
  timing: string;
  personalizedReason: string;
  targetSymptoms: string[];
  targetGoals: string[];
  safetyNotes: string[];
  interactionWarnings: string[];
  naturalAlternatives: string[];
}

export interface RecommendationResult {
  userProfile: UserProfile;
  primaryRecommendations: SupplementRecommendation[];
  secondaryRecommendations: SupplementRecommendation[];
  symptomAnalysis: Record<string, {
    severity: number;
    priority: number;
    relatedSymptoms: string[];
    potentialCauses: string[];
  }>;
  goalAnalysis: Record<string, {
    importance: number;
    priority: number;
    timeFrame: string;
    recommendedApproach: string;
  }>;
  lifestyleRecommendations: string[];
  dietaryRecommendations: string[];
  followUpRecommendations: string[];
}
