/**
 * Composant pour afficher une vue d'ensemble des synergies
 * avec visualisation des bénéfices et données simplifiées
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BookOpenCheck, Battery, FlaskConical, PieChart, BarChart3, 
  FlaskRound, Brain, Heart, Shield, Zap, Activity, BarChart, 
  ChevronRight, ChevronDown, ArrowUpRight
} from 'lucide-react';
import { calculateCompoundSynergyScore } from '@/utils/synergyCalculation';
import { UserProfile } from '@/utils/types';
import { InteractiveSynergyGraph } from './InteractiveSynergyGraph';

interface SynergyOverviewProps {
  supplements: string[];
  supplementNames: Record<string, string>;
  userProfile?: UserProfile;
  targetConditions?: string[];
}

export function SynergyOverview({
  supplements,
  supplementNames,
  userProfile,
  targetConditions
}: SynergyOverviewProps) {
  const [activeView, setActiveView] = useState<'simplified' | 'detailed'>('simplified');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Générer les données de synergies
  const synergyResult = calculateCompoundSynergyScore(
    supplements, 
    userProfile, 
    targetConditions
  );
  
  // Calculer les catégories de synergies
  const synergyCategories = [
    {
      id: 'absorption',
      name: 'Amélioration de l\'absorption',
      icon: <FlaskConical className="text-orange-500" />,
      score: 0.3,
      description: 'Ces synergies augmentent la biodisponibilité et l\'absorption des nutriments actifs.',
      pairs: synergyResult.synergyPairs.slice(0, 3)
    },
    {
      id: 'antiox',
      name: 'Synergie antioxydante',
      icon: <Shield className="text-blue-500" />,
      score: 0.5,
      description: 'Amplification des défenses contre le stress oxydatif par effet synergique.',
      pairs: synergyResult.synergyPairs.slice(1, 3)
    },
    {
      id: 'neuro',
      name: 'Support neurologique',
      icon: <Brain className="text-purple-500" />,
      score: 0.6,
      description: 'Synergies visant à améliorer la fonction et la protection cognitive.',
      pairs: synergyResult.synergyPairs.filter((_, i) => i % 2 === 0).slice(0, 2)
    },
    {
      id: 'energy',
      name: 'Production d\'énergie',
      icon: <Zap className="text-amber-500" />,
      score: 0.4,
      description: 'Synergies optimisant la production d\'énergie cellulaire et métabolique.',
      pairs: synergyResult.synergyPairs.slice(0, 1)
    },
    {
      id: 'circadian',
      name: 'Régulation circadienne',
      icon: <Activity className="text-indigo-500" />,
      score: 0.25,
      description: 'Synergies améliorant la qualité du sommeil et le rythme circadien.',
      pairs: synergyResult.synergyPairs.slice(0, 2)
    }
  ];
  
  // Gérer l'expansion des catégories
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Mode simplifié avec visualisation des catégories
  const renderSimplifiedView = () => (
    <div className={isMobile ? "p-3" : "p-6"}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-indigo-800">Vue d'ensemble des synergies</h3>
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            +{Math.round((synergyResult.effectivenessMultiplier - 1) * 100)}% d'efficacité
          </Badge>
        </div>
        
        <p className={`text-gray-600 ${isMobile ? "text-sm" : ""}`}>
          L'analyse a identifié {synergyResult.synergyPairs.length} interactions synergiques entre vos suppléments recommandés, 
          augmentant leur efficacité globale de {Math.round((synergyResult.effectivenessMultiplier - 1) * 100)}%.
        </p>
      </div>
      
      <div className="space-y-4">
        {synergyCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border border-gray-100">
              <div 
                className="flex items-center p-4 cursor-pointer"
                onClick={() => toggleCategoryExpansion(category.id)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                  ${category.score > 0.5 ? 'bg-indigo-100' : 'bg-gray-100'}`}
                >
                  {category.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">{category.name}</h4>
                    <Badge className={
                      category.score > 0.5 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-gray-100 text-gray-700'
                    }>
                      {Math.round(category.score * 100)}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mt-1">
                    <Progress 
                      value={category.score * 100} 
                      className="h-1.5 flex-1" 
                    />
                    {expandedCategories[category.id] 
                      ? <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                      : <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
                    }
                  </div>
                </div>
              </div>
              
              {expandedCategories[category.id] && (
                <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  
                  {category.pairs.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Exemples de synergies
                      </h5>
                      
                      {category.pairs.map((pair, i) => {
                        const [supp1, supp2] = pair.pair;
                        return (
                          <div key={i} className="bg-gray-50 p-2 rounded-md flex items-center text-sm">
                            <ArrowUpRight className="h-3.5 w-3.5 text-indigo-500 mr-2" />
                            <span className="text-gray-800">
                              {supplementNames[supp1] || supp1} + {supplementNames[supp2] || supp2}
                            </span>
                            <Badge className="ml-auto bg-indigo-50 text-indigo-700 text-xs">
                              +{Math.round((pair.effect - 1) * 100)}%
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
  
  // Mode détaillé avec graphique interactif
  const renderDetailedView = () => (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-indigo-800 mb-2">Analyse approfondie des synergies</h3>
        <p className="text-gray-600">
          Visualisation interactive complète des relations synergiques entre vos suppléments recommandés.
        </p>
      </div>
      
      <InteractiveSynergyGraph 
        supplements={supplements}
        supplementNames={supplementNames}
        synergyData={synergyResult}
      />
    </div>
  );
  
  // En-tête avec sélecteur de vue
  const renderHeader = () => (
    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-100 rounded-full mr-2">
            <PieChart className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-indigo-800">Synergies entre suppléments</h3>
            <p className="text-xs text-indigo-600">
              {synergyResult.synergyPairs.length} interactions bénéfiques identifiées
            </p>
          </div>
        </div>
        
        {!isMobile && (
          <Tabs 
            defaultValue="simplified" 
            value={activeView}
            className="h-9"
            onValueChange={(value) => setActiveView(value as 'simplified' | 'detailed')}
          >
            <TabsList className="bg-indigo-100 border border-indigo-200 p-1 h-8">
              <TabsTrigger 
                value="simplified" 
                className="text-xs h-6 px-3 data-[state=active]:bg-white"
              >
                Vue simplifiée
              </TabsTrigger>
              <TabsTrigger 
                value="detailed" 
                className="text-xs h-6 px-3 data-[state=active]:bg-white"
              >
                Vue interactive
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
    </div>
  );
  
  return (
    <Card className="border border-indigo-100 overflow-hidden">
      {renderHeader()}
      
      {isMobile ? (
        renderSimplifiedView()
      ) : (
        <div>
          {activeView === 'simplified' ? renderSimplifiedView() : renderDetailedView()}
        </div>
      )}
    </Card>
  );
}