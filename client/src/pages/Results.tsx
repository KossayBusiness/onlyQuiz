import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Star, Clock, ChevronRight, ChevronDown, 
  Award, ShieldCheck, Pill, Droplet, Zap, BarChart,
  PanelLeft, Layers, SunMoon, BadgePercent, ArrowRight,
  CheckCircle, Sparkles, Leaf, AlarmClock, Calendar,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { SynergyGraph } from '@/components/synergy/SynergyGraph';
import { SimpleSynergyTab } from '@/components/synergy/SimpleSynergyTab';
import synergyService from '@/services/synergyService';

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

interface ScheduleEntry {
  supplementId: string;
  timing: 'morning' | 'afternoon' | 'evening';
  withFood: boolean;
}

// Simule la récupération des données du quiz depuis sessionStorage
function getQuizData() {
  try {
    const quizData = sessionStorage.getItem('quizData');
    return quizData ? JSON.parse(quizData) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération des données du quiz", error);
    return null;
  }
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

// Composant pour visualiser le planning de prise
const SupplementSchedule: React.FC<{
  recommendations: SupplementRecommendation[];
  schedule: ScheduleEntry[];
  onScheduleChange: (newSchedule: ScheduleEntry[]) => void;
}> = ({ recommendations, schedule, onScheduleChange }) => {
  // Fonctions pour gérer le planning
  const addToSchedule = (supplementId: string, timing: 'morning' | 'afternoon' | 'evening', withFood: boolean) => {
    const existingEntry = schedule.find(
      entry => entry.supplementId === supplementId && entry.timing === timing
    );
    
    if (existingEntry) {
      // Mise à jour
      const updatedSchedule = schedule.map(entry => 
        entry.supplementId === supplementId && entry.timing === timing
          ? { ...entry, withFood }
          : entry
      );
      onScheduleChange(updatedSchedule);
    } else {
      // Ajout
      onScheduleChange([...schedule, { supplementId, timing, withFood }]);
    }
  };
  
  const removeFromSchedule = (supplementId: string, timing: 'morning' | 'afternoon' | 'evening') => {
    const updatedSchedule = schedule.filter(
      entry => !(entry.supplementId === supplementId && entry.timing === timing)
    );
    onScheduleChange(updatedSchedule);
  };
  
  // Vérifier si un supplément est planifié pour un moment donné
  const isScheduled = (supplementId: string, timing: 'morning' | 'afternoon' | 'evening') => {
    return schedule.some(entry => entry.supplementId === supplementId && entry.timing === timing);
  };
  
  const timings = [
    { id: 'morning', label: 'Matin', icon: <Sunrise className="h-4 w-4" /> },
    { id: 'afternoon', label: 'Midi', icon: <Sun className="h-4 w-4" /> },
    { id: 'evening', label: 'Soir', icon: <Sunset className="h-4 w-4" /> },
  ];
  
  return (
    <div className="mt-4">
      <h3 className="font-bold text-xl mb-3">Planning de prise recommandé</h3>
      
      <div className="space-y-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2 text-left">Supplément</th>
              {timings.map(timing => (
                <th key={timing.id} className="py-2">
                  <div className="flex items-center justify-center gap-1">
                    {timing.icon} {timing.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recommendations.map(supplement => (
              <tr key={supplement.id} className="border-b dark:border-gray-700">
                <td className="py-3">
                  <div className="font-medium">{supplement.name}</div>
                </td>
                {timings.map(timing => {
                  const scheduled = isScheduled(supplement.id, timing.id as any);
                  return (
                    <td key={`${supplement.id}-${timing.id}`} className="py-2 text-center">
                      {scheduled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30"
                          onClick={() => removeFromSchedule(supplement.id, timing.id as any)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Planifié
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToSchedule(supplement.id, timing.id as any, true)}
                        >
                          Ajouter
                        </Button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant principal
export default function ResultsPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('recommendations');
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [selectedSupplement, setSelectedSupplement] = useState<string | null>(null);
  const [selectedSynergies, setSelectedSynergies] = useState<string[]>([]);
  
  const quizData = getQuizData();
  
  // Obtenir les données de recommandation (normalement depuis l'API)
  const [recommendations, setRecommendations] = useState<SupplementRecommendation[]>([
    {
      id: "magnesium",
      name: "Magnésium Bisglycinate",
      description: "Forme hautement biodisponible du magnésium, essentiel pour plus de 300 réactions biochimiques.",
      matchScore: 0.85,
      personalizedReason: "Le Magnésium Bisglycinate est particulièrement recommandé pour vous car il cible directement vos symptômes de fatigue et stress, tout en soutenant vos objectifs d'énergie et de sommeil. Sa forme bisglycinate est mieux absorbée et plus douce pour le système digestif.",
      targetSymptoms: ["Fatigue", "Stress", "Trouble du sommeil", "Crampes musculaires", "Problèmes digestifs"],
      targetGoals: ["Améliorer le sommeil", "Réduire le stress", "Plus d'énergie", "Soutien musculaire", "Santé digestive"],
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
    },
    {
      id: "probiotics",
      name: "Probiotiques Multi-souches",
      description: "Complexe de bactéries bénéfiques pour restaurer et maintenir l'équilibre du microbiome intestinal.",
      matchScore: 0.7,
      personalizedReason: "Vos problèmes digestifs et votre niveau de stress élevé pourraient être liés à un déséquilibre du microbiome. Ces probiotiques ciblés restaurent la flore intestinale et renforcent l'axe intestin-cerveau.",
      targetSymptoms: ["Problèmes digestifs", "Ballonnements", "Immunité faible", "Fatigue", "Humeur basse"],
      targetGoals: ["Santé digestive", "Soutien immunitaire", "Santé de la peau", "Détoxification", "Santé cognitive"],
      confidenceLevel: 0.75,
      dosageRecommendation: "10-30 milliards UFC par jour, idéalement à jeun ou avec un repas léger",
      effectivenessTiming: "Améliorations digestives en 1-2 semaines, équilibre complet en 2-3 mois",
      cautions: ["Peut causer des ballonnements temporaires les premiers jours", "Conserver au réfrigérateur après ouverture"],
      actionMechanism: "Restauration de la diversité microbienne, renforcement de la barrière intestinale, modulation du système immunitaire et production de neurotransmetteurs.",
      scientificEvidence: {
        level: 7,
        summary: "Nombreuses études sur le rôle du microbiome dans la santé digestive et globale."
      }
    },
    {
      id: "rhodiola",
      name: "Rhodiola Rosea",
      description: "Adaptogène qui améliore la résistance au stress physique et mental, et combat la fatigue.",
      matchScore: 0.65,
      personalizedReason: "La Rhodiola est particulièrement efficace contre votre fatigue chronique et vos problèmes de concentration. Cet adaptogène unique aide à restaurer l'énergie sans stimuler excessivement.",
      targetSymptoms: ["Fatigue", "Stress", "Épuisement", "Dépression légère"],
      targetGoals: ["Plus d'énergie", "Santé cognitive", "Réduire le stress", "Performance physique"],
      confidenceLevel: 0.7,
      dosageRecommendation: "200-400mg d'extrait standardisé (3% de rosavines), 1-2 fois par jour",
      effectivenessTiming: "Effets énergisants en 1-2 semaines, adaptation complète en 1-2 mois",
      cautions: ["Prendre de préférence le matin ou avant midi", "Peut interférer avec certains antidépresseurs"],
      actionMechanism: "Régulation des neurotransmetteurs (sérotonine, dopamine), modulation du cortisol et amélioration de la production d'ATP.",
      scientificEvidence: {
        level: 6,
        summary: "Études cliniques démontrant les effets anti-fatigue et neuroprotecteurs."
      }
    }
  ]);
  
  // Calcule les interactions synergiques entre les suppléments
  const synergyInteractions = synergyService.generateSynergyInteractions(recommendations);
  
  // Filtrer les recommandations en principales et secondaires
  const primaryRecommendations = recommendations.slice(0, 3);
  const secondaryRecommendations = recommendations.slice(3, 5);
  
  // Obtenir le supplément actuellement sélectionné pour la vue des synergies
  // S'assurer qu'un supplément est toujours sélectionné, même si primaryRecommendations est vide
  const currentSupplement = recommendations.find(r => r.id === (selectedSupplement || primaryRecommendations[0]?.id || recommendations[0]?.id));
  
  // Trouver les suppléments synergiques avec le supplément sélectionné
  const synergisticSupplements = currentSupplement 
    ? synergyService.findSynergisticSupplements(currentSupplement, recommendations)
    : [];
  
  // Gérer le changement de sélection de supplément
  const handleSupplementSelect = (supplementId: string) => {
    setSelectedSupplement(supplementId);
    setSelectedSynergies([]);
  };
  
  // Gérer l'ajout/retrait d'un supplément synergique
  const handleSynergySelect = (supplementId: string) => {
    setSelectedSynergies(prev => 
      prev.includes(supplementId)
        ? prev.filter(id => id !== supplementId)
        : [...prev, supplementId]
    );
  };
  
  // Si pas de données de quiz, revenir au quiz
  useEffect(() => {
    if (!quizData && !recommendations.length) {
      navigate('/quiz');
    }
  }, [quizData, navigate]);

  // Définir le supplément sélectionné par défaut au chargement initial
  useEffect(() => {
    if (recommendations.length > 0 && !selectedSupplement) {
      // Définit le premier supplément comme sélectionné par défaut
      setSelectedSupplement(recommendations[0].id);
      console.log("Supplément par défaut défini:", recommendations[0].id);
    }
  }, [recommendations, selectedSupplement]);
  
  // S'assurer qu'un supplément est sélectionné quand on change pour l'onglet synergies
  useEffect(() => {
    if (activeTab === 'synergies' && !selectedSupplement && recommendations.length > 0) {
      setSelectedSupplement(recommendations[0].id);
      console.log("Supplément auto-sélectionné pour l'onglet synergies:", recommendations[0].id);
    }
  }, [activeTab, selectedSupplement, recommendations]);
  
  if (!recommendations.length) {
    return <div className="p-8 text-center">Chargement des recommandations...</div>;
  }
  
  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Vos Recommandations Personnalisées
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Basées sur votre profil nutritionnel unique et vos objectifs de santé, voici les suppléments naturels les plus adaptés à vos besoins.
          </p>
        </div>
        
        <Tabs defaultValue="recommendations" className="space-y-6"
              onValueChange={(value: string) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Recommandations</span>
              <span className="sm:hidden">Recom.</span>
            </TabsTrigger>
            <TabsTrigger value="synergies" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Synergies</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Planning</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-8">
            {/* Recommandations principales */}
            <div>
              <div className="flex items-center mb-4">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                <h2 className="text-xl font-bold">Recommandations Principales</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {primaryRecommendations.map((supplement, index) => (
                  <Card key={supplement.id} className="relative overflow-hidden transform transition-all hover:shadow-lg dark:hover:shadow-slate-800/30">
                    {/* Badge de classement */}
                    <div className="absolute top-2 left-3 z-10">
                      <Badge variant="secondary" className="text-xs font-bold bg-gray-100 border border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                        Top {index + 1}
                      </Badge>
                    </div>
                    
                    {/* Jauge de correspondance */}
                    <div className="absolute top-2 right-3 z-10">
                      <Badge className="bg-primary text-white border-transparent text-xs px-2 py-1">
                        <BadgePercent className="h-3 w-3 mr-1" />
                        {Math.round(supplement.matchScore * 100)}%
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-3 pt-6">
                      <CardTitle className="flex items-start gap-2 font-bold">
                        <Pill className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span>{supplement.name}</span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pb-3 pt-0">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {supplement.description}
                      </p>
                      
                      {/* Symptômes et objectifs ciblés */}
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Symptômes ciblés</h4>
                          <div className="flex flex-wrap gap-1">
                            {supplement.targetSymptoms.slice(0, 3).map(symptom => (
                              <Badge key={symptom} variant="outline" className={`text-xs ${getSymptomBadgeColor(symptom)}`}>
                                {symptom}
                              </Badge>
                            ))}
                            {supplement.targetSymptoms.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{supplement.targetSymptoms.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Objectifs soutenus</h4>
                          <div className="flex flex-wrap gap-1">
                            {supplement.targetGoals.slice(0, 3).map(goal => (
                              <Badge key={goal} variant="outline" className={`text-xs ${getGoalBadgeColor(goal)}`}>
                                {goal}
                              </Badge>
                            ))}
                            {supplement.targetGoals.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{supplement.targetGoals.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-1 flex flex-col space-y-2 items-start">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="details" className="border-t-0">
                          <AccordionTrigger className="text-sm py-2">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="h-4 w-4 text-teal-500" />
                              <span>Détails scientifiques</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
                            <div>
                              <span className="font-medium">Mécanisme d'action:</span> {supplement.actionMechanism}
                            </div>
                            <div>
                              <span className="font-medium">Temps d'efficacité:</span> {supplement.effectivenessTiming}
                            </div>
                            <div>
                              <span className="font-medium">Dosage recommandé:</span> {supplement.dosageRecommendation}
                            </div>
                            {supplement.cautions && supplement.cautions.length > 0 && (
                              <div>
                                <span className="font-medium text-amber-600 dark:text-amber-400">Précautions:</span>
                                <ul className="list-disc list-inside">
                                  {supplement.cautions.map((caution, i) => (
                                    <li key={i}>{caution}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      <div className="w-full mt-2">
                        <Button variant="outline" className="w-full justify-between" onClick={() => {
                          setSelectedSupplement(supplement.id);
                          setActiveTab('synergies');
                        }}>
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4 text-indigo-500" /> 
                            Voir synergies
                          </span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Recommandations secondaires */}
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-5 w-5 text-green-500 mr-2" />
                <h2 className="text-xl font-bold">Recommandations Complémentaires</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secondaryRecommendations.map((supplement) => (
                  <Card key={supplement.id} className="relative overflow-hidden">
                    <div className="absolute top-2 right-3 z-10">
                      <Badge className="bg-primary/70 text-white border-transparent text-xs px-2 py-1">
                        <BadgePercent className="h-3 w-3 mr-1" />
                        {Math.round(supplement.matchScore * 100)}%
                      </Badge>
                    </div>
                    
                    <CardHeader className="pb-3 pt-5">
                      <CardTitle className="flex items-start gap-2">
                        <Pill className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                        <span>{supplement.name}</span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pb-3 pt-0">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {supplement.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {supplement.targetSymptoms.slice(0, 2).map(symptom => (
                          <Badge key={symptom} variant="outline" className={`text-xs ${getSymptomBadgeColor(symptom)}`}>
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-xs text-slate-600 dark:text-slate-300">
                          {supplement.effectivenessTiming}
                        </span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full justify-between" onClick={() => {
                        setSelectedSupplement(supplement.id);
                        setActiveTab('synergies');
                      }}>
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-indigo-500" /> 
                          Voir synergies
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="synergies">
            <SimpleSynergyTab />
          </TabsContent>
          
          <TabsContent value="schedule">
            <SupplementSchedule 
              recommendations={recommendations}
              schedule={schedule}
              onScheduleChange={setSchedule}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 pt-4 border-t dark:border-gray-700">
          <Button onClick={() => navigate('/quiz')} variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            Refaire le quiz
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Composants pour l'horloge solaire (icônes)
const Sunrise: React.FC<{ className?: string }> = ({ className }) => {
  return <SunMoon className={className} />;
};

const Sun: React.FC<{ className?: string }> = ({ className }) => {
  return <SunMoon className={className} />;
};

const Sunset: React.FC<{ className?: string }> = ({ className }) => {
  return <SunMoon className={className} />;
};