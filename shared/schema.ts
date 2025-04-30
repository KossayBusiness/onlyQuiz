/**
 * Schéma partagé pour la base de données nutritionelle et système de recommandation
 */
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { integer, pgTable, serial, text, jsonb, timestamp, boolean, real } from 'drizzle-orm/pg-core';

// =============================================
// Schéma de base de données principal
// =============================================

// Table des utilisateurs
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  age: integer('age'),
  gender: text('gender'),
  weight: integer('weight'),
  height: integer('height'),
  activityLevel: text('activity_level'),
  dietType: text('diet_type'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Table des réponses au questionnaire
export const quizResponses = pgTable('quiz_responses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  symptoms: jsonb('symptoms').$type<Record<string, any>>(),
  goals: jsonb('goals').$type<Record<string, any>>(),
  dietaryPatterns: jsonb('dietary_patterns').$type<Record<string, any>>(),
  lifestyleFactors: jsonb('lifestyle_factors').$type<Record<string, any>>(),
  existingConditions: jsonb('existing_conditions').$type<string[]>(),
  medications: jsonb('medications').$type<string[]>(),
  allergies: jsonb('allergies').$type<string[]>(),
  preferences: jsonb('preferences').$type<Record<string, any>>()
});

// Table des suppléments
export const supplements = pgTable('supplements', {
  id: serial('id').primaryKey(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  scientificName: text('scientific_name'),
  category: text('category').notNull(),
  type: text('type').notNull(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  biochemicalMechanism: text('biochemical_mechanism'),
  dosage: text('standard_dosage'),
  dosageNotes: text('dosage_notes'),
  safetyRating: integer('safety_rating').notNull(),
  benefitsJson: jsonb('benefits').$type<any[]>(),
  contraindicationsJson: jsonb('contraindications').$type<any[]>(),
  interactionsJson: jsonb('interactions').$type<any[]>(),
  targetSymptomsJson: jsonb('target_symptoms').$type<string[]>(),
  targetGoalsJson: jsonb('target_goals').$type<string[]>(),
  efficacyRatingsJson: jsonb('efficacy_ratings').$type<Record<string, any>>(),
  evidenceLevel: text('evidence_level'),
  naturalSourcesJson: jsonb('natural_sources').$type<any[]>(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Table des symptômes
export const symptoms = pgTable('symptoms', {
  id: serial('id').primaryKey(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  priorityWeight: real('priority_weight'),
  relatedSymptomsJson: jsonb('related_symptoms').$type<string[]>(),
  potentialCausesJson: jsonb('potential_causes').$type<string[]>(),
  recommendedTests: jsonb('recommended_tests').$type<string[]>()
});

// Table des objectifs de santé
export const healthGoals = pgTable('health_goals', {
  id: serial('id').primaryKey(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  priorityWeight: real('priority_weight'),
  timeFrame: text('time_frame'),
  measurableOutcomesJson: jsonb('measurable_outcomes').$type<string[]>()
});

// Table des recommendations
export const recommendations = pgTable('recommendations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  quizResponseId: integer('quiz_response_id').references(() => quizResponses.id),
  createdAt: timestamp('created_at').defaultNow(),
  primaryRecommendationsJson: jsonb('primary_recommendations').$type<any[]>(),
  secondaryRecommendationsJson: jsonb('secondary_recommendations').$type<any[]>(),
  symptomAnalysisJson: jsonb('symptom_analysis').$type<Record<string, any>>(),
  goalAnalysisJson: jsonb('goal_analysis').$type<Record<string, any>>(),
  dietaryRecommendationsJson: jsonb('dietary_recommendations').$type<any[]>(),
  lifestyleRecommendationsJson: jsonb('lifestyle_recommendations').$type<any[]>()
});

// =============================================
// Validation schemas
// =============================================

export const userSchema = createInsertSchema(users);
export const quizResponseSchema = createInsertSchema(quizResponses);
export const supplementSchema = createInsertSchema(supplements);
export const symptomSchema = createInsertSchema(symptoms);
export const healthGoalSchema = createInsertSchema(healthGoals);
export const recommendationSchema = createInsertSchema(recommendations);

// =============================================
// Type Definitions
// =============================================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = typeof quizResponses.$inferInsert;

export type Supplement = typeof supplements.$inferSelect;
export type InsertSupplement = typeof supplements.$inferInsert;

export type Symptom = typeof symptoms.$inferSelect;
export type InsertSymptom = typeof symptoms.$inferInsert;

export type HealthGoal = typeof healthGoals.$inferSelect;
export type InsertHealthGoal = typeof healthGoals.$inferInsert;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = typeof recommendations.$inferInsert;

// =============================================
// Modèle pour le système de recommandation
// =============================================

export interface UserProfile {
  id?: number;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  symptoms: Record<string, number>; // symptom_id -> severity (1-10)
  goals: Record<string, number>; // goal_id -> importance (1-10)
  activityLevel?: string;
  dietType?: string;
  existingConditions: string[];
  medications: string[];
  allergies: string[];
  lifestyleFactors: string[];
  preferences: {
    supplementTypes?: string[];
    naturalOnly?: boolean;
    budgetConstraint?: string;
    tastePreferences?: string[];
  };
}

export interface SymptomPriority {
  symptomId: string;
  name: string;
  severity: number;
  priority: number;
  relatedSymptoms?: string[];
  potentialCauses?: string[];
}

export interface GoalPriority {
  goalId: string;
  name: string;
  importance: number;
  priority: number;
  timeFrame?: string;
}

export interface SupplementRecommendation {
  id: string;
  name: string;
  description: string;
  matchScore: number; 
  confidenceLevel: number;
  personalizedReason: string;
  targetSymptoms: string[];
  targetGoals: string[];
  scientificEvidence: {
    level: number; // 0-100
    summary: string;
  };
  cautions?: string[];
  form?: string;
  dosageRecommendation?: string;
  effectivenessTiming?: string;
  compatibleSupplements?: string[];
  actionMechanism?: string;
  category: 'primary' | 'secondary';
}

export interface SupplementInfo {
  id: string;
  name: string;
  description: string;
  targetSymptoms: string[];
  targetGoals: string[];
  scientificEvidence: {
    level: number;
    summary: string;
  };
  cautions?: string[];
  dosage?: string;
  timing?: string;
  mechanism?: string;
  form?: string;
  category?: string;
}

export interface RecommendationResult {
  primaryRecommendations: SupplementRecommendation[];
  secondaryRecommendations: SupplementRecommendation[];
  nutritionRecommendations: Record<string, string[]>;
  lifestyleRecommendations: Record<string, string[]>;
}