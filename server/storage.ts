import { db } from "./db";
import { users, quizResponses, recommendations, supplements, healthGoals, symptoms } from "../shared/schema";
import { eq } from "drizzle-orm";
import { UserProfile } from "../shared/schema";
import type { 
  User, InsertUser, 
  QuizResponse, InsertQuizResponse,
  Recommendation, InsertRecommendation,
  Supplement, InsertSupplement,
  HealthGoal, InsertHealthGoal,
  Symptom, InsertSymptom
} from "../shared/schema";

// Interface for all storage operations
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quiz Responses
  getQuizResponses(userId: number): Promise<QuizResponse[]>;
  getQuizResponse(id: number): Promise<QuizResponse | undefined>;
  createQuizResponse(quizResponse: InsertQuizResponse): Promise<QuizResponse>;
  
  // Recommendations
  getRecommendations(userId: number): Promise<Recommendation[]>;
  getRecommendation(id: number): Promise<Recommendation | undefined>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  
  // Supplements
  getSupplements(): Promise<Supplement[]>;
  getSupplement(id: number): Promise<Supplement | undefined>;
  getSupplementByCode(code: string): Promise<Supplement | undefined>;
  createSupplement(supplement: InsertSupplement): Promise<Supplement>;
  
  // Symptoms
  getSymptoms(): Promise<Symptom[]>;
  getSymptom(id: number): Promise<Symptom | undefined>;
  getSymptomByCode(code: string): Promise<Symptom | undefined>;
  
  // Health Goals
  getHealthGoals(): Promise<HealthGoal[]>;
  getHealthGoal(id: number): Promise<HealthGoal | undefined>;
  getHealthGoalByCode(code: string): Promise<HealthGoal | undefined>;
}

// Database implementation of storage
export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return user;
  }
  
  // Quiz Responses
  async getQuizResponses(userId: number): Promise<QuizResponse[]> {
    return db.select().from(quizResponses).where(eq(quizResponses.userId, userId));
  }
  
  async getQuizResponse(id: number): Promise<QuizResponse | undefined> {
    const [response] = await db.select().from(quizResponses).where(eq(quizResponses.id, id));
    return response;
  }
  
  async createQuizResponse(quizResponse: InsertQuizResponse): Promise<QuizResponse> {
    const [result] = await db.insert(quizResponses).values(quizResponse).returning();
    return result;
  }
  
  // Recommendations
  async getRecommendations(userId: number): Promise<Recommendation[]> {
    return db.select().from(recommendations).where(eq(recommendations.userId, userId));
  }
  
  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    const [recommendation] = await db.select().from(recommendations).where(eq(recommendations.id, id));
    return recommendation;
  }
  
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [result] = await db.insert(recommendations).values(recommendation).returning();
    return result;
  }
  
  // Supplements
  async getSupplements(): Promise<Supplement[]> {
    return db.select().from(supplements);
  }
  
  async getSupplement(id: number): Promise<Supplement | undefined> {
    const [supplement] = await db.select().from(supplements).where(eq(supplements.id, id));
    return supplement;
  }
  
  async getSupplementByCode(code: string): Promise<Supplement | undefined> {
    const [supplement] = await db.select().from(supplements).where(eq(supplements.code, code));
    return supplement;
  }
  
  async createSupplement(supplement: InsertSupplement): Promise<Supplement> {
    const [result] = await db.insert(supplements).values(supplement).returning();
    return result;
  }
  
  // Symptoms
  async getSymptoms(): Promise<Symptom[]> {
    return db.select().from(symptoms);
  }
  
  async getSymptom(id: number): Promise<Symptom | undefined> {
    const [symptom] = await db.select().from(symptoms).where(eq(symptoms.id, id));
    return symptom;
  }
  
  async getSymptomByCode(code: string): Promise<Symptom | undefined> {
    const [symptom] = await db.select().from(symptoms).where(eq(symptoms.code, code));
    return symptom;
  }
  
  // Health Goals
  async getHealthGoals(): Promise<HealthGoal[]> {
    return db.select().from(healthGoals);
  }
  
  async getHealthGoal(id: number): Promise<HealthGoal | undefined> {
    const [goal] = await db.select().from(healthGoals).where(eq(healthGoals.id, id));
    return goal;
  }
  
  async getHealthGoalByCode(code: string): Promise<HealthGoal | undefined> {
    const [goal] = await db.select().from(healthGoals).where(eq(healthGoals.code, code));
    return goal;
  }
}

// Export database storage instance
export const storage = new DatabaseStorage();
