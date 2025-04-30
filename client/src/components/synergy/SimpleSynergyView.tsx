import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, ArrowUpRight, Info, Zap, Clock, PieChart, Pill, Brain, Heart, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { SYNERGY_CATEGORY_COLORS, SynergyCategory } from '@/utils/synergyTypes';
import { getSupplement } from '@/data/supplementDatabase';
import { SYNERGY_PAIRS, getStrongestSynergies, getSynergyBetween } from '@/data/supplementSynergies';
import { analyzeCompoundSynergisticEffects } from '@/utils/compoundSynergyEffects';

// Liste des suppléments pour la démonstration
const SAMPLE_SUPPLEMENTS = [
  "magnesium", 
  "vitamin_d3", 
  "zinc", 
  "vitamin_c", 
  "omega3", 
  "quercetin", 
  "nac", 
  "coq10"
];

export const SimpleSynergyView = () => {
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>(["magnesium", "vitamin_d3", "zinc"]);
  const [synergyData, setSynergyData] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Calculer les données de synergie quand les suppléments sélectionnés changent
  useEffect(() => {
    if (selectedSupplements.length < 2) {
      setSynergyData(null);
      return;
    }
    
    try {
      // Analyser les effets synergiques pour les suppléments sélectionnés
      const analysisResult = analyzeCompoundSynergisticEffects(selectedSupplements);
      setSynergyData(analysisResult);
    } catch (error) {
      console.error("Erreur lors de l'analyse des synergies:", error);
      setSynergyData(null);
    }
  }, [selectedSupplements]);

  // Gérer la sélection/désélection d'un supplément
  const toggleSupplement = (supplementId: string) => {
    setSelectedSupplements(prev => {
      if (prev.includes(supplementId)) {
        return prev.filter(id => id !== supplementId);
      } else {
        return [...prev, supplementId];
      }
    });
  };

  // Obtenir les synergies les plus fortes
  const topSynergies = getStrongestSynergies(5);

  return (
    <div className="space-y-8">
      {/* Titre de la section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-emerald-800 flex items-center">
          <Network className="mr-2 h-5 w-5" />
          Analyse des Synergies
        </h2>
        <Badge variant="outline" className="flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200">
          <Zap className="mr-1 h-3.5 w-3.5" />
          Technologie SynergyNet™
        </Badge>
      </div>
      
      {/* Sélection des suppléments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sélectionnez vos suppléments</CardTitle>
          <CardDescription>
            Choisissez au moins 2 suppléments pour analyser leurs interactions synergiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SAMPLE_SUPPLEMENTS.map(id => {
              const supplement = getSupplement(id);
              const isSelected = selectedSupplements.includes(id);
              
              return (
                <motion.div 
                  key={id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSupplement(id)}
                  className={`cursor-pointer rounded-lg p-3 border transition-all ${
                    isSelected 
                      ? 'border-emerald-300 bg-emerald-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                      isSelected ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <span className="font-medium text-sm">{supplement?.name || id}</span>
                  </div>
                  {supplement && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {supplement.description.substring(0, 60)}...
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-sm text-gray-500">
          {selectedSupplements.length} suppléments sélectionnés
        </CardFooter>
      </Card>
      
      {/* Analyse des synergies */}
      {synergyData ? (
        <>
          {/* Aperçu principal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Efficacité synergique globale</CardTitle>
              <CardDescription>
                Analyse des interactions entre vos {selectedSupplements.length} suppléments sélectionnés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Score d'efficacité synergique</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {(synergyData.overallEffectiveness * 100 - 100).toFixed(0)}% d'amélioration
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ 
                        width: `${Math.min((synergyData.overallEffectiveness * 100 - 100) * 2, 100)}%`,
                        background: `linear-gradient(to right, #10B981, #6366F1)`
                      }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Aucune synergie</span>
                  <span>Synergie optimale</span>
                </div>
              </div>
              
              {/* Effets temporels */}
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium flex items-center">
                  <Clock className="mr-1.5 h-4 w-4 text-blue-500" />
                  Évolution de l'efficacité dans le temps
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      phase: "Phase initiale",
                      days: "Jours 1-7",
                      value: synergyData.timeBasedEffects.initialPhase,
                      icon: <ArrowUpRight className="h-3.5 w-3.5" />
                    },
                    {
                      phase: "Phase d'adaptation",
                      days: "Jours 8-21",
                      value: synergyData.timeBasedEffects.adaptationPhase,
                      icon: <Zap className="h-3.5 w-3.5" />
                    },
                    {
                      phase: "Phase stable",
                      days: "Jours 22+",
                      value: synergyData.timeBasedEffects.steadyStatePhase,
                      icon: <Heart className="h-3.5 w-3.5" />
                    }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium">{item.phase}</span>
                        <div className={`p-1 rounded-full ${
                          item.value > 1.1 ? "bg-green-100 text-green-600" : 
                          item.value < 0.9 ? "bg-amber-100 text-amber-600" : 
                          "bg-blue-100 text-blue-600"
                        }`}>
                          {item.icon}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        {(item.value * 100).toFixed(0)}%
                      </div>
                      <div className="text-[10px] text-gray-500">{item.days}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Distribution des effets */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center">
                  <PieChart className="mr-1.5 h-4 w-4 text-purple-500" />
                  Distribution des effets synergiques
                </h4>
                <div className="space-y-2">
                  {Object.entries(synergyData.synergisticEffects).map(([category, value]: [string, any]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{getCategoryLabel(category as SynergyCategory)}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{
                            width: `${value}%`,
                            backgroundColor: SYNERGY_CATEGORY_COLORS[category as SynergyCategory]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Planification optimale de prise */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === 'schedule' ? null : 'schedule')}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Planification optimale
                </span>
                <ArrowUpRight className={`h-4 w-4 transition-transform ${
                  expandedSection === 'schedule' ? 'rotate-45' : ''
                }`} />
              </CardTitle>
              <CardDescription>
                Timing idéal pour maximiser les effets synergiques
              </CardDescription>
            </CardHeader>
            
            {expandedSection === 'schedule' && (
              <CardContent>
                <div className="space-y-6">
                  {/* Matin */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 border-b pb-1">Matin</h4>
                    {synergyData.optimalIntakeSchedule.morning.length > 0 ? (
                      <div className="space-y-2">
                        {synergyData.optimalIntakeSchedule.morning.map((id: string) => {
                          const supplement = getSupplement(id);
                          return (
                            <div key={id} className="flex justify-between text-sm p-2 bg-amber-50 rounded-lg border border-amber-100">
                              <div className="font-medium">{supplement?.name || id}</div>
                              <div className="text-xs text-gray-600 max-w-[60%] text-right">
                                {synergyData.optimalIntakeSchedule.recommendations[id] || "Avec le petit-déjeuner"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Aucun supplément recommandé le matin</div>
                    )}
                  </div>
                  
                  {/* Midi */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 border-b pb-1">Midi</h4>
                    {synergyData.optimalIntakeSchedule.afternoon.length > 0 ? (
                      <div className="space-y-2">
                        {synergyData.optimalIntakeSchedule.afternoon.map((id: string) => {
                          const supplement = getSupplement(id);
                          return (
                            <div key={id} className="flex justify-between text-sm p-2 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="font-medium">{supplement?.name || id}</div>
                              <div className="text-xs text-gray-600 max-w-[60%] text-right">
                                {synergyData.optimalIntakeSchedule.recommendations[id] || "Avec le déjeuner"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Aucun supplément recommandé le midi</div>
                    )}
                  </div>
                  
                  {/* Soir */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 border-b pb-1">Soir</h4>
                    {synergyData.optimalIntakeSchedule.evening.length > 0 ? (
                      <div className="space-y-2">
                        {synergyData.optimalIntakeSchedule.evening.map((id: string) => {
                          const supplement = getSupplement(id);
                          return (
                            <div key={id} className="flex justify-between text-sm p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                              <div className="font-medium">{supplement?.name || id}</div>
                              <div className="text-xs text-gray-600 max-w-[60%] text-right">
                                {synergyData.optimalIntakeSchedule.recommendations[id] || "Avec le dîner"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Aucun supplément recommandé le soir</div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          
          {/* Amplificateurs environnementaux */}
          <Card>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === 'amplifiers' ? null : 'amplifiers')}
            >
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-amber-500" />
                  Amplificateurs environnementaux
                </span>
                <ArrowUpRight className={`h-4 w-4 transition-transform ${
                  expandedSection === 'amplifiers' ? 'rotate-45' : ''
                }`} />
              </CardTitle>
              <CardDescription>
                Facteurs externes qui peuvent renforcer les effets synergiques
              </CardDescription>
            </CardHeader>
            
            {expandedSection === 'amplifiers' && (
              <CardContent>
                <div className="space-y-4">
                  {synergyData.environmentalAmplifiers.slice(0, 3).map((amplifier: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-md font-medium">{amplifier.factor}</h4>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
                          +{(amplifier.amplificationEffect * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {amplifier.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
            {selectedSupplements.length < 2 ? (
              <>
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Info className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Sélectionnez au moins 2 suppléments</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Choisissez plusieurs suppléments pour analyser leurs interactions synergiques potentielles.
                </p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-blue-100 p-3 mb-4 animate-pulse">
                  <Network className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Analyse en cours...</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Nous analysons les interactions synergiques entre vos suppléments sélectionnés.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Synergies les plus puissantes - Section informative */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Zap className="mr-2 h-5 w-5 text-amber-500" />
            Synergies les plus puissantes
          </CardTitle>
          <CardDescription>
            Découvrez les combinaisons qui offrent les effets synergiques les plus marqués
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSynergies.map((synergy, index) => {
              const supp1 = getSupplement(synergy.pair[0]);
              const supp2 = getSupplement(synergy.pair[1]);
              
              return (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Badge className="bg-white text-gray-800 border shadow-sm w-fit">
                        {supp1?.name || synergy.pair[0]}
                      </Badge>
                      <span className="hidden sm:inline">+</span>
                      <Badge className="bg-white text-gray-800 border shadow-sm w-fit">
                        {supp2?.name || synergy.pair[1]} 
                      </Badge>
                    </div>
                    <div 
                      className="text-xs font-semibold px-2 py-1 rounded-full" 
                      style={{
                        backgroundColor: `${SYNERGY_CATEGORY_COLORS[synergy.category]}33`,
                        color: SYNERGY_CATEGORY_COLORS[synergy.category]
                      }}
                    >
                      {getCategoryLabel(synergy.category)}
                    </div>
                  </div>
                  <div className="p-3 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Force de la synergie</span>
                      <span className="text-sm">{(synergy.synergyScore * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{
                          width: `${synergy.synergyScore * 100}%`,
                          backgroundColor: SYNERGY_CATEGORY_COLORS[synergy.category]
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-700 mb-2">
                      <span className="font-medium">Mécanisme:</span> {synergy.mechanism}
                    </p>
                    <p className="text-xs text-gray-700">
                      <span className="font-medium">Bénéfice:</span> {synergy.effect}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Fonction utilitaire pour obtenir le libellé lisible d'une catégorie
function getCategoryLabel(category: SynergyCategory): string {
  switch (category) {
    case 'absorption':
      return 'Absorption améliorée';
    case 'metabolism':
      return 'Métabolisme optimisé';
    case 'function':
      return 'Fonction potentialisée';
    case 'protection':
      return 'Protection synergique';
    case 'elimination':
      return 'Élimination soutenue';
    default:
      return category;
  }
}