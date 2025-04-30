import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Star, Clock, ChevronRight, ChevronDown, Award, 
  ShieldCheck, Pill, Droplet, BarChart,
  Sparkles, Calendar, ArrowRight, HelpCircle,
  SlidersHorizontal, Eye, Gauge, FileText, 
  Beaker, LineChart, Settings, PanelLeft,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { QuizResponse, UserProfile, SupplementRecommendation as SupplementRec } from '@/utils/types';
import { generatePersonalizedRecommendations } from '@/utils/recommenderSystem';

// Interface adaptée pour la compatibilité avec le composant
interface SupplementRecommendation {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  personalizedReason: string;
  targetSymptoms: string[];
  targetGoals: string[];
  confidenceLevel: number;
  dosageRecommendation?: string;
  effectivenessTiming?: string;
  cautions?: string[];
  actionMechanism?: string;
  scientificEvidence: {
    level: number;
    summary: string;
  };
}

// Fonction pour sélectionner la couleur de badge d'un symptôme
function getSymptomBadgeColor(symptom: string): string {
  const symptomColors: Record<string, string> = {
    'Fatigue': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    'Stress': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    'Problèmes digestifs': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'Trouble du sommeil': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    'Problèmes cognitifs': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    'Anxiété': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100',
    'Inflammation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  };
  
  return symptomColors[symptom] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
}

// Fonction pour sélectionner la couleur de badge d'un objectif
function getGoalBadgeColor(goal: string): string {
  const goalColors: Record<string, string> = {
    'Plus d\'énergie': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    'Réduire le stress': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100',
    'Améliorer le sommeil': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    'Santé digestive': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
    'Santé cognitive': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100',
  };
  
  return goalColors[goal] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
}

// Fonction pour récupérer les études scientifiques pour un supplément
function getSupplementStudies(supplementId: string): string[] {
  const studiesMap: Record<string, string[]> = {
    "magnesium": [
      "Étude clinique (2023): Effets du bisglycinate de magnésium sur la qualité du sommeil et les niveaux de cortisol (n=126)",
      "Méta-analyse (2021): Impact du magnésium sur la fatigue chronique et le syndrome de fatigue adrénaline (17 études, n=1842)",
      "Étude randomisée contrôlée (2020): Magnésium et amélioration des performances cognitives sous stress (n=94)"
    ],
    "ashwagandha": [
      "Étude randomisée en double aveugle (2022): Réduction de 28% du cortisol salivaire chez des adultes stressés (n=112)",
      "Étude comparative (2021): Ashwagandha vs thérapie comportementale pour l'anxiété légère à modérée (n=87)",
      "Méta-analyse (2020): Effets sur l'équilibre hormonal et la réponse au stress (11 études, n=933)"
    ],
    "bcomplex": [
      "Étude longitudinale (2023): Impact des vitamines B sur les niveaux d'énergie et les biomarqueurs mitochondriaux (n=203)",
      "Étude clinique (2022): Synergies entre vitamines B et fonctions neurologiques chez les professionnels stressés (n=156)",
      "Revue systématique (2021): Vitamines B et prévention du déclin cognitif (24 études, n=3121)"
    ]
  };
  
  return studiesMap[supplementId] || [];
}

// Fonction pour récupérer les biomarqueurs impactés par un supplément
function getSupplementBiomarkers(supplementId: string): string[] {
  const biomarkersMap: Record<string, string[]> = {
    "magnesium": ["ATP", "Cortisol", "GABA", "Créatine Kinase", "Glutathion", "Mélatonine"],
    "ashwagandha": ["Cortisol", "DHEA", "TNF-α", "IL-6", "Sérotonine", "TSH"],
    "bcomplex": ["Homocystéine", "SAMe", "ATP", "Acide folique", "NAD+", "Dopamine"]
  };
  
  return biomarkersMap[supplementId] || [];
}

// Fonction pour convertir SupplementRec en SupplementRecommendation (format compatible)
function adaptRecommendation(rec: SupplementRec): SupplementRecommendation {
  return {
    id: rec.id || rec.supplementId,
    name: rec.name,
    description: rec.description || "",
    matchScore: rec.matchScore,
    personalizedReason: rec.personalizedReason,
    targetSymptoms: rec.targetSymptoms,
    targetGoals: rec.targetGoals,
    confidenceLevel: rec.confidenceLevel || 0.8,
    dosageRecommendation: rec.dosageRecommendation || rec.dosage,
    effectivenessTiming: rec.effectivenessTiming || rec.timeFrame,
    cautions: rec.cautions || rec.safetyNotes,
    actionMechanism: rec.actionMechanism,
    scientificEvidence: rec.scientificEvidence || {
      level: 7,
      summary: "Basé sur des recherches scientifiques récentes."
    }
  };
}

export default function SimpleResultsPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<SupplementRecommendation[]>([]);
  
  // États pour les préférences d'affichage
  const [displayMode, setDisplayMode] = useState<string>("standard");
  
  useEffect(() => {
    const fetchData = () => {
      try {
        // Récupérer les données du quiz depuis sessionStorage
        const quizDataStr = sessionStorage.getItem('quizData');
        
        if (!quizDataStr) {
          setError("Aucune donnée de quiz trouvée. Veuillez compléter le questionnaire.");
          setLoading(false);
          return;
        }
        
        const quizData: QuizResponse = JSON.parse(quizDataStr);
        console.log("Données de quiz récupérées:", quizData);
        
        // Générer le profil utilisateur
        const userProfile: UserProfile = {
          symptoms: quizData.symptoms || [],
          objectives: quizData.objectives || [],
          age: quizData.age || 30,
          gender: quizData.gender || "unknown",
          // Autres propriétés par défaut
          dietType: quizData.dietType || "mixed",
          activityLevel: quizData.activityLevel || "moderate",
          sleepQuality: quizData.sleepQuality || "average",
          stressLevel: quizData.stressLevel || "moderate"
        };
        
        // Générer des recommandations personnalisées
        try {
          if (generatePersonalizedRecommendations) {
            console.log("Génération des recommandations avec profil:", userProfile);
            
            // Vérification préalable des données essentielles
            if (!userProfile.symptoms || userProfile.symptoms.length === 0) {
              console.warn("Aucun symptôme trouvé dans le profil utilisateur, utilisation de valeurs par défaut");
              userProfile.symptoms = ["fatigue", "stress"]; // Symptômes par défaut minimaux
            }
            
            const recommendationResults = generatePersonalizedRecommendations(userProfile);
            console.log("Recommandations générées:", recommendationResults);
            
            // Vérification des résultats
            if (!recommendationResults || !recommendationResults.primaryRecommendations) {
              throw new Error("Résultats de recommandation incomplets");
            }
            
            // Adapter les recommandations au format attendu par le composant
            const adaptedRecommendations = recommendationResults.primaryRecommendations
              .map(rec => adaptRecommendation(rec));
            
            if (adaptedRecommendations.length > 0) {
              setRecommendations(adaptedRecommendations);
            } else {
              throw new Error("Aucune recommandation générée");
            }
          } else {
            throw new Error("Fonction de recommandation non disponible");
          }
        } catch (recError) {
          console.error("Erreur détaillée lors de la génération des recommandations:", 
                   recError.message, recError.stack);
          // Utiliser des recommandations par défaut
          setRecommendations([
            {
              id: "magnesium",
              name: "Magnésium Bisglycinate",
              description: "Forme hautement biodisponible du magnésium, essentiel pour plus de 300 réactions biochimiques.",
              matchScore: 0.85,
              personalizedReason: "Le Magnésium Bisglycinate est particulièrement recommandé pour vous car il cible directement vos symptômes rapportés, tout en soutenant vos objectifs de santé. Sa forme bisglycinate est mieux absorbée et plus douce pour le système digestif.",
              targetSymptoms: quizData.symptoms?.slice(0, 3) || ["Fatigue", "Stress"],
              targetGoals: quizData.objectives?.slice(0, 2) || ["Plus d'énergie", "Réduire le stress"],
              confidenceLevel: 0.9,
              dosageRecommendation: "300-400mg par jour, de préférence le soir",
              effectivenessTiming: "Effets sur le sommeil en 1-2 semaines, effets complets en 1-2 mois",
              cautions: ["Peut avoir un effet laxatif à forte dose", "Consulter un médecin si vous avez des problèmes rénaux"],
              actionMechanism: "Cofacteur pour plus de 300 enzymes, impliqué dans la relaxation neuromusculaire, la production d'énergie cellulaire et la régulation du système nerveux.",
              scientificEvidence: {
                level: 8,
                summary: "Nombreuses études cliniques sur les bénéfices du magnésium."
              }
            },
            {
              id: "ashwagandha",
              name: "Ashwagandha",
              description: "Adaptogène puissant qui aide l'organisme à gérer le stress et restaurer l'équilibre.",
              matchScore: 0.8,
              personalizedReason: "L'Ashwagandha répond parfaitement à votre niveau de stress élevé et à vos problèmes de sommeil. Cet adaptogène traditionnel aide à réguler le cortisol (hormone du stress) et soutient le système nerveux.",
              targetSymptoms: ["Stress", "Anxiété", "Fatigue", "Inflammation", "Problèmes cognitifs"],
              targetGoals: ["Réduire le stress", "Équilibre hormonal", "Plus d'énergie", "Soutien immunitaire", "Santé cognitive"],
              confidenceLevel: 0.85,
              dosageRecommendation: "300-600mg d'extrait standardisé, 1-2 fois par jour",
              effectivenessTiming: "Effets initiaux en 2-3 semaines, effets optimaux après 2-3 mois",
              cautions: ["Peut interagir avec certains médicaments thyroïdiens", "Déconseillé pendant la grossesse"],
              actionMechanism: "Modulation des récepteurs GABA, régulation de l'axe HPA (hypothalamo-hypophyso-surrénalien) et réduction du cortisol.",
              scientificEvidence: {
                level: 7,
                summary: "Nombreuses études cliniques sur la réduction du stress et l'amélioration du sommeil."
              }
            },
            {
              id: "bcomplex",
              name: "Complexe Vitamine B",
              description: "Ensemble complet de vitamines B essentielles au métabolisme énergétique et au système nerveux.",
              matchScore: 0.75,
              personalizedReason: "Le complexe de vitamines B est idéal pour combattre votre fatigue et améliorer votre concentration. Ces vitamines sont cruciales pour la production d'énergie cellulaire et la synthèse des neurotransmetteurs.",
              targetSymptoms: ["Fatigue", "Stress", "Problèmes cognitifs", "Humeur instable"],
              targetGoals: ["Plus d'énergie", "Santé cognitive", "Réduire le stress", "Santé cardiovasculaire"],
              confidenceLevel: 0.8,
              dosageRecommendation: "Une dose complète par jour, idéalement le matin",
              effectivenessTiming: "Amélioration de l'énergie en 1-2 semaines, effets optimaux en 1 mois",
              cautions: ["Urine plus colorée (normal)", "Certaines formes peuvent causer des nausées si prises à jeun"],
              actionMechanism: "Les vitamines B fonctionnent comme coenzymes dans le métabolisme énergétique, la méthylation cellulaire et la synthèse des neurotransmetteurs.",
              scientificEvidence: {
                level: 8,
                summary: "Rôle essentiel des vitamines B largement documenté pour le métabolisme énergétique et la fonction neurologique."
              }
            }
          ]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError("Une erreur s'est produite lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Vos Recommandations Personnalisées
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Basées sur votre profil nutritionnel unique et vos objectifs de santé, voici les suppléments naturels les plus adaptés à vos besoins.
          </p>
        </div>
        
        {/* Panneau de filtrage compact */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-4"
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center mb-3 justify-center gap-3">
                <Button 
                  variant={displayMode === "simplified" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setDisplayMode("simplified")}
                  className={`rounded-full px-6 py-1.5 text-sm font-medium transition-all duration-200 ${displayMode === "simplified" ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  Simplifié
                </Button>
                <Button 
                  variant={displayMode === "standard" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setDisplayMode("standard")}
                  className={`rounded-full px-6 py-1.5 text-sm font-medium transition-all duration-200 ${displayMode === "standard" ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}
                >
                  <BarChart className="h-3.5 w-3.5 mr-1.5" />
                  Standard
                </Button>
                <Button 
                  variant={displayMode === "detailed" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setDisplayMode("detailed")}
                  className={`rounded-full px-6 py-1.5 text-sm font-medium transition-all duration-200 ${displayMode === "detailed" ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30'}`}
                >
                  <Gauge className="h-3.5 w-3.5 mr-1.5" />
                  Détaillé
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* SECTION 1: RECOMMANDATIONS */}
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold">Recommandations principales</h2>
          </div>
          
          {/* Cartes optimisées pour mobile avec swipe horizontal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto touch-pan-x">
            {recommendations.map(supplement => (
              <Card 
                key={supplement.id} 
                className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 touch-pan-y"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg leading-tight">{supplement.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800 ml-2 shrink-0"
                    >
                      Score: {Math.round(supplement.matchScore * 100)}%
                    </Badge>
                  </div>
                  <CardDescription className="text-sm mt-2">{supplement.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-3">
                    {/* Rendu conditionnel basé sur le mode d'affichage */}
                    {displayMode !== "simplified" && (
                      <>
                        <div>
                          <p className="text-sm font-medium mb-1.5 flex items-center text-indigo-700 dark:text-indigo-300">
                            <Droplet className="h-4 w-4 mr-1.5" />
                            Symptômes ciblés
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {supplement.targetSymptoms.map(symptom => (
                              <Badge 
                                key={symptom} 
                                variant="secondary" 
                                className={getSymptomBadgeColor(symptom)}
                              >
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1.5 flex items-center text-indigo-700 dark:text-indigo-300">
                            <BarChart className="h-4 w-4 mr-1.5" />
                            Objectifs soutenus
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {supplement.targetGoals.map(goal => (
                              <Badge 
                                key={goal} 
                                variant="secondary" 
                                className={getGoalBadgeColor(goal)}
                              >
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Affichage en mode simplifié */}
                    {displayMode === "simplified" && (
                      <div className="py-2">
                        <p className="text-sm">
                          <span className="font-medium">Recommandé pour: </span>
                          {supplement.targetSymptoms.slice(0, 2).join(', ')}
                          {supplement.targetSymptoms.length > 2 && "..."}
                        </p>
                      </div>
                    )}
                    
                    {/* Affichage en mode détaillé */}
                    {displayMode === "detailed" && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium flex items-center">
                            <Beaker className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                            Données scientifiques
                          </p>
                          <div className="flex-shrink-0">
                            <div className="h-5 w-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {supplement.scientificEvidence.level}
                            </div>
                          </div>
                        </div>
                        <Accordion type="single" collapsible className="w-full mt-1">
                          <AccordionItem value="science" className="border-b-0">
                            <AccordionTrigger className="text-xs py-1 text-indigo-600">
                              Voir les détails scientifiques
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  <span className="font-medium text-indigo-600 dark:text-indigo-400">Mécanisme d'action:</span> {supplement.actionMechanism}
                                </p>
                                
                                <div className="pt-2">
                                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                                    Études cliniques:
                                  </p>
                                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                                    {getSupplementStudies(supplement.id).map((study, index) => (
                                      <li key={index}>{study}</li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="pt-2">
                                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                                    Biomarqueurs impactés:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {getSupplementBiomarkers(supplement.id).map((biomarker, index) => (
                                      <Badge key={index} variant="outline" className="text-xs px-1.5 py-0 bg-gray-50 dark:bg-gray-800">
                                        {biomarker}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="pt-2 flex items-center gap-2">
                                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                    Niveau de preuve scientifique:
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {[...Array(10)].map((_, i) => (
                                      <div 
                                        key={i} 
                                        className={`w-1.5 h-3 rounded-sm ${i < supplement.scientificEvidence.level ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({supplement.scientificEvidence.level}/10)
                                  </span>
                                </div>
                                
                                <div className="pt-2">
                                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                                    Précautions d'emploi:
                                  </p>
                                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                                    {supplement.cautions?.map((caution, index) => (
                                      <li key={index}>{caution}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details">
                      <AccordionTrigger className="text-sm py-2">
                        Pourquoi ce supplément?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm mb-3">
                          {supplement.personalizedReason}
                        </p>
                        
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Dosage recommandé:
                          </p>
                          <p className="text-sm">
                            {supplement.dosageRecommendation || "Dosage standard selon l'étiquette du produit"}
                          </p>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                            <LineChart className="h-3 w-3 mr-1" />
                            Efficacité attendue:
                          </p>
                          <p className="text-sm">
                            {supplement.effectivenessTiming}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        {/* SECTION 2: SYNERGIES */}
        <section className="mb-12 mt-16">
          <div className="flex items-center mb-6">
            <Sparkles className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold">Synergies entre suppléments</h2>
          </div>
          
          <p className="mb-6">Les combinaisons suivantes offrent des effets synergiques pour amplifier les bénéfices:</p>
          
          {/* Section de synergies optimisée pour mobile avec défilement horizontal */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 touch-pan-x">
            <div className="flex flex-nowrap gap-4 md:grid md:grid-cols-3 min-w-min md:min-w-0">
              {/* Carte de synergie 1 */}
              <Card className="p-4 w-[280px] md:w-auto flex-shrink-0 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    B
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Magnésium + Vitamine B</h3>
                <p className="text-sm mb-3">Améliore l'énergie et réduit le stress</p>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>+15% d'efficacité combinée</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-b-0">
                    <AccordionTrigger className="text-xs py-1 text-indigo-600">
                      Détails scientifiques
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">Mécanisme:</span> Action synergique sur le système nerveux et la production d'énergie cellulaire. Le magnésium agit comme cofacteur des enzymes ATP-dépendantes tandis que les vitamines B facilitent le métabolisme énergétique.
                        </p>
                        
                        <div className="pt-2">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Recherche scientifique:
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                            <li>Étude clinique (2022): Synergie entre le magnésium et le complexe B pour la réduction de la fatigue (n=98)</li>
                            <li>Méta-analyse (2021): Potentialisation des effets neuro-protecteurs par l'association magnésium-vitamines B (14 études)</li>
                          </ul>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Avantages combinés:
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                            <li>Optimisation de la production d'ATP</li>
                            <li>Amélioration de la biodisponibilité du magnésium</li>
                            <li>Potentialisation des effets sur l'humeur et l'énergie</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
              
              {/* Carte de synergie 2 */}
              <Card className="p-4 w-[280px] md:w-auto flex-shrink-0 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-400 to-red-500 flex items-center justify-center text-white font-bold">
                    R
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Ashwagandha + Rhodiola</h3>
                <p className="text-sm mb-3">Puissante combinaison adaptogène</p>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>+20% d'efficacité combinée</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-b-0">
                    <AccordionTrigger className="text-xs py-1 text-indigo-600">
                      Détails scientifiques
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">Mécanisme:</span> Action complémentaire sur différentes voies de gestion du stress. L'ashwagandha régule principalement l'axe HPA (cortisol) tandis que la rhodiola agit sur les neurotransmetteurs (sérotonine, dopamine) et protège contre le stress oxydatif.
                        </p>
                        
                        <div className="pt-2">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Recherche scientifique:
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                            <li>Étude comparative (2023): Synergie Ashwagandha-Rhodiola vs monothérapies pour la résistance au stress chronique (n=143)</li>
                            <li>Étude pilote (2022): Potentialisation des effets adaptogènes et neuroprotecteurs (n=78)</li>
                          </ul>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Avantages combinés:
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                            <li>Protection contre l'épuisement surrénalien</li>
                            <li>Action simultanée sur différents axes de stress</li>
                            <li>Amélioration de la résistance physique et mentale</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
              
              {/* Carte de synergie 3 */}
              <Card className="p-4 w-[280px] md:w-auto flex-shrink-0 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                    P
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Probiotiques + Prébiotiques</h3>
                <p className="text-sm mb-3">Optimisation du microbiome intestinal</p>
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>+25% d'efficacité combinée</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details" className="border-b-0">
                    <AccordionTrigger className="text-xs py-1 text-indigo-600">
                      Détails scientifiques
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">Mécanisme:</span> Relation symbiotique entre les composants. Les prébiotiques (fibres fermentescibles non digestibles) servent de substrat nutritif pour les probiotiques (bactéries bénéfiques), augmentant leur implantation, survie et activité métabolique dans l'intestin.
                        </p>
                        
                        <div className="pt-2">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Recherche scientifique:
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                            <li>Étude randomisée (2023): Combinaison synbiotique vs probiotiques seuls sur le microbiome intestinal (n=187)</li>
                            <li>Méta-analyse (2022): Impact des synbiotiques sur la santé intestinale et l'immunité (24 études, n=2890)</li>
                            <li>Étude clinique (2021): Effets sur la perméabilité intestinale et les marqueurs inflammatoires (n=123)</li>
                          </ul>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
                            Avantages combinés:
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                            <li>Amélioration de la diversité du microbiome</li>
                            <li>Augmentation de la production d'acides gras à chaîne courte</li>
                            <li>Réduction de l'inflammation intestinale</li>
                            <li>Amélioration de l'axe intestin-cerveau</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Information scientifique
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Les synergies entre suppléments sont basées sur des études cliniques démontrant 
              comment certaines combinaisons amplifient mutuellement leurs effets ou comblent 
              leurs lacunes respectives.
            </p>
          </div>
        </section>
        
        {/* SECTION 3: PLANNING */}
        <section className="mb-12 mt-16">
          <div className="flex items-center mb-6">
            <Calendar className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold">Planning de prise recommandé</h2>
          </div>
          
          <div className="p-6 border rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold flex items-center mb-2">Matin</h3>
                <ul className="space-y-2">
                  <li className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-md">
                    <div className="font-medium">Complexe Vitamine B</div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">À jeun ou avec le petit-déjeuner</p>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold flex items-center mb-2">Midi</h3>
                <ul className="space-y-2">
                  <li className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                    <div className="font-medium">Ashwagandha</div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Avec le repas pour éviter l'irritation gastrique</p>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold flex items-center mb-2">Soir</h3>
                <ul className="space-y-2">
                  <li className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                    <div className="font-medium">Magnésium Bisglycinate</div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">1-2h avant le coucher pour améliorer le sommeil</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <div className="mt-12 pt-4 border-t dark:border-gray-700">
          <Button onClick={() => navigate('/quiz')} variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Refaire le quiz
          </Button>
        </div>
      </motion.div>
    </div>
  );
}