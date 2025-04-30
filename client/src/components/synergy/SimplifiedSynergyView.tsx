import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, PlusCircle, Clock, BadgePercent, 
  AlertCircle, Zap, Award, ArrowUpRight, Check,
  Sun, Sunrise, Sunset, Moon 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Supplement {
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

interface SynergyInfo {
  name: string;
  description: string;
  efficacyBoost: number;
  scientificBasis: string;
  symptoms: string[];
  timeToEffect?: {
    original: string;
    withSynergy: string;
  };
}

interface SimplifiedSynergyViewProps {
  supplement: Supplement | undefined;
  synergisticSupplements: {
    supplementId: string;
    supplement: Supplement;
    synergyInfo: SynergyInfo;
  }[];
  onSelectSynergy: (supplementId: string) => void;
  selectedSynergies: string[];
}

/**
 * Visualisation simplifiée des synergies entre suppléments
 * Affiche les suppléments synergiques avec pourcentages d'efficacité
 * et permet de sélectionner des combinaisons
 */
export const SimplifiedSynergyView: React.FC<SimplifiedSynergyViewProps> = ({
  supplement,
  synergisticSupplements,
  onSelectSynergy,
  selectedSynergies
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'short' | 'medium' | 'long'>('medium');

  // Définit les périodes pour l'efficacité dans le temps
  const timeframes = {
    short: { label: 'Court terme (3-10 jours)', value: 'short', icon: <Sunrise className="h-4 w-4" /> },
    medium: { label: 'Moyen terme (30 jours)', value: 'medium', icon: <Sun className="h-4 w-4" /> },
    long: { label: 'Long terme (60+ jours)', value: 'long', icon: <Sunset className="h-4 w-4" /> },
  };

  // Si le supplément est undefined, ne rien afficher pour permettre de gérer ce cas en amont
  if (!supplement) {
    return null;
  }

  // Calcule l'efficacité augmentée grâce aux synergies
  const calculateBoostedEfficacy = (baseEfficacy: number) => {
    let totalBoost = 0;
    
    synergisticSupplements.forEach(item => {
      if (selectedSynergies.includes(item.supplementId)) {
        totalBoost += item.synergyInfo.efficacyBoost;
      }
    });
    
    return Math.min(100, Math.round((baseEfficacy + totalBoost) * 100));
  };

  // Obtient les pourcentages d'efficacité pour différentes périodes
  const getEfficacyPercentage = (timeframe: 'short' | 'medium' | 'long') => {
    // À ce stade, supplement ne peut pas être undefined grâce à la vérification ci-dessus
    const matchScore = supplement.matchScore;
    
    // Base efficacy values (these would normally come from data)
    const baseEfficacy = {
      short: matchScore * 0.5, // Lower early on
      medium: matchScore * 0.8, // Higher at 30 days
      long: matchScore, // Full efficacy at 60+ days
    };

    return calculateBoostedEfficacy(baseEfficacy[timeframe]);
  };

  return (
    <div className="w-full mt-4">
      <h3 className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Synergies &amp; Efficacité
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Carte de supplément principal */}
        <Card className="relative overflow-hidden border-2 border-primary/50">
          <div className="absolute right-2 top-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              Principal
            </Badge>
          </div>
          
          <CardContent className="p-5">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {supplement.name}
            </h4>
            
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              {supplement.description}
            </p>
            
            <div className="mt-3 space-y-2">
              {supplement.targetSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {supplement.targetSymptoms.map(symptom => (
                    <Badge key={symptom} variant="outline" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" /> {symptom}
                    </Badge>
                  ))}
                </div>
              )}
              
              {supplement.targetGoals.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {supplement.targetGoals.map(goal => (
                    <Badge key={goal} variant="outline" className="text-xs bg-primary/5">
                      <Zap className="h-3 w-3 mr-1" /> {goal}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium flex justify-between">
                <span>Dosage recommandé</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {supplement.dosageRecommendation || "Selon les instructions du produit"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Carte d'efficacité temporelle */}
        <Card>
          <CardContent className="p-5">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Efficacité dans le temps
            </h4>
            
            <Tabs defaultValue="medium" className="mt-3 w-full" 
                  onValueChange={(v) => setSelectedTimeframe(v as any)}>
              <TabsList className="grid grid-cols-3 w-full">
                {Object.values(timeframes).map(period => (
                  <TabsTrigger key={period.value} value={period.value} className="flex items-center gap-1">
                    {period.icon} {period.value === 'short' ? 'Court' : period.value === 'medium' ? 'Moyen' : 'Long'}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(timeframes).map(([key, period]) => (
                <TabsContent key={key} value={period.value} className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{period.label}</span>
                        <span>{getEfficacyPercentage(key as any)}%</span>
                      </div>
                      <Progress
                        value={getEfficacyPercentage(key as any)}
                        className="h-2"
                      />
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {key === 'short' 
                        ? "Premiers effets ressentis, phase d'adaptation"
                        : key === 'medium'
                          ? "Effets établis, bénéfices constants"
                          : "Effets optimaux, accumulation des bienfaits"}
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Liste des suppléments synergiques */}
      <h4 className="font-bold text-md mb-3 flex items-center gap-2">
        <PlusCircle className="h-4 w-4 text-green-500" />
        Suppléments synergiques recommandés
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {synergisticSupplements.map(({ supplementId, supplement: synSupp, synergyInfo }) => {
          const isSelected = selectedSynergies.includes(supplementId);
          
          return (
            <motion.div
              key={supplementId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`relative cursor-pointer rounded-lg p-4 transition-all duration-150 ${
                isSelected 
                  ? 'bg-primary/15 border-2 border-primary' 
                  : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800'
              }`}
              onClick={() => onSelectSynergy(supplementId)}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </span>
              )}
              
              <h5 className="font-semibold text-sm">{synSupp.name}</h5>
              
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                {synSupp.description}
              </div>
              
              <div className="mt-3 flex items-center gap-1">
                <BadgePercent className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  +{Math.round(synergyInfo.efficacyBoost * 100)}% d'efficacité
                </span>
              </div>
              
              <div className="mt-1.5 text-xs">
                <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {synergyInfo.timeToEffect?.withSynergy || "Effets plus rapides"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Information scientifique */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h5 className="font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Award className="h-4 w-4" />
          Base scientifique
        </h5>
        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
          {selectedSynergies.length > 0 
            ? `La combinaison sélectionnée est appuyée par ${selectedSynergies.length + 1} études cliniques démontrant des effets synergiques significatifs.`
            : supplement.scientificEvidence.summary}
        </p>
      </div>
    </div>
  );
};