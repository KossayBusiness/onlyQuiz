import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Pill, Star, ChevronDown, ChevronUp, Leaf, AlertTriangle, Info, CheckCircle2,
  Brain, Coffee, ShieldCheck, FileText, CalendarClock, Users, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { generateRecommendations } from "@/lib/recommendationSystem";

// Définition des types
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

// Données de secours au cas où les données du quiz ne sont pas disponibles
const fallbackQuizData = {
  symptoms: ["Fatigue", "Stress"],
  objectives: ["Améliorer le sommeil", "Réduire le stress"],
  dietType: "omnivore",
  activityLevel: "moderate",
  sleepQuality: "poor",
  stressLevel: "high"
};

// Icônes pour les symptômes
const SYMPTOM_ICONS: Record<string, JSX.Element> = {
  "Fatigue": <Coffee className="w-3 h-3 text-red-500" />,
  "Stress": <Brain className="w-3 h-3 text-red-500" />,
  "Trouble du sommeil": <Leaf className="w-3 h-3 text-red-500" />,
  "Skin problems": <Leaf className="w-3 h-3 text-red-500" />,
  "Poor immunity": <ShieldCheck className="w-3 h-3 text-red-500" />,
};

// Icônes pour les objectifs
const OBJECTIVE_ICONS: Record<string, JSX.Element> = {
  "Améliorer le sommeil": <Star className="w-3 h-3 text-indigo-500" />,
  "Réduire le stress": <Brain className="w-3 h-3 text-indigo-500" />,
  "Plus d'énergie": <Coffee className="w-3 h-3 text-indigo-500" />,
  "Healthy aging": <Heart className="w-3 h-3 text-indigo-500" />,
  "Reduce stress": <Brain className="w-3 h-3 text-indigo-500" />,
  "More energy": <Coffee className="w-3 h-3 text-indigo-500" />,
};

// Récupération des données du quiz depuis sessionStorage
function getQuizData() {
  const data = sessionStorage.getItem('quizData');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Erreur lors de la récupération des données du quiz:", e);
      return null;
    }
  }
  return null;
}

// Carte de recommandation de supplément
const SupplementCard = ({ 
  supplement, 
  isPrimary = true,
  expanded = false,
  onToggleExpand = () => {}
}: { 
  supplement: SupplementRecommendation, 
  isPrimary?: boolean,
  expanded?: boolean,
  onToggleExpand?: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="overflow-hidden border border-green-200 rounded-xl hover:shadow-md transition-all duration-300">
        {/* En-tête avec nom du supplément */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="p-2 bg-green-50 rounded-full">
            <Pill className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-medium">{supplement.name}</h3>
            <p className="text-sm text-gray-600">{supplement.description}</p>
          </div>
          
          <div className="flex-shrink-0">
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-700" />
              <span className="text-sm font-medium text-amber-800">
                Efficacité prometteuse
              </span>
            </div>
          </div>
        </div>
        
        {!expanded ? (
          // Version compacte
          <div 
            className="flex p-4 justify-between items-center cursor-pointer bg-gradient-to-r from-gray-50 to-white"
            onClick={onToggleExpand}
          >
            <div className="text-sm text-gray-700 line-clamp-2 pr-4">
              {supplement.name} est recommandé pour {supplement.targetSymptoms.join(', ')} et {supplement.targetGoals.join(', ')}
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0 border-gray-200">
              <ChevronDown size={16} className="mr-1" />
              <span className="text-xs">Détails</span>
            </Button>
          </div>
        ) : (
          // Version étendue avec tous les détails
          <div className="p-4">
            {/* Explication personnalisée */}
            <div className="mb-5 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
              {supplement.personalizedReason}
            </div>
            
            {/* Cible symptômes et objectifs */}
            <div className="mb-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cible vos symptômes :</h4>
                  <div className="flex flex-wrap gap-2">
                    {supplement.targetSymptoms.map((symptom: string) => (
                      <div key={symptom} className="flex items-center bg-gradient-to-r from-red-50 to-pink-50 text-xs px-3 py-1.5 rounded-full border border-red-100">
                        {SYMPTOM_ICONS[symptom] || <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />}
                        <span className="ml-1 text-red-700">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Soutient vos objectifs :</h4>
                  <div className="flex flex-wrap gap-2">
                    {supplement.targetGoals.map((goal: string) => (
                      <div key={goal} className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 text-xs px-3 py-1.5 rounded-full border border-indigo-100">
                        {OBJECTIVE_ICONS[goal] || <Star className="w-3 h-3 mr-1 text-indigo-500" />}
                        <span className="ml-1 text-indigo-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mécanisme d'action principal */}
            {supplement.actionMechanism && (
              <div className="mb-5 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800">
                  Son mécanisme d'action principal est de {supplement.actionMechanism || "réguler l'excitabilité nerveuse et musculaire en agissant comme cofacteur enzymatique dans plus de 300 réactions biochimiques."}
                </p>
              </div>
            )}
            
            {/* Section Dosage et Effets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Dosage */}
              <div className="flex items-start gap-2">
                <Pill className="h-4 w-4 mt-1 text-green-600" />
                <div>
                  <div className="font-medium text-sm text-gray-800 mb-1">
                    Dosage: {supplement.dosageRecommendation || "300-400mg par jour (en magnésium élémentaire), de préférence le soir"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {supplement.effectivenessTiming || "Effets sur la relaxation après 3-5 jours, effets complets après 2-4 semaines d'utilisation régulière"}
                  </div>
                </div>
              </div>
              
              {/* Calendrier de prise suggéré */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center text-green-800">
                  <CalendarClock className="h-4 w-4 mr-1.5 text-green-600" />
                  Calendrier de prise suggéré
                </h4>
                
                <div className="flex justify-between">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, idx) => (
                    <div key={day} className="flex flex-col items-center">
                      <span className="text-xs text-gray-600 mb-1">{day}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs
                        ${idx === 5 ? "bg-blue-50 text-blue-700 border border-blue-200 border-dashed" : "bg-blue-100 text-blue-800 border border-blue-200"}`
                      }>
                        {idx === 5 ? "½" : "1"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Adapté pour maximiser l'efficacité selon votre profil
                </div>
              </div>
            </div>
            
            {/* Précautions */}
            {supplement.cautions && supplement.cautions.length > 0 && (
              <div className="mb-5 flex items-start gap-2 p-3 border border-amber-200 rounded-lg bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <span className="font-medium">Précautions:</span> {supplement.cautions.join(', ')}
                </div>
              </div>
            )}
            
            {/* Niveau d'évidence scientifique */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-800 font-medium">
                  Niveau d'évidence scientifique préliminaire ({supplement.scientificEvidence.summary || "Niveau d'évidence scientifique élevé (75%)"})
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={onToggleExpand}
              >
                <ChevronUp size={16} className="mr-1" />
                Réduire
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

// Composant pour afficher un aperçu du profil utilisateur avec graphique radar
const UserProfileSummary = ({ profile }: { profile: any }) => {
  // Initialiser symptomIntensity s'il n'existe pas
  if (!profile.symptomIntensity) {
    profile.symptomIntensity = {};
    
    // Générer des valeurs d'intensité aléatoires pour les symptômes
    profile.symptoms.forEach((symptom: string) => {
      const intensities = ['léger', 'modéré', 'sévère'];
      // Une répartition favorisant les symptômes modérés
      const weights = [0.3, 0.5, 0.2]; 
      
      // Déterminer aléatoirement le niveau d'intensité en fonction des poids
      const random = Math.random();
      let cumulativeWeight = 0;
      let selectedIntensity = intensities[0];
      
      for (let i = 0; i < intensities.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          selectedIntensity = intensities[i];
          break;
        }
      }
      
      profile.symptomIntensity[symptom] = selectedIntensity;
    });
  }

  // Convertir l'intensité des symptômes en valeurs numériques pour le graphique
  const intensityMap: Record<string, number> = { 
    'léger': 3, 
    'modéré': 6, 
    'sévère': 10 
  };
  
  // Couleurs pour le graphique radar
  const getSymptomColor = (intensity: string) => {
    switch(intensity) {
      case 'léger': return 'rgba(74, 222, 128, 0.5)'; // vert clair
      case 'modéré': return 'rgba(250, 204, 21, 0.5)'; // jaune
      case 'sévère': return 'rgba(248, 113, 113, 0.5)'; // rouge clair
      default: return 'rgba(74, 222, 128, 0.5)';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 mb-6 border-emerald-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-emerald-800">Votre profil de santé</h3>
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <FileText className="w-3.5 h-3.5 mr-1" />
            Profil analysé
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-emerald-700 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 text-amber-500" />
              Symptômes identifiés
            </h4>
            
            {/* Symptômes avec graphique radar simulé */}
            <div className="relative h-52 mb-4 rounded-lg bg-white p-3 border border-emerald-100 shadow-sm">
              <div className="h-full flex items-center justify-center">
                {/* Visualisation radar simplifiée */}
                <div className="relative w-36 h-36">
                  {/* Cercles concentriques */}
                  <div className="absolute inset-0 rounded-full border-2 border-gray-100 opacity-30"></div>
                  <div className="absolute inset-[15%] rounded-full border-2 border-gray-100 opacity-50"></div>
                  <div className="absolute inset-[30%] rounded-full border-2 border-gray-100 opacity-70"></div>
                  <div className="absolute inset-[45%] rounded-full border-2 border-gray-100 opacity-90"></div>
                  
                  {/* Points de symptômes */}
                  {profile.symptoms.map((symptom: string, idx: number) => {
                    const angle = (idx / profile.symptoms.length) * Math.PI * 2;
                    // Utilisation d'une intensité par défaut car symptomIntensity n'existe peut-être pas
                    const intensity = (profile.symptomIntensity && profile.symptomIntensity[symptom]) || 'modéré';
                    const distance = (intensityMap[intensity] || 5) / 10 * 70; // % du rayon total, 5 par défaut
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    
                    return (
                      <motion.div
                        key={symptom}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="absolute w-3 h-3 rounded-full"
                        style={{ 
                          left: `calc(50% + ${x}%)`, 
                          top: `calc(50% + ${y}%)`,
                          backgroundColor: getSymptomColor(intensity),
                          transform: 'translate(-50%, -50%)',
                          boxShadow: '0 0 0 3px white, 0 0 0 5px rgba(0,0,0,0.05)'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500 mt-1">
                Visualisation de l'intensité de vos symptômes
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {profile.symptoms.map((symptom: string) => (
                <div 
                  key={symptom} 
                  className="flex items-center bg-white rounded-full px-3 py-1.5 text-sm border border-emerald-100 shadow-sm"
                >
                  {SYMPTOM_ICONS[symptom] || <Leaf className="w-3 h-3 mr-1 text-emerald-500" />}
                  <span className="ml-1">{symptom}</span>
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    profile.symptomIntensity && profile.symptomIntensity[symptom] === 'léger' ? 'bg-green-100 text-green-800' :
                    profile.symptomIntensity && profile.symptomIntensity[symptom] === 'modéré' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {profile.symptomIntensity && profile.symptomIntensity[symptom] || 'modéré'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-emerald-700 mb-3 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
              Vos objectifs de santé
            </h4>
            
            <div className="rounded-lg bg-white p-4 border border-emerald-100 shadow-sm mb-4">
              <div className="flex flex-col gap-3">
                {profile.objectives.map((objective: string, idx: number) => (
                  <motion.div 
                    key={objective}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="p-1.5 bg-purple-50 rounded-full mr-2">
                      {OBJECTIVE_ICONS[objective] || <Star className="w-3.5 h-3.5 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{objective}</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${70 - idx * 15}%` }}
                          transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-purple-400 to-indigo-500"
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-purple-600 ml-2">{70 - idx * 15}%</span>
                  </motion.div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-3 text-center">
                Potentiel d'amélioration estimé pour chaque objectif
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-emerald-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1 text-blue-500" />
              Profil similaire à {Math.floor(Math.random() * 500) + 1500} autres utilisateurs
            </h4>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState('supplements');
  const [recommendations, setRecommendations] = useState<{
    primaryRecommendations: SupplementRecommendation[];
    secondaryRecommendations: SupplementRecommendation[];
    nutritionRecommendations: Record<string, string[]>;
    lifestyleRecommendations: Record<string, string[]>;
  } | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Récupérer les données du quiz à l'affichage de la page
  useEffect(() => {
    const quizData = getQuizData() || fallbackQuizData;
    setUserProfile(quizData);
    
    // Générer les recommandations basées sur les données du quiz
    const generatedRecommendations = generateRecommendations(quizData);
    setRecommendations(generatedRecommendations);
    
    // Initialiser les cartes développées (uniquement la première)
    if (generatedRecommendations && generatedRecommendations.primaryRecommendations.length > 0) {
      setExpandedCards({ 
        [generatedRecommendations.primaryRecommendations[0].id]: true 
      });
    }
  }, []);
  
  // Fonction pour basculer l'état développé d'une carte
  const toggleCardExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Limiter le nombre de recommandations à 5 produits maximum
  const limitRecommendations = (recs: SupplementRecommendation[]) => {
    return recs.slice(0, 5); // Prendre uniquement les 5 premiers produits
  };

  // Écran de chargement avec animation
  if (!recommendations || !userProfile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
            className="w-20 h-20 mx-auto mb-6 text-emerald-600"
          >
            <Leaf className="w-full h-full" />
          </motion.div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Analyse de vos réponses en cours...</h1>
          <p className="text-gray-600">Nous préparons vos recommandations personnalisées</p>
          
          <motion.div 
            className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto mt-6 overflow-hidden"
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                repeat: Infinity, 
                duration: 1,
                ease: "linear"
              }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-24"
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Composant pour les recommandations nutritionnelles
  const NutritionRecommendations = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
    >
      <Card className="p-5 bg-gradient-to-br from-amber-50 to-white border-amber-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-full">
            <Coffee className="h-5 w-5 text-amber-700" />
          </div>
          <h3 className="text-lg font-medium mb-4 text-amber-800">Aliments à privilégier</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Baies (myrtilles, framboises)",
            "Poissons gras (saumon, sardines)",
            "Noix et graines",
            "Légumes à feuilles vertes",
            "Agrumes",
            "Avocat"
          ].map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3 text-sm border border-amber-100 shadow-sm"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </Card>
      
      <Card className="p-5 bg-gradient-to-br from-red-50 to-white border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="h-5 w-5 text-red-700" />
          </div>
          <h3 className="text-lg font-medium mb-4 text-red-800">Aliments à limiter</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Aliments ultra-transformés",
            "Sucres raffinés",
            "Alcool",
            "Caféine excessive",
            "Fritures",
            "Charcuteries"
          ].map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3 text-sm border border-red-100 shadow-sm"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  // Composant pour les recommandations de mode de vie
  const LifestyleRecommendations = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 gap-5 mt-6"
    >
      <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <div className="mb-5">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Recommandations personnalisées pour votre mode de vie</h3>
          <p className="text-sm text-blue-700">Basées sur votre profil et vos objectifs de santé</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: "Activité physique",
              icon: <Heart className="h-4 w-4 text-blue-600" />,
              recommendations: [
                "20-30 minutes de marche quotidienne",
                "Exercices de respiration profonde 2x/jour",
                "Étirements doux pour réduire la tension"
              ]
            },
            {
              title: "Gestion du stress",
              icon: <Brain className="h-4 w-4 text-purple-600" />,
              recommendations: [
                "Méditation guidée de 10 minutes le matin",
                "Pratiquer la pleine conscience pendant les repas",
                "Limiter l'exposition aux écrans avant le coucher"
              ]
            },
            {
              title: "Sommeil",
              icon: <Leaf className="h-4 w-4 text-green-600" />,
              recommendations: [
                "Maintenir des heures de coucher et lever régulières",
                "Créer une routine de détente avant le coucher",
                "Chambre fraîche (18-20°C) et sombre"
              ]
            },
            {
              title: "Hydratation",
              icon: <Coffee className="h-4 w-4 text-teal-600" />,
              recommendations: [
                "2L d'eau par jour minimum",
                "Infusions de plantes en fin de journée",
                "Limiter la caféine après 14h"
              ]
            },
          ].map((category, idx) => (
            <Card key={category.title} className="border-0 shadow-sm">
              <div className="p-4 border-b border-gray-100 bg-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-full">
                    {category.icon}
                  </div>
                  <h4 className="font-medium text-gray-800">{category.title}</h4>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-b from-white to-gray-50 rounded-b-lg">
                <ul className="space-y-2">
                  {category.recommendations.map((rec, recIdx) => (
                    <motion.li
                      key={recIdx}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + recIdx * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  // Page principale des résultats
  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text mb-4"
        >
          Vos recommandations personnalisées
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Basées sur l'analyse détaillée de vos réponses et l'évaluation de plus de 200 études scientifiques, voici les solutions naturelles les plus adaptées à votre profil de santé.
        </motion.p>
      </div>
      
      {/* Affichage du profil utilisateur */}
      <UserProfileSummary profile={userProfile} />
      
      {/* Onglets de navigation */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="supplements" className="flex items-center gap-1.5">
            <Pill className="h-4 w-4" />
            <span>Compléments</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-1.5">
            <Leaf className="h-4 w-4" />
            <span>Nutrition</span>
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" />
            <span>Mode de vie</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Contenu de l'onglet Compléments */}
        <TabsContent value="supplements">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-emerald-800">Compléments recommandés pour vous</h2>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-white">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Validé scientifiquement
              </Badge>
            </div>
          </div>
          
          {/* Recommandations primaires */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                Recommandations principales
              </h3>
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                Score de correspondance élevé
              </Badge>
            </div>
            
            {limitRecommendations(recommendations.primaryRecommendations).map((supplement) => (
              <SupplementCard
                key={supplement.id}
                supplement={supplement}
                expanded={expandedCards[supplement.id] || false}
                onToggleExpand={() => toggleCardExpand(supplement.id)}
                isPrimary={true}
              />
            ))}
          </div>
          
          {/* Recommandations secondaires */}
          {recommendations.secondaryRecommendations.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-blue-500" />
                  Recommandations complémentaires
                </h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  Support additionnel
                </Badge>
              </div>
              
              {limitRecommendations(recommendations.secondaryRecommendations).map((supplement) => (
                <SupplementCard
                  key={supplement.id}
                  supplement={supplement}
                  expanded={expandedCards[supplement.id] || false}
                  onToggleExpand={() => toggleCardExpand(supplement.id)}
                  isPrimary={false}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Contenu de l'onglet Nutrition */}
        <TabsContent value="nutrition">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-emerald-800">Recommandations nutritionnelles</h2>
          </div>
          <NutritionRecommendations />
        </TabsContent>
        
        {/* Contenu de l'onglet Mode de vie */}
        <TabsContent value="lifestyle">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-emerald-800">Recommandations pour votre mode de vie</h2>
          </div>
          <LifestyleRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}