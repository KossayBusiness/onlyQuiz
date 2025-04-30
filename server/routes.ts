import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  quizResponseSchema as insertQuizResponseSchema, 
  recommendationSchema as insertRecommendationSchema,
  supplementSchema as insertSupplementSchema 
} from "../shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { generatePersonalizedRecommendations, generateNeuroProfile } from "./recommender";

// Extend Express.Request to include session
declare module 'express-serve-static-core' {
  interface Request {
    session: {
      userId?: number;
      [key: string]: any;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for submitting quiz data and getting recommendations
  app.post('/api/quiz-responses', async (req, res) => {
    try {
      // For demo purposes, assume user_id = 1 if not authenticated
      const userId = req.session?.userId || 1;
      
      // Validate quiz data with Zod
      const quizData = insertQuizResponseSchema.parse({
        userId: userId,
        ...req.body
      });
      
      // Store quiz response in database
      const quizResponse = await storage.createQuizResponse(quizData);
      
      res.status(201).json({ 
        message: 'Réponses du quiz enregistrées avec succès',
        quizResponse
      });
      
    } catch (error) {
      console.error('Error processing quiz data:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Données du quiz invalides',
          details: fromZodError(error).message
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors du traitement des données du quiz'
      });
    }
  });

  // API endpoint for generating recommendations based on quiz responses
  app.post('/api/recommendations', async (req, res) => {
    try {
      // For demo purposes, assume user_id = 1 if not authenticated
      const userId = req.session?.userId || 1;
      
      const { quizResponseId } = req.body;
      
      if (!quizResponseId) {
        return res.status(400).json({ 
          error: 'ID de réponse de quiz manquant'
        });
      }
      
      // Get quiz response from database
      const quizResponse = await storage.getQuizResponse(quizResponseId);
      
      if (!quizResponse) {
        return res.status(404).json({ 
          error: 'Réponses de quiz non trouvées'
        });
      }
      
      // Generate a user profile from quiz responses
      // Note: using any type to bypass the type checking for this demo
      const userProfile = generateNeuroProfile(quizResponse, {
        scrollSpeed: 0.6,
        timeSpent: 0.7,
        clickPatterns: [0.5, 0.6, 0.8],
        hoverTime: {},
        rereadCount: 3
      } as any);
      
      // Generate personalized recommendations
      const recommendationsResult = generatePersonalizedRecommendations(userProfile);
      
      // Store recommendations in database
      const recommendationData = insertRecommendationSchema.parse({
        userId: userId,
        quizResponseId: quizResponseId,
        primaryRecommendationsJson: recommendationsResult.primaryRecommendations,
        secondaryRecommendationsJson: recommendationsResult.secondaryRecommendations,
        symptomAnalysisJson: recommendationsResult.symptomAnalysis,
        goalAnalysisJson: recommendationsResult.goalAnalysis,
        lifestyleRecommendationsJson: recommendationsResult.lifestyleRecommendations,
        dietaryRecommendationsJson: recommendationsResult.dietaryRecommendations
      });
      
      const savedRecommendation = await storage.createRecommendation(recommendationData);
      
      // Return recommendations
      res.status(200).json({ 
        message: 'Recommandations générées avec succès',
        recommendation: savedRecommendation
      });
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Données invalides',
          details: fromZodError(error).message
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de la génération des recommandations'
      });
    }
  });

  // Get all supplements
  app.get('/api/supplements', async (req, res) => {
    try {
      const supplements = await storage.getSupplements();
      res.status(200).json(supplements);
    } catch (error) {
      console.error('Error fetching supplements:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des compléments'
      });
    }
  });

  // Get a specific supplement by ID
  app.get('/api/supplements/:id', async (req, res) => {
    try {
      const supplementId = parseInt(req.params.id);
      
      if (isNaN(supplementId)) {
        return res.status(400).json({ 
          error: 'ID de complément invalide'
        });
      }
      
      const supplement = await storage.getSupplement(supplementId);
      
      if (!supplement) {
        return res.status(404).json({ 
          error: 'Complément non trouvé'
        });
      }
      
      res.status(200).json(supplement);
      
    } catch (error) {
      console.error('Error fetching supplement details:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des détails du complément'
      });
    }
  });

  // Create a new supplement (admin only in a real app)
  app.post('/api/supplements', async (req, res) => {
    try {
      const supplementData = insertSupplementSchema.parse(req.body);
      const supplement = await storage.createSupplement(supplementData);
      
      res.status(201).json({
        message: 'Complément créé avec succès',
        supplement
      });
      
    } catch (error) {
      console.error('Error creating supplement:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Données du complément invalides',
          details: fromZodError(error).message
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de la création du complément'
      });
    }
  });

  // Get user's recommendations history
  app.get('/api/user/recommendations', async (req, res) => {
    try {
      // For demo purposes, assume user_id = 1 if not authenticated
      const userId = req.session?.userId || 1;
      
      const recommendations = await storage.getRecommendations(userId);
      res.status(200).json(recommendations);
      
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des recommandations utilisateur'
      });
    }
  });

  // Get user's quiz responses history
  app.get('/api/user/quiz-responses', async (req, res) => {
    try {
      // For demo purposes, assume user_id = 1 if not authenticated
      const userId = req.session?.userId || 1;
      
      const quizResponses = await storage.getQuizResponses(userId);
      res.status(200).json(quizResponses);
      
    } catch (error) {
      console.error('Error fetching user quiz responses:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des réponses de quiz utilisateur'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
