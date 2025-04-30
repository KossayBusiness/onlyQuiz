/**
 * Section d'analyse des synergies pour la page de résultats
 * Intègre et présente les différents aspects de l'analyse des synergies
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowUpRight, Lightbulb, Sparkles } from 'lucide-react';
import { SynergyNetwork } from './SynergyNetwork';
import { OptimalIntakePlan } from './OptimalIntakePlan';
import { SynergyOverview } from './SynergyOverview';
import { SynergyInsights } from './SynergyInsights';
import { SYNERGY_DATABASE } from '@/data/supplementSynergies';
import { calculateCompoundSynergyEffect } from '@/utils/compoundSynergyEffects';
import { SupplementRecommendation } from '@/utils/types';

interface SynergyAnalysisSectionProps {
  recommendations: SupplementRecommendation[];
  supplementNames: Record<string, string>;
}

export function SynergyAnalysisSection({
  recommendations,
  supplementNames
}: SynergyAnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  
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
  
  // Extraire les IDs des suppléments recommandés
  const supplementIds = recommendations.map(rec => rec.id);
  
  // Préparer les données pour les synergies
  // 1. Filtrer les paires synergiques pertinentes
  const relevantSynergies = SYNERGY_DATABASE.filter(synergy => {
    const [supp1, supp2] = synergy.pair;
    return supplementIds.includes(supp1) && supplementIds.includes(supp2);
  });
  
  // 2. Calculer l'effet synergique global
  const synergyMultiplier = calculateCompoundSynergyEffect(
    supplementIds,
    relevantSynergies
  );
  
  // 3. Préparer les données pour le composant de réseau
  const synergyNetworkData = {
    synergyPairs: relevantSynergies.map(synergy => ({
      pair: synergy.pair,
      effect: synergy.synergyScore,
      mechanism: synergy.mechanism,
      evidenceLevel: synergy.evidence.level,
      category: synergy.category
    })),
    effectivenessMultiplier: synergyMultiplier,
    keySupplements: supplementIds.slice(0, 3)
  };
  
  // Rendre le titre de la section
  const renderSectionTitle = () => {
    const synergyPercentage = Math.round((synergyMultiplier - 1) * 100);
    
    return (
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-indigo-800">
            Analyse des Synergies
          </h2>
          {synergyPercentage > 0 && (
            <Badge className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              +{synergyPercentage}% d'efficacité
            </Badge>
          )}
        </div>
        
        <p className="text-gray-600">
          {relevantSynergies.length > 0 
            ? `L'analyse a identifié ${relevantSynergies.length} interactions synergiques entre vos suppléments recommandés, augmentant leur efficacité globale de ${synergyPercentage}%.`
            : "Aucune synergie significative n'a été détectée entre les suppléments recommandés."}
        </p>
      </div>
    );
  };
  
  // Si aucune synergie n'est détectée
  if (relevantSynergies.length === 0) {
    return (
      <section className="mt-12">
        {renderSectionTitle()}
        
        <Card className="border border-amber-100">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle className="text-lg text-amber-800">
                Aucune synergie détectée
              </CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              Les suppléments recommandés ne présentent pas d'interactions synergiques significatives entre eux.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-amber-100 mr-3">
                  <Lightbulb className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    Que signifie l'absence de synergies?
                  </h4>
                  <p className="text-gray-600">
                    Cela ne diminue pas l'efficacité individuelle de chaque supplément. Chaque supplément recommandé reste 
                    pertinent pour vos besoins spécifiques, mais ils agissent indépendamment sans potentialisation mutuelle.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-amber-100 mr-3">
                  <ArrowUpRight className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    Comment améliorer les synergies?
                  </h4>
                  <p className="text-gray-600">
                    Si vous souhaitez bénéficier d'effets synergiques, envisagez d'ajouter des suppléments complémentaires 
                    ou d'ajuster votre sélection. Les combinaisons comme vitamine D + magnésium, oméga-3 + curcumine, 
                    ou probiotiques + prébiotiques sont connues pour leurs fortes synergies.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  // Version mobile (simplifié)
  if (isMobile) {
    return (
      <section className="mt-10">
        {renderSectionTitle()}
        
        <div className="space-y-4">
          <SynergyOverview 
            supplements={supplementIds}
            supplementNames={supplementNames}
            targetConditions={recommendations.flatMap(rec => rec.targetSymptoms)}
          />
          
          <SynergyNetwork 
            supplements={supplementIds}
            supplementNames={supplementNames}
            synergyResult={synergyNetworkData}
          />
          
          <OptimalIntakePlan 
            supplements={supplementIds}
            supplementNames={supplementNames}
          />
        </div>
      </section>
    );
  }
  
  // Version desktop (avec onglets)
  return (
    <section className="mt-12">
      {renderSectionTitle()}
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">
            Aperçu des Synergies
          </TabsTrigger>
          <TabsTrigger value="network">
            Réseau d'Interactions
          </TabsTrigger>
          <TabsTrigger value="insights">
            Insights Scientifiques
          </TabsTrigger>
          <TabsTrigger value="plan">
            Plan de Prise Optimal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SynergyOverview 
              supplements={supplementIds}
              supplementNames={supplementNames}
              targetConditions={recommendations.flatMap(rec => rec.targetSymptoms)}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="network" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SynergyNetwork 
              supplements={supplementIds}
              supplementNames={supplementNames}
              synergyResult={synergyNetworkData}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SynergyInsights 
              supplements={supplementIds}
              supplementNames={supplementNames}
              synergyMultiplier={synergyMultiplier}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="plan" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <OptimalIntakePlan 
              supplements={supplementIds}
              supplementNames={supplementNames}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  );
}